import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import consoleLog from '@lib/consoleLog'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import NewComment from './NewComment'
import dynamic from 'next/dynamic'

const NewPostModal = dynamic(() => import('../Post/NewPost/Modal'))

const COMMENT_FEED_QUERY = gql`
  query CommentFeed($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${CommentFields}
`

interface Props {
  post: LensterPost
  type?: 'comment' | 'community post'
  onlyFollowers?: boolean
  isFollowing?: boolean
}

const Feed: FC<Props> = ({
  post,
  type = 'comment',
  onlyFollowers = false,
  isFollowing = true
}) => {
  const {
    query: { id }
  } = useRouter()
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore, refetch } = useQuery(
    COMMENT_FEED_QUERY,
    {
      variables: {
        request: { commentsOf: id, limit: 10 }
      },
      skip: !id,
      onCompleted(data) {
        setPageInfo(data?.publications?.pageInfo)
        setPublications(data?.publications?.items)
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched first 10 comments of Publication:${id}`
        )
      }
    }
  )

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            commentsOf: post?.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.publications?.pageInfo)
        setPublications([...publications, ...data?.publications?.items])
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched next 10 comments of Publication:${id} Next:${pageInfo?.next}`
        )
      })
    }
  })

  return (
    <>
      <NewPostModal refetch={refetch} post={post} type={type} />
      {loading && (
        <div className="flex flex-grow justify-center items-center h-screen animate-pulse">
          <span className="flex justify-center p-5">
            <Spinner size="sm" />
          </span>
        </div>
      )}
      {data?.publications?.items?.length === 0 && (
        <EmptyState
          message={<span>Be the first one to share!</span>}
          icon={'📕 🌟 🧠'}
        />
      )}
      <ErrorMessage title="Failed to load comment feed" error={error} />
      {!error && !loading && (
        <>
          <div className="space-y-3">
            {publications?.map((post: LensterPost, index: number) => (
              <SinglePost
                key={`${post?.id}_${index}`}
                index={index}
                post={post}
                hideType
              />
            ))}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Feed