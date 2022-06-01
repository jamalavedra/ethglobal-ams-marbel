import { LensterPost } from '@generated/lenstertypes'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import Markup from '@components/Shared/Markup'
import Link from 'next/link'
import UserProfile from '@components/Shared/UserProfile'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
interface Props {
  post: LensterPost
}

dayjs.extend(relativeTime)

const PostBodyForum: FC<Props> = ({ post }) => {
  const { pathname } = useRouter()
  const [showMore, setShowMore] = useState<boolean>(
    post?.metadata?.content?.length > 250
  )
  return (
    <div className="break-words">
      <>
        <Link href={`/posts/${post?.id}`}>
          <a className="hover:underline text-lg" href={`/posts/${post?.id}`}>
            <Markup>{post?.metadata?.content}</Markup>
          </a>
        </Link>

        {showMore && pathname !== '/posts/[id]' && (
          <button
            type="button"
            className="mt-2 text-sm font-bold"
            onClick={() => setShowMore(!showMore)}
          >
            Show more
          </button>
        )}
      </>
    </div>
  )
}

export default PostBodyForum
