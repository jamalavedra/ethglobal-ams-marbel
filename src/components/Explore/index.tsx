import { GridItemEight, GridLayout } from '@components/GridLayout'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Feed from './Feed'
import FeedType from './FeedType'

const Explore: NextPage = () => {
  const {
    query: { type }
  } = useRouter()
  const [feedType, setFeedType] = useState<string>(
    type &&
      ['top_commented', 'top_collected', 'latest'].includes(type as string)
      ? type?.toString().toUpperCase()
      : 'TOP_COMMENTED'
  )

  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <FeedType setFeedType={setFeedType} feedType={feedType} />
        <Feed feedType={feedType} />
      </GridItemEight>
    </GridLayout>
  )
}

export default Explore
