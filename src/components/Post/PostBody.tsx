import { LensterPost } from '@generated/lenstertypes'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import Markup from '@components/Shared/Markup'
import Link from 'next/link'

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
              <h1 className="text-2xl font-medium border-b pb-5 border-gray-100">
                <Markup>{post?.metadata?.content}</Markup>
              </h1>
            )}

            <div className="p-5 leading-7 whitespace-pre-wrap break-words linkify">
              <Markup>{post?.metadata?.description}</Markup>
            </div>
          </div>
        ) : (
          <Link href={`/posts/${post?.id}`}>
            <a className="hover:underline" href={`/posts/${post?.id}`}>
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
