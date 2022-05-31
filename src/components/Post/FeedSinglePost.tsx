// import Attachments from '@components/Shared/Attachments'
// import IFramely from '@components/Shared/IFramely'
import Author from '@components/Shared/Author'
import { LensterPost } from '@generated/lenstertypes'
// import getURLFromPublication from '@lib/getURLFromPublication'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
import Link from 'next/link'
import React, { FC } from 'react'
import humanize from '@lib/humanize'

import PostBody from './PostBody'

import { useContext } from 'react'
import Delete from './Actions/Delete'
import AppContext from '@components/utils/AppContext'

interface Props {
  post: LensterPost
  index?: number
}

const SinglePost: FC<Props> = ({ post, index = 0 }) => {
  const { currentUser } = useContext(AppContext)

  return (
    <tr>
      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
        <div>
          <PostBody post={post} hideType={true} />
          <div className={`flex  py-2`}>
            <div>
              <Author
                post={post}
                profile={
                  post?.__typename === 'Mirror'
                    ? post?.mirrorOf?.profile
                    : post?.profile
                }
              />
            </div>
            <div className="flex ml-1">
              <Link href={`/posts/${post?.id}`}>
                <a href={`/posts/${post?.id}`}>
                  {currentUser?.id === post?.profile?.id && (
                    <Delete post={post} />
                  )}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 text-sm font-medium py-2 text-gray-900 whitespace-nowrap">
        {humanize(post?.stats?.totalAmountOfMirrors)}
      </td>
      <td className="px-4 text-sm font-medium py-2 text-gray-900 whitespace-nowrap">
        {humanize(post?.stats?.totalAmountOfComments)}
      </td>
      <td className="px-4 text-sm py-2 text-gray-700 whitespace-nowrap">
        {dayjs(new Date(post?.createdAt)).fromNow()}
      </td>
    </tr>
  )
}

export default SinglePost
