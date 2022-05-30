import { Profile } from '@generated/types'
import clsx from 'clsx'
import Link from 'next/link'
import React, { FC } from 'react'
import Slug from './Slug'
import getAvatar from '@lib/getAvatar'

interface Props {
  profile: Profile
  showFollow?: boolean
  followStatusLoading?: boolean
  isFollowing?: boolean
  isBig?: boolean
}

const UserProfile: FC<Props> = ({
  profile,
  showFollow = false,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false
}) => {
  return (
    <div className="flex justify-between items-center">
      <Link href={`/u/${profile?.handle}`}>
        <a href={`/u/${profile?.handle}`}>
          <div className="flex items-top space-x-3">
            <img
              src={getAvatar(profile)}
              loading="lazy"
              className={clsx(
                isBig ? 'w-14 h-14' : 'w-10 h-10',
                'bg-gray-200 rounded-full border dark:border-gray-700/80'
              )}
              height={isBig ? 56 : 40}
              width={isBig ? 56 : 40}
              alt={profile?.handle}
            />
            <div className="flex gap-1 justify-start items-start  truncate max-w-sm">
              <div
                className={clsx(isBig ? 'font-bold' : 'text-md font-medium')}
              >
                {profile?.name ?? profile?.handle}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default UserProfile
