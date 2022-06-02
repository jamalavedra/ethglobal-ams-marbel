import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

// import PostActions from './Actions'
import PostBodyForum from './PostBodyForum'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
}

const ThreadBody: FC<Props> = ({ post }) => {
  return (
    <div>
      <div className="flex justify-between space-x-1.5">
        <UserProfile
          profile={
            !!post?.collectedBy?.defaultProfile
              ? post?.collectedBy?.defaultProfile
              : post?.__typename === 'Mirror'
              ? post?.mirrorOf?.profile
              : post?.profile
          }
        />
        {post?.createdAt && (
          <Link href={`/posts/${post?.pubId ?? post?.id}`}>
            <a
              href={`/posts/${post?.pubId ?? post?.id}`}
              className="text-sm text-gray-500"
            >
              {dayjs(new Date(post?.createdAt)).fromNow()}
            </a>
          </Link>
        )}
      </div>
      <div className="flex">
        <div className="mr-8 ml-5 bg-gray-300 border-gray-300 dark:bg-gray-700 dark:border-gray-700 border-[0.8px] -my-[4px]" />
        <div className="pt-4 pb-5 w-full">
          <PostBodyForum post={post} />
          {/* <PostActions post={post} /> */}
        </div>
      </div>
    </div>
  )
}

export default ThreadBody
