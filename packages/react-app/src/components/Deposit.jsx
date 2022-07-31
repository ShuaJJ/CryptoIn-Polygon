import {WalletABI} from '../contracts/wallet';
import { InputNumber, Modal, Button, notification } from 'antd';
import { InfoOutlined, WalletOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
const ethers = require("ethers");

export default function Deposit({ address, signer, bundlr }) {

    const [balance, setBalance] = useState("0.0");
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0.01);

    async function fundWallet() {
      if (!amount) return
      const amountParsed = parseInput(amount)
      try {
        await bundlr.fund(amountParsed)
        getBalance()
      } catch (err) {
        notification["error"]({
          message: 'Error funding wallet',
          description:
            err.toString(),
        });
      }
    }
  
    function parseInput (input) {
      const conv = new BigNumber(input).multipliedBy(bundlr.currencyConfig.base[1])
      if (conv.isLessThan(0.1)) {
        notification["error"]({
          message: 'Error',
          description: "Cannot deposit less than 0.1 matic",
        });
        return
      } else {
        return conv
      }
    }

    const getBalance = async () => {
        const bal = await bundlr.getLoadedBalance()
        setBalance(ethers.utils.formatEther(bal.toString()))
    }

    useEffect(() => {
        if (signer) {
            getBalance();
        }
    }, [signer])

    const onChange = (value) => {
        setAmount(value);
      };


      const [isModalVisible, setIsModalVisible] = useState(false);

      const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = async () => {
        setLoading(true);
        await fundWallet();
        setLoading(false);
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };


    return <>

    <Button type="primary" onClick={showModal}>
        {address && (address.substring(0, 4) +  '...' + address.substring(address.length-4, address.length))} <WalletOutlined /> {balance}
      </Button>
      <Modal 
        title="Deposit to your CryptoIn wallet" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Deposit"
        okButtonProps={{loading: loading}}
    >
          <div style={{margin: "15px 0"}}>Deposit ethers to the CryptoIn wallet, and later use them to tip others</div>
        <InputNumber min={0.01} max={9999} value={amount} onChange={onChange} style={{width: "100%"}} />
      </Modal>
    </>


  }