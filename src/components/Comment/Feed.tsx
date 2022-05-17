import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import consoleLog from '@lib/consoleLog'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import NewComment from './NewComment'
import dynamic from 'next/dynamic'

const NewPostModal = dynamic(() => import('../Post/NewPost/Modal'))

function diff_hours(dt2:any, dt1:any) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }

function calculateScore(votes:number, itemHourAge:number, gravity:number) {
  return (votes ) / Math.pow((itemHourAge + 2), gravity);
}



function descendingComparator(
  a: { [key: string]: { [key: string]: any[] } },
  b: { [key: string]: { [key: string]: any[] } }
) {
  if (b['score'] < a['score']) {
    return -1
  }
  if (b['score'] > a['score']) {
    return 1
  }
  return 0
}

function getComparator(order: string) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b)
    : (a: any, b: any) => -descendingComparator(a, b)
}

function stableSort(array: any[], comparator: any) {
  const stabilizedThis = array.map((el, index) => [{score:calculateScore(el['stats']['totalAmountOfMirrors'],diff_hours(new Date(el['createdAt']), new Date()),1.8),...el}, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const COMMENT_FEED_QUERY = gql`
  query CommentFeed($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${CommentFields}
`

interface Props {
  post: LensterPost
  comments?: boolean
  type?: 'comment' | 'community post'
  onlyFollowers?: boolean
  isFollowing?: boolean
}

const Feed: FC<Props> = ({
  post,
  comments,
  type = 'comment',
  onlyFollowers = false,
  isFollowing = true
}) => {
  const {
    query: { id }
  } = useRouter()
  const [order, setOrder] = React.useState('desc')
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore, refetch } = useQuery(
    COMMENT_FEED_QUERY,
    {
      variables: {
        request: { commentsOf: id, limit: 10 }
      },
      skip: !id,
      onCompleted(data) {
        setPageInfo(data?.publications?.pageInfo)
        // stats?.totalAmountOfMirrors
        setPublications(data?.publications?.items)
        console.log(data?.publications?.items)
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched first 10 comments of Publication:${id}`
        )
      }
    }
  )

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
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
        setPublications([...publications, ...data?.publications?.items])
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched next 10 comments of Publication:${id} Next:${pageInfo?.next}`
        )
      })
    }
  })

  return (
    <>
      {!comments && <NewPostModal post={post} />}
      {loading && (
        <div className="flex flex-grow justify-center items-center h-screen animate-pulse">
          <span className="flex justify-center p-5">
            <Spinner size="sm" />
          </span>
        </div>
      )}
      <ErrorMessage title="Failed to load comment feed" error={error} />
      {!error && !loading && (
        <>
          <div className={`${!comments ? 'space-y-3' : ''}`}>
            {stableSort(publications, getComparator(order))?.map(
              (post: LensterPost, index: number) => (
                <SinglePost
                  key={`${post?.id}_${index}`}
                  index={index}
                  post={post}
                  hideType={comments}
                />
              )
            )}
          </div>
          <p className='text-gray-400 text-sm'>Posts ranked with <a href='https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d#.x86yaez0u' target="_blank" rel="noreferrer noopener" className='text-red-300 font-medium pointer hover:underline'>the hackernews algorithm</a></p>

          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
      {comments && (
        <div className="mt-5">
          <NewComment refetch={refetch} post={post} type={type} />
        </div>
      )}
    </>
  )
}

export default Feed
 