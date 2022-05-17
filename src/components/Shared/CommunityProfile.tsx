import { Community } from '@generated/lenstertypes'
import { UsersIcon } from '@heroicons/react/outline'
import humanize from '@lib/humanize'
import Link from 'next/link'
import React, { FC } from 'react'

interface Props {
  community: Community
}

const CommunityProfile: FC<Props> = ({ community }) => {
  return (
    <div className="flex justify-between items-center ">
      <Link href={`/communities/${community?.id}`}>
        <a href={`/communities/${community?.id}`} className='w-full hover:bg-gray-50 p-2 rounded-sm h-16'>
          <div className="flex items-center space-x-3">
            <div className="space-y-1">
              <div className="">{community?.metadata?.name}</div>
              <div className="text-sm text-gray-500">
                {community?.metadata?.description}
              </div>

              {/* <div className="flex items-center space-x-1 text-sm">
                <UsersIcon className="w-3 h-3" />
                <div>
                  {humanize(community?.stats?.totalAmountOfCollects)}{' '}
                  {'members'}
                </div>
              </div> */}
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default CommunityProfile
