import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { CommunityFields } from '@gql/CommunityFields'
import { FireIcon, PlusIcon } from '@heroicons/react/outline'
import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import Custom500 from 'src/pages/500'

import List from './List'

const COMMUNITY_QUERY = gql`
  query (
    $topCommented: ExplorePublicationRequest!
    $topCollected: ExplorePublicationRequest!
  ) {
    topCommented: explorePublications(request: $topCommented) {
      items {
        ... on Post {
          ...CommunityFields
        }
      }
    }
    topCollected: explorePublications(request: $topCollected) {
      items {
        ... on Post {
          ...CommunityFields
        }
      }
    }
  }
  ${CommunityFields}
`

const Communities: NextPage = () => {
  const { data, loading, error } = useQuery(COMMUNITY_QUERY, {
    variables: {
      topCommented: {
        sources: 'Marble',
        sortCriteria: 'TOP_COMMENTED',
        publicationTypes: ['POST'],
        limit: 8
      },
      topCollected: {
        sources: 'Marble',
        sortCriteria: 'TOP_COLLECTED',
        publicationTypes: ['POST'],
        limit: 8
      }
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

  return (
    <GridLayout>
      <GridItemSix>
        <div className="flex items-center mb-2 space-x-1.5 font-bold text-gray-500">
          <FireIcon className="w-5 h-5 text-yellow-500" />
          <div>Most Active</div>
        </div>
        <List communities={data?.topCommented.items} />
      </GridItemSix>
      <GridItemSix>
        <Button icon={<PlusIcon className="w-4 h-4" />}>
          <Link href={'/create/community'}>
            <a href={'/create/community'}>{'Create Community'}</a>
          </Link>
        </Button>
      </GridItemSix>
    </GridLayout>
  )
}

export default Communities
