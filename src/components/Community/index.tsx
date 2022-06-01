import { gql, useQuery } from '@apollo/client'
import Feed from './Feed'
import { GridItemTwelve, GridLayout } from '@components/GridLayout'
import { Spinner } from '@components/UI/Spinner'
import { CommunityFields } from '@gql/CommunityFields'
import consoleLog from '@lib/consoleLog'
import { useRouter } from 'next/router'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
// import { getFeed } from '@pages/api/community/feed' // Repo
import { Community } from '@generated/lenstertypes'
import FeedType from './FeedType'
import React, { useState } from 'react'
import SEO from '@components/utils/SEO'
import Details from './Details'

const COMMUNITY_QUERY = gql`
  query Community($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...CommunityFields
      }
    }
  }
  ${CommunityFields}
`

export default function ViewCommunity({ community }: { community: Community }) {
  // console.log(community)

  const [feedType, setFeedType] = useState<string>('TRENDING')

  const {
    query: { id }
  } = useRouter()
  const { data, loading, error } = useQuery(COMMUNITY_QUERY, {
    variables: { request: { publicationId: id } },
    skip: !id,
    onCompleted(data) {
      console.log('COMMUNITY_QUERY', data)
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched community details Community:${id}`
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
  if (
    !data.publication ||
    data.publication?.metadata?.attributes[0]?.value !== 'community'
  )
    return <Custom404 />

  return (
    <GridLayout>
      <SEO title={`${data?.publication?.metadata?.name} • Marbel`} />

      <GridItemTwelve>
        <div className="flex w-full m-auto h-auto justify-center items-center">
          <Details community={data.publication} />
        </div>
      </GridItemTwelve>

      <GridItemTwelve className="space-y-5">
        <FeedType
          setFeedType={setFeedType}
          feedType={feedType}
          post={data.publication}
        />
        {/* <Feed post={data.publication} type="community post" /> */}
        <Feed post={data.publication} sortCriteria={feedType} />
      </GridItemTwelve>
    </GridLayout>
  )
}
