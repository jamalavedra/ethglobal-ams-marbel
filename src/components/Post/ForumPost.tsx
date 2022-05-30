// import Attachments from '@components/Shared/Attachments'
// import IFramely from '@components/Shared/IFramely'
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

interface Props {
  post: LensterPost
}

const ForumPost: FC<Props> = ({ post }) => {
  const { currentUser } = useContext(AppContext)

  return (
    <Card>
      <CardBody>
        <PostType post={post} hideType={true} />

        <div className="w-full">
          <PostBody post={post} hideType={false} />
          <div className="flex py-2 w-full ml-1">
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

            <div>
              <Mirror post={post} />
            </div>
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

export default ForumPost
