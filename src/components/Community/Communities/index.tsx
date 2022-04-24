import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { CommunityFields } from '@gql/CommunityFields'
import { FireIcon, GlobeAltIcon, PlusIcon } from '@heroicons/react/outline'
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
     
        <div className="py-12 mb-4 bg-white bg-hero">
      <div className="container px-5 mx-auto max-w-screen-xl">
        <div className="flex items-stretch py-8 w-full text-center sm:py-12 sm:text-left">
          <div className="flex-1 flex-shrink-0 space-y-3">
            <div className="text-2xl font-extrabold text-black sm:text-4xl">
              Welcome to Marble 👋
            </div>
            <div className="leading-7 text-gray-700">
              Let your communities help you discover the worlds most interesting sites
            </div>
          </div>
        
          <div className="hidden flex-1 flex-shrink-0 w-full sm:block" />
      
        </div>
        <div className='flex'>
        <Button className='mr-2' outline icon={<GlobeAltIcon className="w-4 h-4" />}>
          <Link href={'/communities/0x05e1-0x09'}>
            <a href={'/communities/0x05e1-0x09'}>{'Explore a Community'}</a>
          </Link>
        </Button>
      
        <Button icon={<PlusIcon className="w-4 h-4" />}>
          <Link href={'/create/community'}>
            <a href={'/create/community'}>{'Create Community'}</a>
          </Link>
        </Button>
        </div>
      </div>
    </div>
      </GridItemSix>
      <GridItemSix>
        <div className="flex items-center mb-2 space-x-1.5 font-bold text-gray-500">
          <FireIcon className="w-5 h-5 text-yellow-500" />
          <div>Most Active Community</div>
        </div>
        <List communities={data?.topCommented.items} />
      </GridItemSix>

    </GridLayout>
  )
}

export default Communities
