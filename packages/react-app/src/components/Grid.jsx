import { Avatar, Button, List, Skeleton, Image, Popover, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";
import { useFollowings } from '../hooks/useFollowings';
import { useOwnChatNFT } from '../hooks/useOwnChatNFT';
import { getPosts, shortenAddress } from "../helpers/utils";
import { Client } from '@xmtp/xmtp-js'
import './Grid.css';
import FollowBtn from './FollowButton';
import Messages from './Messages';
import NFTMintModal from './Tip';
import CryptoPaymentModal from './Payment';


export default function CryptoInGrid({ type, myAddress, provider }) {

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(null);
    const [clientLoading, setClientLoading] = useState(false);
    const followeds = useFollowings(myAddress);
    const ownNFT = useOwnChatNFT(provider);

    const cyberConnect = new CyberConnect({
        namespace: "CryptoIn",
        env: Env.PRODUCTION,
        chain: Blockchain.ETH,
        provider: provider,
        signingMessageEntity: "CryptoIn",
      });

      const setupClient = async () => {
        try {
          setClientLoading(true);
          const clientt = await Client.create(provider.getSigner(), {env: 'production'});
          setClient(clientt);
        } catch(e) {
          notification['error']({
            message: 'Error',
            description: 'Cannot initialize a client'
          })
          console.error(e);
        }
        setClientLoading(false);
      }

    const getActivities = async () => {
        setLoading(true);
        let owners = undefined;
        if (type === 'following') {
            owners = followeds;
        } else if (type === 'mine') {
            owners = [myAddress];
        }
        const posts = await getPosts(owners);
        setActivities(posts);
        setLoading(false);
      }

    useEffect(() => {
        getActivities();
      }, [followeds])

    if (loading) {
        return (<div className='loading-state'>
         <Skeleton avatar paragraph={{ rows: 3 }} />
         <Skeleton.Image active={true} />
      </div>)
    }

    if (type === 'following' && activities.length == 0) {
        return (
            <div style={{textAlign: 'center', marginTop: '32px'}}>
              You haven't followed anyone yet...
            </div>
        )
    }

    

    return <List
        className={"activities" + (type === 'mine' ? ' mine' : '')}
        itemLayout="vertical"
        dataSource={activities}
        renderItem={(item) => {
          let receiver;
          if (item.createdBy === '0xe6259caE435525D698b26E6c5792CA8E6B410D2C') {
            receiver = 'joshua.888'
          } else if (item.createdBy === '0x261DB4e5783Cecc65F05624C09fD37d4c883AD3f') {
            receiver = 'joshuaj.888'
          }
          return (
        <List.Item>
            <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
                avatar={myAddress === item.createdBy ? 
                    <Avatar src="/avatar.png" /> :
                <Popover placement="bottom" content={(<div className='profile-card'>
                        <Avatar src="/avatar.png" />
                        {receiver ?? shortenAddress(item.createdBy)}

                        <FollowBtn 
                            address={item.createdBy} 
                            followeds={followeds} 
                            cyberConnect={cyberConnect}
                        />

                        { !ownNFT && <NFTMintModal provider={provider} /> }
                        { ownNFT && !client && <Button type="primary" loading={clientLoading} onClick={setupClient}>Chat</Button> }
                        { ownNFT && client && <Messages client={client} address={item.createdBy} />}
                        { receiver && <CryptoPaymentModal provider={provider} udomain={receiver} /> }

                        
                </div>)}>
                    <Avatar src="/avatar.png" />
                </Popover>
                
                }
                title={shortenAddress(item.createdBy)}
                description={item.content}
            />
            {item.imageURI && <div className='img-wrapper'><Image src={item.imageURI} /></div>}
            </Skeleton>
        </List.Item>
        )}}
    />
  }