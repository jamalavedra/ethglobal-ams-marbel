// import Attachments from '@components/Shared/Attachments'
// import IFramely from '@components/Shared/IFramely'
import { Card, CardBody } from '@components/UI/Card'
import { LensterPost } from '@generated/lenstertypes'
// import getURLFromPublication from '@lib/getURLFromPublication'

import Link from 'next/link'
import React, { FC } from 'react'
import humanize from '@lib/humanize'

import PostBodyComment from './PostBodyComment'
import PostType from './Type'
import Mirror from './Actions/Mirror'
import { useContext } from 'react'
import Delete from './Actions/Delete'
import AppContext from '@components/utils/AppContext'
import Comment from './Actions/Comment'
import { LinkIcon } from '@heroicons/react/solid'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { PUBLIC_URL } from 'src/constants'
import { Tooltip } from '@components/UI/Tooltip'

interface Props {
  post: LensterPost
  hideType?: boolean
}

const SinglePost: FC<Props> = ({ post, hideType = false }) => {
  const { currentUser } = useContext(AppContext)

  return (
    <Card>
      <CardBody>
        <PostType post={post} hideType={hideType} />

        <div className="w-full pb-4">
          <PostBodyComment post={post} hideType={false} />
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
              <Tooltip placement="top" content="Copy link to post">
                <CopyToClipboard
                  text={`${PUBLIC_URL}/posts/${post?.id ?? post?.pubId}`}
                  onCopy={() => {
                    toast.success('Copied to clipboard!')
                  }}
                >
                  <div className="cursor-pointer flex items-center">
                    <LinkIcon className="w-4 h-4 text-gray-400 hover:text-gray-500" />
                  </div>
                </CopyToClipboard>
              </Tooltip>
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
