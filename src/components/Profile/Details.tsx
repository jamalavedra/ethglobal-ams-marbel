import {
  GridItemFour,
  GridItemSix,
  GridItemTwo,
  GridLayout
} from '@components/GridLayout'
import Markup from '@components/Shared/Markup'
import Slug from '@components/Shared/Slug'
import { useENS } from '@components/utils/hooks/useENS'
import { Profile } from '@generated/types'
import { HashtagIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import formatAddress from '@lib/formatAddress'
import getAttribute from '@lib/getAttribute'
import getAvatar from '@lib/getAvatar'
import { useTheme } from 'next-themes'
import React, { FC, ReactElement } from 'react'
import { STATIC_ASSETS } from 'src/constants'

interface Props {
  profile: Profile
}

const Details: FC<Props> = ({ profile }) => {
  const { resolvedTheme } = useTheme()
  const { data: ensName } = useENS(profile?.ownedBy ?? '')

  const MetaDetails = ({
    children,
    icon
  }: {
    children: ReactElement
    icon: ReactElement
  }) => (
    <div className="flex gap-2 items-center">
      {icon}
      {children}
    </div>
  )

  return (
    <div className="px-5 mb-4 space-y-5 sm:px-0">
      <GridLayout>
        <GridItemTwo>
          <div className="w-32 h-32 sm:w-52 sm:h-52">
            <img
              src={getAvatar(profile)}
              className="w-32 h-32 bg-gray-200 rounded-full ring-8 ring-gray-50 sm:w-40 sm:h-40 dark:bg-gray-700 dark:ring-black"
              height={128}
              width={128}
              alt={profile?.handle}
            />
          </div>
        </GridItemTwo>
        <GridItemSix>
          <div className="py-2 space-y-1">
            <div className="flex gap-1.5 items-center text-2xl font-bold">
              <div className="truncate">{profile?.name ?? profile?.handle}</div>
            </div>
            <div className="flex items-center space-x-3">
              {profile?.name ? (
                <Slug slug={profile?.handle} prefix="@" />
              ) : (
                <Slug slug={formatAddress(profile?.ownedBy)} />
              )}
            </div>
          </div>
          <div className="space-y-5">
            {profile?.bio && (
              <div className="mr-0 leading-7 sm:mr-10 linkify">
                <Markup>{profile?.bio}</Markup>
              </div>
            )}
            <div className="w-full divider" />
            <div className="space-y-2">
              <MetaDetails icon={<HashtagIcon className="w-4 h-4" />}>
                {profile?.id}
              </MetaDetails>
              {getAttribute(profile?.attributes, 'location') && (
                <MetaDetails icon={<LocationMarkerIcon className="w-4 h-4" />}>
                  {getAttribute(profile?.attributes, 'location') as any}
                </MetaDetails>
              )}
              {ensName && (
                <MetaDetails
                  icon={
                    <img
                      src={`${STATIC_ASSETS}/brands/ens.svg`}
                      className="w-4 h-4"
                      height={16}
                      width={16}
                      alt="ENS Logo"
                    />
                  }
                >
                  {ensName as any}
                </MetaDetails>
              )}
              {getAttribute(profile?.attributes, 'website') && (
                <MetaDetails
                  icon={
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${getAttribute(
                        profile?.attributes,
                        'website'
                      )
                        ?.replace('https://', '')
                        .replace('http://', '')}`}
                      className="w-4 h-4 rounded-full"
                      height={16}
                      width={16}
                      alt="Website"
                    />
                  }
                >
                  <a
                    href={`https://${getAttribute(
                      profile?.attributes,
                      'website'
                    )
                      ?.replace('https://', '')
                      .replace('http://', '')}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {getAttribute(profile?.attributes, 'website')
                      ?.replace('https://', '')
                      .replace('http://', '')}
                  </a>
                </MetaDetails>
              )}
              {getAttribute(profile?.attributes, 'twitter') && (
                <MetaDetails
                  icon={
                    resolvedTheme === 'dark' ? (
                      <img
                        src={`${STATIC_ASSETS}/brands/twitter-light.svg`}
                        className="w-4 h-4"
                        height={16}
                        width={16}
                        alt="Twitter Logo"
                      />
                    ) : (
                      <img
                        src={`${STATIC_ASSETS}/brands/twitter-dark.svg`}
                        className="w-4 h-4"
                        height={16}
                        width={16}
                        alt="Twitter Logo"
                      />
                    )
                  }
                >
                  <a
                    href={`https://twitter.com/${getAttribute(
                      profile?.attributes,
                      'twitter'
                    )}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {getAttribute(profile?.attributes, 'twitter')?.replace(
                      'https://twitter.com/',
                      ''
                    )}
                  </a>
                </MetaDetails>
              )}
            </div>
          </div>
        </GridItemSix>
      </GridLayout>
    </div>
  )
}

export default Details
