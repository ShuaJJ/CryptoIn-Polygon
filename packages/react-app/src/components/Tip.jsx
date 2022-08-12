import { CryptoInNFTABI } from '../contracts/cryptoInNFT';
import { InputNumber, Modal, Button, notification } from 'antd';
import { useState } from 'react';
import { nftContractAddress } from '../helpers/utils';
const ethers = require("ethers");

export default function NFTMintModal({ provider }) {

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(1);

    const nftContract = new ethers.Contract(nftContractAddress, CryptoInNFTABI, provider.getSigner());

    const mintNFT = async () => {
      if (amount < 0.01) {
        notification["error"]({
          message: "Mint Failed",
          description: "Minimum is 0.01"
        })
        return;
      }
      setLoading(true);
      const options = {value: ethers.utils.parseEther(amount.toString())}
      try {
        await nftContract.safeMint(options);
      } catch(e) {
        notification["error"]({
          message: "Mint Failed",
          description: e.toString()
        })
      }
      setLoading(false);
  }

    const onChange = (value) => {
        setAmount(value);
      };


      const [isModalVisible, setIsModalVisible] = useState(false);

      const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = async () => {
        await mintNFT();
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };


    return <>

      <Button type="primary" onClick={showModal}>
        Chat
      </Button>
      <Modal 
        title="Mint CryptoIn Messaging NFT" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Mint"
        okButtonProps={{loading: loading}}
    >
        <div style={{marginBottom: "15px"}}>To message other addresses, tip the developer to mint a messaging NFT first, minimum 0.01 :)</div>
        <InputNumber min={0.01} max={9999} value={amount} onChange={onChange} style={{width: "100%"}} />
      </Modal>
    </>


  }