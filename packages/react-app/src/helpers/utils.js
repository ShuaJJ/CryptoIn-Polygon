import Arweave from 'arweave'

export const arweave = Arweave.init({})
export const APP_NAME = "CryptoIn"

export const btnStyle = {
  width: "100%",
  backgroundColor: "#00D3C5",
  border: "none",
  color: "#222",
  height: "56px",
  fontSize: "18px",
  fontWeight: "600",
  marginTop: "24px"
}

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
  }
]

 export const buildQuery = (authors) => {
  let stringifiedTags = [...tags]
  if (authors) {
    stringifiedTags = [...tags, {
      name: "Author",
      values: authors.map((author) => author.toLowerCase())
    }]
  }
  stringifiedTags = JSON.stringify(stringifiedTags).replace(/"([^"]+)":/g, '$1:')

  const queryObject = { query: `{
    transactions(
      first: 50,
      tags: ${stringifiedTags}
    ) {
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
  try {
    const query = buildQuery(owners)
    const results = await arweave.api.post('/graphql', query)
    .catch(err => {
      console.error('GraphQL query failed')
      throw new Error(err);
    });
    const edges = results.data.data.transactions.edges
    const posts = await Promise.all(
      edges.map(async edge => await createPostInfo(edge.node))
      )
      let sorted = posts.sort((a, b) => new Date(b.request.data.createdAt) - new Date(a.request.data.createdAt))
      sorted = sorted.map(s => s.request.data)
    return sorted;
  } catch (err) {
    console.log("Getting posts error: ", err);
    return [];
  }
}

export const shortenAddress = (address) => {
  return address.substring(0, 5) + '....' + address.substring(address.length-5)
}