// Types
import { Community } from '@generated/lenstertypes'
import { ApolloServer } from 'apollo-server'

export const getFeed = async (id) => {
  // const { data } = useQuery(COMMUNITY_QUERY, {
  //   variables: { request: { publicationId: id } },
  //   skip: !id
  // })
  console.log(data?.publication)
  return []
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
