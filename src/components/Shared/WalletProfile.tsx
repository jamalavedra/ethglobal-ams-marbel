import { Wallet } from '@generated/types'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import formatAddress from '@lib/formatAddress'
import React, { FC } from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

import Slug from './Slug'

interface Props {
  wallet: Wallet
}

const WalletProfile: FC<Props> = ({ wallet }) => {
  return (
    <div className="flex justify-between items-center">
      <a
        href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
        className="flex items-center space-x-3"
        target="_blank"
        rel="noreferrer noopener"
      >
        <div>
          <div className="flex gap-1.5 items-center">
            <Slug className="text-sm" slug={formatAddress(wallet?.address)} />
            <ExternalLinkIcon className="w-4 h-4" />
          </div>
        </div>
      </a>
    </div>
  )
}

export default WalletProfile
