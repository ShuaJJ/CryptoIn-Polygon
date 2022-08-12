import { notification, Button } from "antd";
import { useEffect, useState } from "react";
import { CryptoInNFTABI } from '../contracts/cryptoInNFT';

import './Conversations.css';
import Messages from "../components/Messages";
import { LoadingOutlined } from "@ant-design/icons";
import { useFollowings } from "../hooks/useFollowings";

const ethers = require("ethers");


export default function Conversations({ provider, address }) {

  const [mintLoading, setMintLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [ownNFT, setOwnNFT] = useState(false);

  const followings = useFollowings(address);

  const nftContractAddress = "0xBCA82456c9461ad6E28b7bf2E4Df7Ac59cfbBCbB";
  const nftContract = new ethers.Contract(nftContractAddress, CryptoInNFTABI, provider.getSigner());

  useEffect(() => {
    checkNFT();
  }, [])

  const checkNFT = async () => {
    setCheckLoading(true);
    try {
      const res = await nftContract.balanceOf(address);
      setOwnNFT(ethers.BigNumber.from(res).toNumber() > 0);
      setCheckLoading(false);
    } catch(e) {
      notification["error"]({
        message: "Fetching NFT Failed",
        description: e.toString()
      })
      setCheckLoading(false);
    }
  }

  const mintNFT = async () => {
      setMintLoading(true);
      const options = {value: ethers.utils.parseEther("0.1")}
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
      {checkLoading && <div>Checking Chat NFT <LoadingOutlined /></div>}
      {!checkLoading && !ownNFT && (
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
          recipient={following} 
          enabled={true} 
        /> )}
        </div>



      </div>
  );
}
