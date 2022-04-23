import { Profile, Post } from '@generated/types'
import Link from 'next/link'
import React, { FC } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  profile: Profile
  post: Post
}

const Author: FC<Props> = ({ profile, post }) => {
  return (
    <Link href={`/u/${profile?.handle}`}>
      <a href={`/u/${profile?.handle}`}>
        <span className={`text-xs text-gray-400`}>
          {dayjs(new Date(post?.createdAt)).fromNow() +
            ' by ' +
            profile?.handle}
        </span>
      </a>
    </Link>
  )
}

export default Author
