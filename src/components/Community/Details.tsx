import { gql, useQuery } from '@apollo/client'
import { LensterPost } from '@generated/lenstertypes'
import consoleLog from '@lib/consoleLog'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { FC, ReactChild, useContext, useState } from 'react'
import Markup from '@components/Shared/Markup'
import imagekitURL from '@lib/imagekitURL'
import AppContext from '@components/utils/AppContext'

dayjs.extend(relativeTime)

export const HAS_JOINED_QUERY = gql`
  query HasJoined($request: HasCollectedRequest!) {
    hasCollected(request: $request) {
      results {
        collected
      }
    }
  }
`

interface Props {
  community: LensterPost
}

const Details: FC<Props> = ({ community }) => {
  const { currentUser } = useContext(AppContext)
  const [joined, setJoined] = useState<boolean>(false)
  const { loading: joinLoading } = useQuery(HAS_JOINED_QUERY, {
    variables: {
      request: {
        collectRequests: {
          publicationIds: community.id,
          walletAddress: currentUser?.ownedBy
        }
      }
    },
    skip: !currentUser || !community,
    onCompleted(data) {
      setJoined(data?.hasCollected[0]?.results[0]?.collected)
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched has joined check Community:${community?.id} Joined:${joined}`
      )
    }
  })

  const [showMore, setShowMore] = useState<boolean>(
    community?.metadata?.description.length >150
  )

  const MetaDetails = ({
    children,
    icon
  }: {
    children: ReactChild
    icon: ReactChild
  }) => (
    <div className="flex gap-2 items-center">
      {icon}
      {children}
    </div>
  )

  return (
    <div className="px-5 mb-4 space-y-5 sm:px-0">
      <div className="relative w-full flex justify-center">
        <img
          src={imagekitURL(
            community?.metadata?.cover?.original?.url
              ? community?.metadata?.cover?.original?.url
              : `https://avatar.tobi.sh/${community?.id}.png`,
            'avatar'
          )}
          className="w-32 h-32 rounded-full ring-2 ring-gray-200 dark:bg-gray-700 dark:ring-gray-700/80"
          height={32}
          width={32}
          alt={community?.id}
        />
      </div>
      <div className="pt-1 text-2xl font-bold justify-center flex">
        <div className="truncate">{community?.metadata?.name}</div>
      </div>
      <div className="space-y-5">
        {community?.metadata?.description && (
          <div className="mr-0 w-96 sm:mr-10 p-5 leading-7 ¡break-words">
            <div
              className={clsx({
                'line-clamp-5 h-14 text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-400 dark:to-gray-900':
                  showMore
              })}
            >
              <div className="leading-7 whitespace-pre-wrap break-words linkify">
                <Markup>{community?.metadata?.content}</Markup>
              </div>
            </div>
            {showMore && (
              <button
                type="button"
                className="mt-2 text-sm font-bold"
                onClick={() => setShowMore(!showMore)}
              >
                Show more
              </button>
            )}
          </div>
        )}
        {/* <div className="flex items-center space-x-2">
          {joinLoading ? (
            <div className="w-28 rounded-lg h-[34px] shimmer" />
          ) : joined ? (
            <div className="py-0.5 px-2 text-sm bg-white text-brand-600 font-medium rounded-lg shadow-sm border-brand-500 border-2 w-fit">
              Member
            </div>
          ) : (
            <Join community={community} setJoined={setJoined} />
          )}
        </div> */}
        <div className="space-y-2">
          {/* <MetaDetails icon={<UsersIcon className="w-4 h-4" />}>
            <>
              <button
                type="button"
                onClick={() => setShowMembersModal(!showMembersModal)}
              >
                {humanize(community?.stats?.totalAmountOfCollects)}{' '}
                {community?.stats?.totalAmountOfCollects > 1
                  ? 'members'
                  : 'member'}
              </button>
              <Modal
                title="Members"
                icon={<UsersIcon className="w-5 h-5 text-brand" />}
                show={showMembersModal}
                onClose={() => setShowMembersModal(!showMembersModal)}
              >
                <Collectors pubId={community.id} />
              </Modal>
            </>
          </MetaDetails>
          <MetaDetails icon={<AnnotationIcon className="w-4 h-4" />}>
            <>
              {humanize(community?.stats?.totalAmountOfComments)}{' '}
              {community?.stats?.totalAmountOfComments > 1
                ? 'entries'
                : 'entry'}
            </>
          </MetaDetails> */}
        </div>
      </div>
    </div>
  )
}

export default Details
