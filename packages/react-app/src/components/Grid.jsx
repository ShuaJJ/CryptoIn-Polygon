import { Avatar, Button, List, Skeleton, Image, Popover } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";
import { useFollowings } from '../hooks/useFollowings';
import { getPosts, shortenAddress } from "../helpers/utils";
import './Grid.css';
import FollowBtn from './FollowButton';


export default function CryptoInGrid({ type, myAddress, provider }) {

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const followeds = useFollowings(myAddress);

    const cyberConnect = new CyberConnect({
        namespace: "CryptoIn",
        env: Env.PRODUCTION,
        chain: Blockchain.ETH,
        provider: provider,
        signingMessageEntity: "CryptoIn",
      });

    const getActivities = async () => {
        setLoading(true);
        let owners;
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
        renderItem={(item) => (
        <List.Item>
            <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
                avatar={myAddress.toLowerCase() === item.createdBy.toLowerCase() ? 
                    <Avatar src="/avatar.png" /> :
                <Popover placement="bottom" content={(<div className='profile-card'>
                        <Avatar src="/avatar.png" />
                        {item.createdBy}
                        <FollowBtn 
                            address={item.createdBy} 
                            followeds={followeds} 
                            cyberConnect={cyberConnect}
                        />
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
        )}
    />
  }