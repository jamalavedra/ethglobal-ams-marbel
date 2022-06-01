import { gql, useQuery } from '@apollo/client'
import Feed from '@components/Comment/Feed'
import { GridItemEight, GridLayout } from '@components/GridLayout'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ZERO_ADDRESS } from 'src/constants'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'

import ForumPost from './ForumPost'

export const POST_QUERY = gql`
  query Post(
    $request: PublicationQueryRequest!
    $followRequest: DoesFollowRequest!
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
      ... on Comment {
        ...CommentFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
      ... on Mirror {
        ...MirrorFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
    }
    doesFollow(request: $followRequest) {
      follows
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

const ViewPost: NextPage = () => {
  const {
    query: { id }
  } = useRouter()

  const { currentUser } = useContext(AppContext)
  const { data, loading, error } = useQuery(POST_QUERY, {
    variables: {
      request: { publicationId: id },
      followRequest: {
        followInfos: {
          followerAddress: currentUser?.ownedBy
            ? currentUser?.ownedBy
            : ZERO_ADDRESS,
          profileId: id?.toString().split('-')[0]
        }
      }
    },
    skip: !id,
    onCompleted() {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched publication details Publication:${id}`
      )
    }
  })

  if (error) return <Custom500 />
  if (loading || !data)
    return (
      <div className="flex flex-grow justify-center items-center h-screen animate-pulse">
        <span className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      </div>
    )
  if (!data.publication) return <Custom404 />

  const post: LensterPost = data.publication

  return (
    <GridLayout>
      <SEO
        title={`${post?.__typename} by @${post?.profile?.handle} • Marbel`}
      />
      <GridItemEight>
        <ForumPost post={post} />
        <Feed
          comments={true}
          post={post}
          onlyFollowers={
            post?.referenceModule?.__typename ===
            'FollowOnlyReferenceModuleSettings'
          }
          isFollowing={data?.doesFollow[0]?.follows}
        />
      </GridItemEight>
    </GridLayout>
  )
}

export default ViewPost
