import CommunityProfile from '@components/Shared/CommunityProfile'
import { Card, CardBody } from '@components/UI/Card'
import { Community } from '@generated/lenstertypes'
import React, { FC } from 'react'

interface Props {
  communities: Community[]
}

const List: FC<Props> = ({ communities }) => {
  return (
    <Card className="p-4">
      <CardBody>
        {communities.map((community: Community) => (
          <div key={community?.id} className='mb-5'>
            <CommunityProfile community={community} />
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export default List
