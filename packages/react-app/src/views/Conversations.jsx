import { notification, Button } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Client } from '@xmtp/xmtp-js'

import './Conversations.css';
import Messages from "../components/Messages";
import { shortenAddress } from "../helpers/utils";

const ethers = require("ethers");


export default function Conversations({ provider, address }) {

  const [client, setClient] = useState(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [convLoading, setConvLoading] = useState(false);
  const [allConversations, setAllConversations] = useState([]);

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

  const getConvs = async () => {
    setConvLoading(true);
    const allConvs = await client.conversations.list();
    setAllConversations(allConvs);
    setConvLoading(false);
  }

  useEffect(() => {
    if (client) {
      getConvs()
    }
  }, [client])

  return (
    <div className="convs">
      <div className="convs-intro">Here you can send encrypted message to the people you followed.</div>
      {!client && <Button 
              onClick={() => { setupClient() }}
              type="primary"
              loading={clientLoading}
          >
              Setup Messaging Client
          </Button>}

        {client && convLoading && <LoadingOutlined />}

        {client && !convLoading && allConversations.length == 0 && <div>You don't have any chats yet...</div>}

        <div style={{marginTop: '64px'}}>
          {allConversations.map((conv) => <div className="conversation-item">
            <div>
            <img src="/avatar.png" />
            {shortenAddress(conv.peerAddress)}
            </div>
            <Messages conversation={conv} />
        </div> )}
        </div>



      </div>
  );
}
