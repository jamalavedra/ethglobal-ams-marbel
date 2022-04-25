import 'linkify-plugin-mention'
import 'linkify-plugin-hashtag'

import { gql, useQuery } from '@apollo/client'
import Collectors from '@components/Shared/Collectors'
import { Modal } from '@components/UI/Modal'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { AnnotationIcon, UsersIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import humanize from '@lib/humanize'
import linkifyOptions from '@lib/linkifyOptions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import React, { FC, ReactChild, useContext, useState } from 'react'

import Join from './Join'

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
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false)
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
      <div className="pt-1 text-2xl font-bold">
        <div className="truncate">{community?.metadata?.name}</div>
      </div>
      <div className="space-y-5">
        {community?.metadata?.description && (
          <div className="mr-0 leading-7 sm:mr-10 linkify">
            <Linkify tagName="div" options={linkifyOptions}>
              {community?.metadata?.description}
            </Linkify>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {joinLoading ? (
            <div className="w-28 rounded-lg h-[34px] shimmer" />
          ) : joined ? (
            <div className="py-0.5 px-2 text-sm bg-white text-brand-600 font-medium rounded-lg shadow-sm border-brand-500 border-2 w-fit">
              Member
            </div>
          ) : (
            <Join community={community} setJoined={setJoined} />
          )}
        </div>
        <div className="space-y-2">
          <MetaDetails icon={<UsersIcon className="w-4 h-4" />}>
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
          </MetaDetails>
        </div>
      </div>
    </div>
  )
}

export default Details
