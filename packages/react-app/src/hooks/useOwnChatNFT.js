import { useState, useEffect } from "react";
import { CryptoInNFTABI } from '../contracts';
import { nftContractAddress } from "../helpers/utils";
import { notification } from "antd";
const ethers = require("ethers");

export const useOwnChatNFT = (provider) => {
  const [ownNFT, setOwnNFT] = useState(false);

  useEffect(() => {
    const checkNFT = async () => {
      if (provider) {
        const myAddress = await provider.getSigner().getAddress()
        try {
          const nftContract = new ethers.Contract(nftContractAddress, CryptoInNFTABI, provider.getSigner());
          const res = await nftContract.balanceOf(myAddress);
          setOwnNFT(ethers.BigNumber.from(res).toNumber() > 0);
        } catch(e) {
          notification["error"]({
            message: "Fetching NFT Failed",
            description: e.toString()
          })
        }
      }
    }
    void checkNFT();
  }, [provider]);
  return ownNFT;
};
