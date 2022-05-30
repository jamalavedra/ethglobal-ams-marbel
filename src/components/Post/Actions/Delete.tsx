import { gql, useMutation } from '@apollo/client'
import { LensterPost } from '@generated/lenstertypes'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

export const HIDE_POST_MUTATION = gql`
  mutation HidePublication($request: HidePublicationRequest!) {
    hidePublication(request: $request)
  }
`

interface Props {
  post: LensterPost
}

const Delete: FC<Props> = ({ post }) => {
  const { pathname, push } = useRouter()
  const [hidePost] = useMutation(HIDE_POST_MUTATION, {
    onCompleted() {
      pathname === '/posts/[id]' ? push('/') : location.reload()
    }
  })

  return (
    <span
      onClick={() => {
        if (confirm('Are you sure you want to delete?')) {
          hidePost({ variables: { request: { publicationId: post?.id } } })
        }
      }}
      className="text-xs cursor-pointer font-medium text-gray-400 hover:underline"
    >
      {' | ' + ' delete'}
    </span>
  )
}

export default Delete
