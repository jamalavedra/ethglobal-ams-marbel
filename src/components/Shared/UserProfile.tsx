import { Profile } from '@generated/types'
import clsx from 'clsx'
import Link from 'next/link'
import React, { FC } from 'react'
import Slug from './Slug'

interface Props {
  profile: Profile
  showBio?: boolean
  showFollow?: boolean
  followStatusLoading?: boolean
  isFollowing?: boolean
  isBig?: boolean
}

const UserProfile: FC<Props> = ({
  profile,
  showBio = false,
  showFollow = false,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false
}) => {
  return (
    <div className="flex justify-between items-center">
      <Link href={`/u/${profile?.handle}`}>
        <a href={`/u/${profile?.handle}`}>
          <div className="flex items-center space-x-3">
            <div>
              <Slug className="text-sm" slug={profile?.handle} prefix="@" />
              {showBio && profile?.bio && (
                <div className={clsx(isBig ? 'text-md' : 'text-sm', 'mt-2')}>
                  {profile?.bio}
                </div>
              )}
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default UserProfile
