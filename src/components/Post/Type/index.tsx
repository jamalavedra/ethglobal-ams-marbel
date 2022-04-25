import { LensterPost } from '@generated/lenstertypes'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import Commented from './Commented'
import CommunityPost from './CommunityPost'

interface Props {
  post: LensterPost
  hideType?: boolean
}

const PostType: FC<Props> = ({ post, hideType }) => {
  const { pathname } = useRouter()
  const postType = post?.metadata?.attributes[0]?.value

  return (
    <>
      {post?.__typename === 'Comment' &&
        !hideType &&
        postType !== 'community post' && <Commented post={post} />}
      {postType === 'community post' && pathname !== '/communities/[id]' && (
        <CommunityPost post={post} />
      )}
    </>
  )
}

export default PostType
