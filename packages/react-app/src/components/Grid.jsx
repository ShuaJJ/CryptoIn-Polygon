import { Avatar, Button, List, Skeleton, Image } from 'antd';
import React, { useEffect, useState } from 'react'
import './Grid.css';


export default function CryptoInGrid({ activities, address }) {

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
                    {<Button type='primary'>Follow</Button>}
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