import { useState, useEffect } from "react"
import { Drawer, Button, Input, notification } from 'antd';
import './Messages.css';
import { shortenAddress } from "../helpers/utils";

export default function Messages({ client, conversation, address }) {

    const [messages, setMessages] = useState([]);
    const [currentConv, setCurrentConv] = useState()
    const [sendLoading, setSendLoading] = useState(false);
    const [peerAddress, setPeerAddress] = useState('');
    const [msg, setMsg] = useState('');

    const [visible, setVisible] = useState(false);

    const onClose = () => {
        setVisible(false);
    };

    const createConv = async () => {
        try {
            const nconv = await client.conversations.newConversation(address);
            setCurrentConv(nconv);
            setPeerAddress(address);
        } catch(e) {
            notification["error"]({
                message: "Failed to chat",
                description: "Target address is not on XMTP network"
            });
        }
    }

    useEffect(() => {
        if (conversation) {
            setCurrentConv(conversation);
            setPeerAddress(conversation.peerAddress);
        } else if (client && address) {
            createConv();
        }
      }, [])

    const showDrawer = () => {
        setVisible(true);
    };

    const sendMsg = async () => {
        if (!msg || msg.length < 2) {
            notification['error']({
                message: "Error",
                description: "Msg too short"
            })
            return;
        }
        if (currentConv) {
            setSendLoading(true)
            try {
                await currentConv.send(msg)
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
        if (!currentConv) {
          return
        }
        try {
            setMessages(await currentConv.messages({ pageSize: 100 }))
        } catch(e) {
            console.log('Send Message Error', e);
        }
      }

      useEffect(() => {
        if (currentConv) {
            getMsgs();
        }
      }, [currentConv])

    return (
      <div>
        <Button 
                    onClick={showDrawer}
                    type="primary"
                >
                    Chat
                </Button>
        <Drawer title={"Chat with " + shortenAddress(peerAddress)} placement="right" onClose={onClose} visible={visible} className="drawer-wrapper" width={555}>
            <div className="messages">
                {messages.map((msg) => {
                    const isSender = msg.senderAddress === peerAddress
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
  