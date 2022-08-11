import { notification, Button } from "antd";
import { useEffect, useState } from "react";
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

  const nftContractAddress = "0x779c99468735b9c3e7CA1f54BB0450D349A9af8f";
  const nftContract = new ethers.Contract(nftContractAddress, CryptoInNFTABI, provider.getSigner());

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
    checkNFT();
  }, [])

  const checkNFT = async () => {
    try {
      const res = await nftContract.balanceOf(address);
      setOwnNFT(ethers.BigNumber.from(res).toNumber() > 0);
    } catch(e) {
      notification["error"]({
        message: "Fetching NFT Failed",
        description: e.toString()
      })
    }
  }

  const mintNFT = async () => {
      setMintLoading(true);
      const options = {value: ethers.utils.parseEther("2")}
      try {
        await nftContract.safeMint(options);
      } catch(e) {
        notification["error"]({
          message: "Transaction Failed",
          description: e.toString()
        })
      }
      setMintLoading(false);
  }

  return (
    <div className="convs">
      <div className="convs-intro">Here you can send encrypted message to the people you followed.</div>
      {!ownNFT && (
        <div>
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

        <div style={{marginTop: '64px'}}>

        {followings?.map((following) => <Messages 
          provider={provider} 
          client={client} 
          recipient={following} 
          enabled={ownNFT} 
          setupClient={setupClient}
        /> )}
        </div>



      </div>
  );
}
