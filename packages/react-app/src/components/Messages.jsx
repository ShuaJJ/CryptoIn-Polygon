import { useState, useEffect } from "react"
import { Drawer, Button, Input, notification } from 'antd';
import './Messages.css';
import { shortenAddress } from "../helpers/utils";

export default function Messages({ provider, client, recipient, enabled, setupClient }) {

    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([]);
    const [sendLoading, setSendLoading] = useState(false);
    const [clientLoading, setClientLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const [visible, setVisible] = useState(false);

    const showDrawer = async () => {
        if (!enabled) {
            notification["error"]({
                message: "You have to mint the chat NFT first"
            })
            return
        }
        if (!client) {
            setClientLoading(true);
            try {
                await setupClient();
                setClientLoading(false);
                setVisible(true);
                try {
                    const nconv = await client.conversations.newConversation(recipient);
                    setConversation(nconv);
                } catch(e) {
                    console.log('Creating Conversation Error: ', e);
                }
            } catch(e) {
                notification["error"]({
                    message: "Setup Client Error",
                    description: "Failed to setup a xmtp client, please try again later"
                })
                setClientLoading(false);
            }
        }
    };

    const onClose = () => {
        setVisible(false);
    };

    const sendMsg = async () => {
        if (!msg || msg.length < 2) {
            notification['error']({
                message: "Error",
                description: "Msg too short"
            })
            return;
        }
        if (conversation) {
            setSendLoading(true)
            try {
                await conversation.send(msg)
                setSendLoading(false)
                setMsg('');
                getMsgs();
            } catch(e) {
                notification['error']({
                    message: "Error",
                    description: "Message cannot be sent"
                })
                setSendLoading(false)
            }
        } else {
            notification['error']({
                message: "Error",
                description: "Conversation was not initialized"
            })
        }
    }

    const onChange = (e) => {
        setMsg(e.target.value);
      };

    const getMsgs = async () => {
        if (!conversation) {
          return
        }
        try {
            setMessages(await conversation.messages({ pageSize: 100 }))
        } catch(e) {
            console.log('UUUUU2', e);
        }
      }

      useEffect(() => {
        getMsgs()
      }, [conversation])

      const getActionButton = () => {

          return (
                <Button 
                    onClick={showDrawer}
                    type="primary"
                    loading={clientLoading}
                >
                    Chat
                </Button>
              )
      }

    return (
      <div>
        <div className="conversation-item">
            <div>
            <img src="/avatar.png" />
            {shortenAddress(recipient)}
            </div>
            {getActionButton()}
        </div>
        <Drawer title={"Chat with " + shortenAddress(recipient)} placement="right" onClose={onClose} visible={visible} className="drawer-wrapper" width={555}>
            <div className="messages">
                {messages.map((msg) => {
                    const isSender = msg.senderAddress === recipient
                    return (
                <div key={msg.id} className={isSender ? "message" :"my-message" }>
                    <span className="msg-item">{msg.content}</span>
                </div>
                )})}
            </div>
            <Input.Group compact className="send-input">
                <Input style={{ width: 'calc(100% - 110px)' }} value={msg} onChange={onChange} />
                <Button 
                    style={{width: "60px"}} 
                    type="primary" 
                    onClick={sendMsg} 
                    loading={sendLoading}
                >
                    Send
                </Button>
            </Input.Group>
        </Drawer>
      </div>
    );
  }
  