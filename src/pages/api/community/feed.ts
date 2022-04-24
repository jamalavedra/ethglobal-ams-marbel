// Types
import type { NextApiRequest, NextApiResponse } from 'next'
import { Community } from '@generated/lenstertypes'
import { gql, useQuery } from '@apollo/client'
import { CommunityFields } from '@gql/CommunityFields'

const COMMUNITY_QUERY = gql`
  query Community($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...CommunityFields
      }
    }
  }
  ${CommunityFields}
`

export const getFeed = async (id: string): Promise<Community[]> => {
  const { data } = useQuery(COMMUNITY_QUERY, {
    variables: { request: { publicationId: id } },
    skip: !id
  })
  console.log(data?.publication)
  return data?.publication
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Check authentication
  const { id }: { id: string } = req.body
  console.log(id)
  try {
    // Collect and send gates
    const feed: Community[] = await getFeed(id)
    res.status(200).send(feed)
  } catch (e) {
    // Else, return error
    res.status(500).send({ error: String(e) })
  }
}
