import { Avatar, Button, List, Skeleton, Image } from 'antd';
import React, { useEffect, useState } from 'react'
import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";
import { GraphQLClient, gql } from "graphql-request";
import './Grid.css';
import FollowBtn from './FollowButton';


export default function CryptoInGrid({ activities, myAddress, provider }) {

    const [followeds, setFolloweds] = useState();

    const cyberConnect = new CyberConnect({
        namespace: "CryptoIn",
        env: Env.PRODUCTION,
        chain: Blockchain.ETH,
        provider: provider,
        signingMessageEntity: "CryptoIn",
    });

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

    const getFollowers = async () => {
        const res = await graphClient.request(GET_CONNECTIONS, { address: myAddress, first: 50 });
        setFolloweds(res?.identity?.followings?.list.map((following) => following.address));
    }

    useEffect(() => {
        if (myAddress) {
            getFollowers();
        }
    }, [myAddress])

    return <List
        className="activities"
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => (
        <List.Item>
            <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
                avatar={<div> 
                    <Avatar src="/avatar.png" />
                    {myAddress != item.createdBy && 
                        <FollowBtn 
                            cyberConnect={cyberConnect} 
                            address={item.createdBy} 
                            followeds={followeds} 
                            getFollowers={getFollowers} 
                        />
                    }
                </div>
                }
                title={item.createdBy.substring(0, 6) + '....' + item.createdBy.substring(item.createdBy.length-6)}
                description={item.content}
            />
            {item.imageURI && <div><Image height={120} src={item.imageURI} /></div>}
            </Skeleton>
        </List.Item>
        )}
    />
  }