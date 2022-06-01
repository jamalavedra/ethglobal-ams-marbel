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
  hideType?: boolean
}

dayjs.extend(relativeTime)

const PostBody: FC<Props> = ({ post, hideType = true }) => {
  const { pathname } = useRouter()
  const [showMore, setShowMore] = useState<boolean>(
    post?.metadata?.content?.length > 250
  )
  return (
    <div className="break-words">
      <>
        {!hideType ? (
          <div
            className={clsx({
              'line-clamp-5 text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-400 dark:to-gray-900':
                showMore && pathname !== '/posts/[id]'
            })}
          >
            <div className="py-5 leading-7 whitespace-pre-wrap break-words linkify">
            <h1 className='font-medium border-b border-gray-200 text-2xl pb-3 mb-5'><Markup>{post?.metadata?.content}</Markup></h1>
              <div className="flex justify-between pb-4 space-x-1.5">
                <UserProfile
                  profile={
                    !!post?.collectedBy?.defaultProfile
                      ? post?.collectedBy?.defaultProfile
                      : post?.__typename === 'Mirror'
                      ? post?.mirrorOf?.profile
                      : post?.profile
                  }
                />
                <Link href={`/posts/${post?.id}`}>
                  <a
                    href={`/posts/${post?.id}`}
                    className="text-sm text-gray-500"
                  >
                    {dayjs(new Date(post?.createdAt)).fromNow()}
                  </a>
                </Link>
              </div>
              <div className="ml-14">
                <Markup>{post?.metadata?.description}</Markup>
              </div>
            </div>
          </div>
        ) : (
          <Link href={`/posts/${post?.id}`}>
            <a className="hover:underline text-lg" href={`/posts/${post?.id}`}>
              <Markup>{post?.metadata?.content}</Markup>
            </a>
          </Link>
        )}
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

export default PostBody
