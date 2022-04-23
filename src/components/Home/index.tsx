import ExploreFeed from '@components/Explore/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import AppContext from '@components/utils/AppContext'
import { NextPage } from 'next'
import React, { useContext } from 'react'

import HomeFeed from './Feed'
// import Hero from './Hero'

const Home: NextPage = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <>
      {/* {!currentUser && <Hero />} */}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentUser ? <HomeFeed /> : <ExploreFeed />}
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default Home
