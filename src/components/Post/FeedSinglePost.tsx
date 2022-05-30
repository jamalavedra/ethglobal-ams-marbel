// import Attachments from '@components/Shared/Attachments'
// import IFramely from '@components/Shared/IFramely'
import Author from '@components/Shared/Author'
import { Card, CardBody } from '@components/UI/Card'
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

    // <Card>
    //   <CardBody>
    //     <PostType post={post} hideType={true} />

    //     <div className="flex space-x-3 w-full">

    // <div>
    //   <p className="text-sm text-gray-500 leading-7">
    //     {index + 1 + '.'}
    //   </p>
    // </div>

    //       <div className="flex-1">
    //         <PostBody post={post} hideType={true} />
    //         <div
    //           className={`flex  py-2`}
    //         >
    //           <div>
    //             <Author
    //               post={post}
    //               profile={
    //                 post?.__typename === 'Mirror'
    //                   ? post?.mirrorOf?.profile
    //                   : post?.profile
    //               }
    //             />
    //           </div>
    //           <div className="flex ml-1">
    //             <Link href={`/posts/${post?.id}`}>
    //               <a href={`/posts/${post?.id}`}>
    //                 <span className="text-xs text-gray-400 hover:underline">
    //                   {' | ' +
    //                     humanize(post?.stats?.totalAmountOfComments) +
    //                     ' comments'}
    //                 </span>
    //                 {currentUser?.id === post?.profile?.id && (
    //                   <Delete post={post} />
    //                 )}
    //               </a>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>

    //         <div>
    //           <Mirror post={post} />
    //         </div>

    //     </div>
    //   </CardBody>
    // </Card>
  )
}

export default SinglePost
