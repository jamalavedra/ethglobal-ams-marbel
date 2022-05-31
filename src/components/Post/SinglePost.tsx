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
import Delete from './Actions/Delete'
import AppContext from '@components/utils/AppContext'
import Comment from './Actions/Comment'

interface Props {
  post: LensterPost
  index?: number
  postPage?: boolean
  hideType?: boolean
}

const SinglePost: FC<Props> = ({
  post,
  index = 0,
  postPage = false,
  hideType = false
}) => {
  const { currentUser } = useContext(AppContext)

  return (
    <Card>
      <CardBody>
        <PostType post={post} hideType={hideType} />

        <div className="w-full pb-4">
          <PostBody post={post} hideType={false} />
          <div className="flex pl-14 py-2 w-full">
            <div className="grow">
              <Link href={`/posts/${post?.id}`}>
                <a
                  href={`/posts/${post?.id}`}
                  className="text-xs font-medium text-gray-400 hover:underline"
                >
                  {humanize(post?.stats?.totalAmountOfComments) + ' Replies'}
                </a>
              </Link>
              {currentUser?.id === post?.profile?.id && <Delete post={post} />}
            </div>

            <div className="flex gap-8 items-center">
              <Mirror post={post} />
              <Comment post={post} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default SinglePost
