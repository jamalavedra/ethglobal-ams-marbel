import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { PageLoading } from '@components/UI/PageLoading'
import { CommunityFields } from '@gql/CommunityFields'
import { FireIcon, PlusIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import React from 'react'
import Custom500 from 'src/pages/500'
import Link from 'next/link'
import List from './List'
import Footer from '@components/Shared/Footer'

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
        sources: 'Marbel',
        sortCriteria: 'TOP_COMMENTED',
        publicationTypes: ['POST'],
        limit: 8
      },
      topCollected: {
        sources: 'Marbel',
        sortCriteria: 'TOP_COLLECTED',
        publicationTypes: ['POST'],
        limit: 8
      }
    },
    onCompleted() {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched 10 TOP_COMMENTED and TOP_COLLECTED communities`
      )
    }
  })

  if (error) return <Custom500 />
  if (loading || !data) return <PageLoading message="" />

  return (
    <GridLayout>
      <GridItemSix>
        <div className="py-12 mb-4 bg-white bg-hero">
          <div className="container px-5 mx-auto max-w-screen-xl">
            <div className="flex items-stretch py-8 w-full text-center sm:py-12 sm:text-left">
              <div className="flex-1 flex-shrink-0 space-y-3">
                <div className="text-2xl font-extrabold text-black sm:text-4xl">
                  Welcome to Marbel 👋
                </div>
                <div className="leading-7 text-gray-700">
                  Let your communities help you discover the worlds most
                  interesting sites
                </div>
              </div>

              <div className="hidden flex-1 flex-shrink-0 w-full sm:block" />
            </div>
            <div className="flex">
              <Button icon={<PlusIcon className="w-4 h-4" />}>
                <Link href={'/create/community'}>
                  <a href={'/create/community'}>{'Create Community'}</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </GridItemSix>
      <GridItemSix>
        <div className="flex items-center mb-2 space-x-1.5 font-bold text-gray-500">
          <FireIcon className="w-5 h-5 text-yellow-500" />
          <div>Most Active Communities</div>
        </div>
        <List communities={data?.topCommented.items} />
      </GridItemSix>
    </GridLayout>
  )
}

export default Communities
