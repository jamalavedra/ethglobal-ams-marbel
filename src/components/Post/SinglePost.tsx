// import Attachments from '@components/Shared/Attachments'
// import IFramely from '@components/Shared/IFramely'
import Author from '@components/Shared/Author'
import { Card, CardBody } from '@components/UI/Card'
import { LensterPost } from '@generated/lenstertypes'
// import getURLFromPublication from '@lib/getURLFromPublication'

import Link from 'next/link'
import React, { FC } from 'react'
import humanize from '@lib/humanize'

import PostBody from './PostBody'
import PostType from './Type'
import Mirror from './Actions/Mirror'
import { useContext } from 'react'
import AppContext from '@components/utils/AppContext'
import Delete from './Actions/Delete'

interface Props {
  post: LensterPost
  index: number
  postPage?: boolean
  hideType?: boolean
  comments?: boolean
}

const SinglePost: FC<Props> = ({
  post,
  index,
  postPage = false,
  comments = false,
  hideType = false
}) => {
  const { currentUser } = useContext(AppContext)

  return (
    <Card>
      <CardBody>
        <PostType post={post} hideType={hideType} />

        <div className="flex space-x-3 w-full">
          {!comments && !postPage && (
            <div>
              <p className="text-sm text-gray-500 leading-7">
                {index + 1 + '.'}
              </p>
            </div>
          )}

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
                    <span className="text-xs text-gray-400 hover:underline">
                      {' | ' +
                        humanize(post?.stats?.totalAmountOfComments) +
                        ' comments'}
                    </span>
                    {currentUser?.id === post?.profile?.id && (
                      <Delete post={post} />
                    )}
                  </a>
                </Link>
              </div>
            </div>
          </div>
          {!comments && (
            <div>
              <Mirror post={post} />
            </div>
          )}
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
