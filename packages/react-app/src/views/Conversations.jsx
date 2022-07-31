import { notification } from "antd";
import { useEffect, useState } from "react";
import { Client } from '@xmtp/xmtp-js'

import './Conversations.css';
import Messages from "../components/Messages";
import { LoadingOutlined } from "@ant-design/icons";


export default function Conversations({ provider }) {

  const [client, setClient] = useState(null);
  const signer = provider.getSigner();

  const setupClient = async () => {
    try {
      const clientt = await Client.create(signer);
      setClient(clientt);
    } catch(e) {
      notification['error']({
        message: 'Error',
        description: 'Cannot initialize a client'
      })
      console.error(e);
    }
  }

  useEffect(() => {
    if (!client) {
      setupClient();
    }
  }, [])

  if (!client) {
    return <div style={{marginTop: "32px"}}><LoadingOutlined /></div>
  }

  return (
    <div className="convs">
      <div className="convs-intro">Here you can message the developers of this dapp but under some conditions:</div>
      <div className="convs-rule">You have to follow JeremyJ through CyberConnect in order to chat with him</div>
      <Messages 
        provider={provider} 
        client={client} 
        recipient={{ address: "0xC4cD7F3F5B282d40840E1C451EC93FFAE61514f9", avatar: "https://is4-ssl.mzstatic.com/image/thumb/Purple7/v4/0a/bf/ee/0abfee13-a9d6-bac8-52c3-96c4a9cd0d07/source/256x256bb.jpg", name: "JeremyJ" }} 
        isCyberConnect={true} 
      /> 

<div className="convs-rule">You have to mint a CryptoIn NFT and be checked the ownership via Lit Protocol in order to chat with JoshuaJ</div>
      <Messages 
        provider={provider} 
        client={client} 
        recipient={{ address: "0x5DC27a3BB1501eA928137b10558DC8B42feA04f1", avatar: "https://i.pinimg.com/474x/ff/21/c9/ff21c94cf3bee40fd36ef911420106ca.jpg", name: "JoshuaJ" }} 
        isCyberConnect={false} 
      /> 
    </div>
  );
}
