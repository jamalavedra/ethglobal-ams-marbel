import { gql, useQuery } from '@apollo/client'
import FeedSinglePost from '@components/Post/FeedSinglePost'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { CollectionIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import { useRouter } from 'next/router'
import React, { FC, useState, useMemo } from 'react'
import { useInView } from 'react-cool-inview'

const COMMENT_FEED_QUERY = gql`
  query CommentFeed($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${CommentFields}
`

function diff_hours(dt2: any, dt1: any) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000
  diff /= 60 * 60
  return Math.abs(Math.round(diff))
}

function calculateScore(votes: number, itemHourAge: number, gravity: number) {
  return votes / Math.pow(itemHourAge + 2, gravity)
}

interface Props {
  post: LensterPost
  sortCriteria: String
}

const Feed: FC<Props> = ({ post, sortCriteria }) => {
  const {
    query: { id }
  } = useRouter()
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(COMMENT_FEED_QUERY, {
    variables: {
      request: { commentsOf: id, limit: 10 }
    },
    skip: !id,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      console.log('COMMENT_FEED_QUERY', data.publications)
      setPageInfo(data?.publications?.pageInfo)
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched first 10 comments of Publication:${id}`
      )
    }
  })

  const { observe } = useInView({
    onEnter: () => {
      console.log('post', post)
      fetchMore({
        variables: {
          request: {
            commentsOf: post?.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.publications?.pageInfo)
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched next 10 comments of Publication:${id} Next:${pageInfo?.next}`
        )
      })
    }
  })

  const links = useMemo(() => {
    if (!data) return
    return data.publications.items.sort((a: any, b: any) => {
      if (sortCriteria == 'LATEST')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortCriteria == 'TOP')
        return b.stats.totalAmountOfMirrors - a.stats.totalAmountOfMirrors
      if (sortCriteria == 'TRENDING')
        return (
          calculateScore(
            b.stats.totalAmountOfMirrors+b.stats.totalAmountOfComments,
            diff_hours(new Date(b.createdAt), new Date()),
            1.8
          ) -
          calculateScore(
            a.stats.totalAmountOfMirrors+a.stats.totalAmountOfComments,
            diff_hours(new Date(a.createdAt), new Date()),
            1.8
          )
        )
    })
  }, [data, sortCriteria])

  return (
    <>
      {loading && (
        <div className="flex flex-grow justify-center items-center h-screen animate-pulse">
          <span className="flex justify-center p-5">
            <Spinner size="sm" />
          </span>
        </div>
      )}
      {links?.items?.length === 0 && (
        <EmptyState
          message={<span>Be the first one to comment!</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load comment feed" error={error} />

      {!error && !loading && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y-2 divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-medium text-left text-gray-500 whitespace-nowrap">
                    Topic
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-500 whitespace-nowrap">
                    Upvotes
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-500 whitespace-nowrap">
                    Replies
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-500 whitespace-nowrap">
                    Activity
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {links?.map((post: LensterPost, index: number) => (
                  <FeedSinglePost
                    key={`${post?.id}_${index}`}
                    index={index}
                    post={post}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {pageInfo?.next && links?.items?.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Feed
