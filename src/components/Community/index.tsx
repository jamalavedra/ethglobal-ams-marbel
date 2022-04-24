import { gql, useQuery } from '@apollo/client'
import Feed from '@components/Comment/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Spinner } from '@components/UI/Spinner'
import { CommunityFields } from '@gql/CommunityFields'
import consoleLog from '@lib/consoleLog'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
// import { getFeed } from '@pages/api/community/feed' // Repo
import { Community } from '@generated/lenstertypes'

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

  const {
    query: { id }
  } = useRouter()
  const { data, loading, error } = useQuery(COMMUNITY_QUERY, {
    variables: { request: { publicationId: id } },
    skip: !id,
    onCompleted() {
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
      <GridItemEight className="space-y-5">
        <Feed post={data.publication} type="community post" />
      </GridItemEight>

      <GridItemFour>
        <Details community={data.publication} />
      </GridItemFour>
    </GridLayout>
  )
}

// export async function getServerSideProps(context: any) {
//   // Collect repo from URL
//   const { id }: { id: string } = context.query

//   try {
//     // Throw if params not present
//     if (!id) throw new Error()
//     console.log(id)
//     // Collect repo (check admin access) or throw
//     const collections: Community[] = await getFeed(id)
//     if (collections.length === 0) throw new Error()

//     return {
//       props: {
//         collections
//       }
//     }
//   } catch {
//     // On error, redirect
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }
// }
