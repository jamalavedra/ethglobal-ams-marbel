// import Attachments from '@components/Shared/Attachments'
// import IFramely from '@components/Shared/IFramely'
import Author from '@components/Shared/Author'
import { Card, CardBody } from '@components/UI/Card'
import { LensterPost } from '@generated/lenstertypes'
import { ChevronUpIcon } from '@heroicons/react/solid'
// import getURLFromPublication from '@lib/getURLFromPublication'

import Link from 'next/link'
import React, { FC } from 'react'
import humanize from '@lib/humanize'

import PostBody from './PostBody'

interface Props {
  post: LensterPost
  index: number
  hideType?: boolean
}

const SinglePost: FC<Props> = ({ post, index, hideType = false }) => {
  return (
    <Card>
      <CardBody>
        <div className="flex space-x-3 w-full">
          <div>
            <p className="text-sm text-gray-500 leading-7">{index + '.'}</p>
          </div>

          <div className="flex-1">
            <PostBody post={post} />
            <div className="flex pb-4">
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
                    <span className="text-xs text-gray-400">
                      {' | ' +
                        humanize(post?.stats?.totalAmountOfComments) +
                        ' comments'}
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <button className="p-3 m-2 border rounded">
              <ChevronUpIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* {post?.metadata?.media?.length > 0 ? (
          <Attachments attachments={post?.metadata?.media} />
        ) : (
          post?.metadata?.content &&
   
          !!getURLFromPublication(post?.metadata?.content) && (
            <IFramely url={getURLFromPublication(post?.metadata?.content)} />
          )
        )} */}
      </CardBody>
    </Card>
  )
}

export default SinglePost
