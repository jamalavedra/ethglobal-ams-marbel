// Types
import { Community } from '@generated/lenstertypes'
import { ApolloServer } from 'apollo-server'

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers })
  const { url } = await server.listen()
  console.log(`🚀 Server ready at ${url}`)
}

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

export const getFeed = async (id) => {
  const { data } = useQuery(COMMUNITY_QUERY, {
    variables: { request: { publicationId: id } },
    skip: !id
  })
  console.log(data?.publication)
  return data?.publication
}

export default async (req, res) => {
  // Check authentication
  const { id } = req.body
  console.log(id)
  try {
    // Collect and send gates
    const feed = await getFeed(id)
    res.status(200).send(feed)
  } catch (e) {
    // Else, return error
    res.status(500).send({ error: String(e) })
  }
}
