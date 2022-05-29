import { Community } from '@generated/lenstertypes'
import { UsersIcon } from '@heroicons/react/outline'
import humanize from '@lib/humanize'
import Link from 'next/link'
import React, { FC } from 'react'
import imagekitURL from '@lib/imagekitURL'

interface Props {
  community: Community
}

const CommunityProfile: FC<Props> = ({ community }) => {
  return (
    <div className="flex justify-between items-center ">
      <Link href={`/communities/${community?.id}`}>
        <a
          href={`/communities/${community?.id}`}
          className="hover:bg-gray-50 w-full"
        >
          <div className="flex items-center space-x-3">
            <img
              src={imagekitURL(
                community?.metadata?.cover?.original?.url
                  ? community?.metadata?.cover?.original?.url
                  : `https://avatar.tobi.sh/${community?.id}.png`,
                'avatar'
              )}
              className="w-16 h-16 bg-gray-200 rounded-full border dark:border-gray-700/80"
              height={64}
              width={64}
              alt={community?.id}
            />
            <div className="space-y-1">
              <div className="">{community?.metadata?.name}</div>
              <div className="text-sm text-gray-500">
                {community?.metadata?.description}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default CommunityProfile
