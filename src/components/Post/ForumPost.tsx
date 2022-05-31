// import Attachments from '@components/Shared/Attachments'
// import IFramely from '@components/Shared/IFramely'
import { Card, CardBody } from '@components/UI/Card'
import { LensterPost } from '@generated/lenstertypes'
// import getURLFromPublication from '@lib/getURLFromPublication'
import dayjs from 'dayjs'

import React, { FC } from 'react'
import humanize from '@lib/humanize'

import PostBody from './PostBody'
import PostType from './Type'
import Mirror from './Actions/Mirror'
import { useContext } from 'react'
import Delete from './Actions/Delete'
import AppContext from '@components/utils/AppContext'
import Comment from './Actions/Comment'

interface Props {
  post: LensterPost
}

const ForumPost: FC<Props> = ({ post }) => {
  const { currentUser } = useContext(AppContext)

  return (
    <Card className="border-b border-gray-200">
      <CardBody>
        <PostType post={post} hideType={true} />

        <div className="w-full pb-4">
          <PostBody post={post} hideType={false} />
          <div className="flex pl-14 py-2 w-full">
            <div className="grow">
              {currentUser?.id === post?.profile?.id && <Delete post={post} />}
            </div>

            <div className="flex gap-8 items-center">
              <Mirror post={post} />
              <Comment post={post} />
            </div>
          </div>
          <div className="ml-14 max-w-xl border border-gray-200 bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Created on
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {dayjs(new Date(post?.createdAt)).format('MMMM D YYYY')}
                  </p>
                </div>
              </div>
              <div className="col-span-3">
                <div>
                  <p className="text-2xl font-medium text-center text-gray-800">
                    {humanize(post?.stats?.totalAmountOfComments)}
                  </p>
                  <p className="text-center text-xs font-medium text-gray-500">
                    replies
                  </p>
                </div>
              </div>
              <div className="col-span-3">
                <div>
                  <p className="text-2xl font-medium text-center text-gray-800">
                    {humanize(post?.stats?.totalAmountOfMirrors)}
                  </p>
                  <p className="text-center text-xs font-medium text-gray-500">
                    likes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default ForumPost
