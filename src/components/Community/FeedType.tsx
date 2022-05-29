import { TrendingUpIcon } from '@heroicons/react/outline'
import { ClockIcon } from '@heroicons/react/solid'
import trackEvent from '@lib/trackEvent'
import clsx from 'clsx'
import React, { Dispatch, FC, ReactChild } from 'react'
import dynamic from 'next/dynamic'
import { LensterPost } from '@generated/lenstertypes'

const NewPostModal = dynamic(() => import('../Post/NewPost/Modal'))

interface Props {
  setFeedType: Dispatch<string>
  feedType: string
  post: LensterPost
}

const FeedType: FC<Props> = ({ setFeedType, feedType, post }) => {
  interface FeedLinkProps {
    name: string
    icon: ReactChild
    type: string
    count?: number
  }

  const FeedLink: FC<FeedLinkProps> = ({ name, icon, type }) => (
    <button
      type="button"
      onClick={() => {
        trackEvent(`user ${name.toLowerCase()}`)
        setFeedType(type)
      }}
      className={clsx(
        {
          'text-brand bg-brand-100 dark:bg-opacity-20 bg-opacity-100 font-bold':
            feedType === type
        },
        'flex items-center space-x-2 rounded-lg px-4 sm:px-3 py-2 sm:py-1 text-brand hover:bg-brand-100 dark:hover:bg-opacity-20 hover:bg-opacity-100'
      )}
      aria-label={name}
    >
      {icon}
      <div className="hidden sm:block">{name}</div>
    </button>
  )

  return (
    <div className="flex">
      <div className="flex grow overflow-x-auto gap-3 px-5 pb-2 mt-3 sm:px-0 sm:mt-0 md:pb-0">
        <FeedLink
          name="Top"
          icon={<TrendingUpIcon className="w-4 h-4" />}
          type="TOP"
        />
        <FeedLink
          name="Latest"
          icon={<ClockIcon className="w-4 h-4" />}
          type="LATEST"
        />
      </div>
      <NewPostModal post={post} />
    </div>
  )
}

export default FeedType
