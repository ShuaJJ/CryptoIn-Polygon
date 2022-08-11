import { notification, Button } from "antd";
import { useEffect, useState } from "react";
import LitJsSdk from 'lit-js-sdk';
import { CryptoInNFTABI } from '../contracts/cryptoInNFT';
import { Client } from '@xmtp/xmtp-js'

import './Conversations.css';
import Messages from "../components/Messages";
import { LoadingOutlined } from "@ant-design/icons";
import { useFollowings } from "../hooks/useFollowings";

const ethers = require("ethers");


export default function Conversations({ provider, address }) {

  const [client, setClient] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [ownNFT, setOwnNFT] = useState(false);

  const followings = useFollowings(address);

  const litClient = new LitJsSdk.LitNodeClient();
  const nftContractAddress = "0xDD284A2BCA27495A982e79720Bf29cc599684bd1";
  const nftContract = new ethers.Contract(nftContractAddress, CryptoInNFTABI, provider.getSigner());

  const signer = provider.getSigner();

  const chain = 'polygon';

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

  // useEffect(() => {
  //   checkNFT();
  // }, [])

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

  return (
    <div className="convs">
      <div className="convs-intro">Here you can send encrypted message to the people you followed.</div>
      {!ownNFT && (
        <div style={{marginBottom: '64px'}}>
          <div className="convs-rule">You need a messaging NFT from CryptoIn to enable this feature.</div>
          <Button 
              onClick={() => { mintNFT() }}
              type="primary"
              loading={mintLoading}
          >
              Mint a CryptoIn NFT for 2 MATIC
          </Button>
        </div>
      )}



        {followings?.map((following) => <Messages 
          provider={provider} 
          client={client} 
          recipient={following} 
          enabled={ownNFT} 
          setupClient={setupClient}
        /> )}


      </div>
  );
}
