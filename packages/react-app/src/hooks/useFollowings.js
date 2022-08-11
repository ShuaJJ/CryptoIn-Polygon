import { useState, useEffect } from "react";
import { GraphQLClient, gql } from "graphql-request";

export const useFollowings = (myAddress) => {
  const [followeds, setFolloweds] = useState();

  const graphClient = new GraphQLClient("https://api.cybertino.io/connect/");

    const GET_CONNECTIONS = gql`
        query($address: String!, $first: Int) {
            identity(address: $address) {
                followings(first: $first) {
                    list {
                        address
                    }
                }
            }
        }
        `;

  useEffect(() => {
    const getFollowers = async () => {
      if (myAddress) {
        const res = await graphClient.request(GET_CONNECTIONS, { address: myAddress, first: 50 });
        const followings = res?.identity?.followings?.list.map((following) => following.address);
        setFolloweds(followings);
      }
    }
    void getFollowers();
  }, [myAddress]);
  return followeds;
};
