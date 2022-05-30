import { LensterPost } from '@generated/lenstertypes'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import Markup from '@components/Shared/Markup'
import Link from 'next/link'
import UserProfile from '@components/Shared/UserProfile'

interface Props {
  post: LensterPost
  hideType: boolean
}

const PostBody: FC<Props> = ({ post, hideType }) => {
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
            {post?.metadata?.content?.length > 0 && (
              <h1 className="text-2xl font-medium border-b pb-3 border-gray-200">
                <Markup>{post?.metadata?.content}</Markup>
              </h1>
            )}

            <div className="py-5 leading-7 whitespace-pre-wrap break-words linkify">
              <UserProfile
                profile={
                  !!post?.collectedBy?.defaultProfile
                    ? post?.collectedBy?.defaultProfile
                    : post?.__typename === 'Mirror'
                    ? post?.mirrorOf?.profile
                    : post?.profile
                }
              />
              <div className="pt-5">
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
