import {WalletABI} from '../contracts/wallet';
import { InputNumber, Modal, Button, notification } from 'antd';
import { useState } from 'react';
const ethers = require("ethers");

export default function Tip({ signer }) {

    const walletContract = new ethers.Contract("0x12Fd542974c73Be6D9E5127E7e7DFA8a4cee5419", WalletABI, signer);

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0.01);

    const tip = async () => {
        try {
            await walletContract.tip("0xe6259caE435525D698b26E6c5792CA8E6B410D2C", ethers.utils.parseEther(amount.toString()))
        } catch(e) {
            notification["error"]({
                message: 'Error',
                description:
                  "Insufficient funds in your CryptoIn wallet. Please use the wallet button on the top right corner to deposit first"
              });
        }
    }

    const onChange = (value) => {
        setAmount(value);
      };


      const [isModalVisible, setIsModalVisible] = useState(false);

      const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = async () => {
        setLoading(true);
        await tip();
        setLoading(false);
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };


    return <>

    <Button type="primary" onClick={showModal}>
        Buy me an expensive coffee
      </Button>
      <Modal 
        title="Tip the developer" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Tip"
        okButtonProps={{loading: loading}}
    >
        <InputNumber min={0.01} max={9999} value={amount} onChange={onChange} style={{width: "100%"}} />
      </Modal>
    </>


  }