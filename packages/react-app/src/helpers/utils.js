import Arweave from 'arweave'

export const arweave = Arweave.init({})
export const APP_NAME = process.env.NEXT_PUBLIC_ARWEAVE_APP_NAME || "PERMA_VIDEO_APP_TEST_NAME"

export const createPostInfo = async (node) => {
  const ownerAddress = node.owner.address;
  const height = node.block ? node.block.height : -1;
  const timestamp = node.block ? parseInt(node.block.timestamp, 10) * 1000 : -1;
  const postInfo = {
    txid: node.id,
    owner: ownerAddress,
    height: height,
    length: node.data.size,
    timestamp: timestamp,
  }
  
  postInfo.request = await arweave.api.get(`/${node.id}`, { timeout: 10000 })
  return postInfo;
 }

 let tags = [
  {
    name: "App-Name",
    values: [APP_NAME]
  },
  {
    name: "Content-Type",
    values: ["text/plain"]
  }
]

 export const buildQuery = (owners) => {
  let stringifiedTags = [...tags]
  stringifiedTags = JSON.stringify(stringifiedTags).replace(/"([^"]+)":/g, '$1:')
  const allOwners = owners ? JSON.stringify(owners).replace(/"([^"]+)":/g, '$1:') : ''

  const queryObject = { query: `{
    transactions(
      first: 50,
      tags: ${stringifiedTags}` + (owners ? `,
      owners: ${allOwners}` : '') + 
    `) {
      edges {
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`}
  return queryObject;
}

export const getPosts = async (owners) => {
  return [];
  // try {
  //   const query = buildQuery(owners)
  //   const results = await arweave.api.post('/graphql', query)
  //     .catch(err => {
  //       console.error('GraphQL query failed')
  //       throw new Error(err);
  //     });
  //   const edges = results.data.data.transactions.edges
  //   const posts = await Promise.all(
  //     edges.map(async edge => await createPostInfo(edge.node))
  //   )
  //   let sorted = posts.sort((a, b) => new Date(b.request.data.createdAt) - new Date(a.request.data.createdAt))
  //   sorted = sorted.map(s => s.request.data)
  //   return sorted;
  // } catch (err) {
  //   console.log("Getting posts error: ", err);
  //   return [];
  // }
}