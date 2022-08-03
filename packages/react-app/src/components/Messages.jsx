import { useState, useEffect } from "react"
import { Drawer, Button, Input, notification } from 'antd';
import LitJsSdk from 'lit-js-sdk';
import { CryptoInNFTABI } from '../contracts/cryptoInNFT';
import './Messages.css';

const ethers = require("ethers");

export default function Messages({ provider, client, recipient, isCyberConnect }) {

    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([]);
    const [sendLoading, setSendLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [mintLoading, setMintLoading] = useState(false);
    const [ownNFT, setOwnNFT] = useState(false);

    const [visible, setVisible] = useState(false);

    const litClient = new LitJsSdk.LitNodeClient();
    const nftContractAddress = "0xDD284A2BCA27495A982e79720Bf29cc599684bd1";
    const nftContract = new ethers.Contract(nftContractAddress, CryptoInNFTABI, provider.getSigner());

    const chain = 'rinkeby';

    const accessControlConditions = [
        {
          contractAddress: nftContractAddress,
          standardContractType: 'ERC721',
          chain,
          method: 'balanceOf',
          parameters: [
            ':userAddress'
          ],
          returnValueTest: {
            comparator: '>',
            value: '0'
          }
        }
      ]
    
    const resourceId = {
        baseUrl: '',
        path: '/cryptoin', // this would normally be your url path, like "/webpage.html" for example
        orgId: "",
        role: "",
        extraData: ""
    }

    const checkNFT = async () => {
        try {
            await litClient.connect();
            const authSig = await LitJsSdk.checkAndSignAuthMessage({chain})
            const jwt = await litClient.getSignedToken({ accessControlConditions, chain, authSig, resourceId });
            if (jwt) {
                setOwnNFT(true);
            }
        } catch(e) {
            setOwnNFT(false);
            notification['error']({
                message: 'Error',
                description: e.toString()
            })
        }
    }

    const mintNFT = async () => {
        setMintLoading(true);
        await nftContract.safeMint();
        setMintLoading(false);
    }

    const showDrawer = async () => {
        setVisible(true);
        try {
            const nconv = await client.conversations.newConversation(recipient.address);
            setConversation(nconv);
        } catch(e) {
            console.log('UUUUU1', e);
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
          if (isCyberConnect) {
              return (
                <Button 
                    onClick={showDrawer}
                    type="primary"
                >
                    Chat
                </Button>
              )
          } else {
            return (
                <div className="nft-btns">
                <Button 
                    onClick={() => { mintNFT() }}
                    type="primary"
                    loading={mintLoading}
                >
                    Mint a CryptoIn NFT for free
                </Button>
                </div>
              )
          }
      }

    return (
      <div>
        {client && (
            <div className="conversation-item">
                <img src={recipient.avatar} />
                {recipient.name}
                {getActionButton()}
            </div>
        )}
        <Drawer title={"Chat with " + recipient.name} placement="right" onClose={onClose} visible={visible} className="drawer-wrapper" width={555}>
            <div className="messages">
                {messages.map((msg) => {
                    const isSender = msg.senderAddress === recipient.address
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
                    disabled={isCyberConnect}
                >
                    Send
                </Button>
            </Input.Group>
        </Drawer>
      </div>
    );
  }
  