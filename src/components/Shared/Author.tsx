import { Profile, Post } from '@generated/types'
import Link from 'next/link'
import React, { FC } from 'react'

interface Props {
  profile: Profile
  post: Post
}

const Author: FC<Props> = ({ profile, post }) => {
  return (
    <Link href={`/u/${profile?.handle}`}>
      <a
        href={`/u/${profile?.handle}`}
        className={`text-sm text-gray-400 hover:underline`}
      >
        {' By ' + profile?.handle}
      </a>
    </Link>
  )
}

export default Author
