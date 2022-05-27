import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridItemTwelve, GridLayout } from '@components/GridLayout'
import SEO from '@components/utils/SEO'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState, ReactChild, FC } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Details from './Details'
import Feed from './Feed'
import NFTFeed from './NFTFeed'
import { Spinner } from '@components/UI/Spinner'
import { ChatAlt2Icon } from '@heroicons/react/solid'
import humanize from '@lib/humanize'
import clsx from 'clsx'

interface FeedLinkProps {
  name: string
  icon: ReactChild
  type: string
  count?: number
}

const FeedLink: FC<FeedLinkProps> = ({ name, icon, type, count = 0 }) => (
  <div
    className={clsx(
      {
        'text-brand bg-brand-100 dark:bg-opacity-20 bg-opacity-100 font-bold':
          false
      },
      'flex mb-4 items-center space-x-2 rounded-lg px-4 sm:px-3 py-2 sm:py-1 text-brand dark:hover:bg-opacity-20 hover:bg-opacity-100'
    )}
    aria-label={name}
  >
    {icon}
    <div className="hidden sm:block">{name}</div>
    {count ? (
      <div className="px-2 text-xs font-medium rounded-full bg-brand-200 dark:bg-brand-800">
        {humanize(count)}
      </div>
    ) : null}
  </div>
)

export const PROFILE_QUERY = gql`
  query Profile($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        handle
        ownedBy
        name
        attributes {
          key
          value
        }
        bio
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
        }
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
          ... on NftImage {
            uri
          }
        }
        coverPicture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        followModule {
          __typename
        }
      }
    }
  }
`

const ViewProfile: NextPage = () => {
  const {
    query: { username, type }
  } = useRouter()

  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { request: { handles: username } },
    skip: !username,
    onCompleted(data) {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched profile details Profile:${data?.profiles?.items[0]?.id}`
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
  if (data?.profiles?.items?.length === 0) return <Custom404 />

  const profile = data?.profiles?.items[0]

  return (
    <>
      {profile?.name ? (
        <SEO title={`${profile?.name} (@${profile?.handle}) • Lenster`} />
      ) : (
        <SEO title={`@${profile?.handle} • Lenster`} />
      )}

      <GridLayout className="pt-6">
        <GridItemTwelve>
          <Details profile={profile} />
        </GridItemTwelve>
        <GridItemTwelve className="space-y-5">
          <GridLayout className="pt-6">
            <GridItemSix>
              <FeedLink
                name="Posts"
                icon={<ChatAlt2Icon className="w-4 h-4" />}
                type="COMMENT"
                count={profile?.stats?.totalComments}
              />
              <Feed profile={profile} type={'COMMENT'} />
            </GridItemSix>
            <GridItemSix>
              <FeedLink
                name="Upvotes"
                icon={<ChatAlt2Icon className="w-4 h-4" />}
                type="COMMENT"
                count={profile?.stats?.totalMirrors}
              />
              <Feed profile={profile} type={'MIRROR'} />
            </GridItemSix>
          </GridLayout>

          <NFTFeed profile={profile} />
        </GridItemTwelve>
      </GridLayout>
    </>
  )
}

export default ViewProfile
