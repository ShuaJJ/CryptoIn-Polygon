import {WalletABI} from '../contracts/wallet';
import { InputNumber, Modal, Button, notification } from 'antd';
import { InfoOutlined, WalletOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { shortenAddress } from '../helpers/utils';
const ethers = require("ethers");
const { BigNumber } = ethers;

export default function Deposit({ address, bundlr, balance, getBalance }) {

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0.01);

    async function fundWallet() {
      if (!amount) return
      const amountParsed = parseInput(amount)
      setLoading(true);
      try {
        await bundlr.fund(amountParsed)
        await getBalance()
        setLoading(false);
      } catch (err) {
        notification["error"]({
          message: 'Error funding wallet',
          description:
            err.toString(),
        });
        setLoading(false);
      }
    }
  
    function parseInput (input) {
      const value = parseFloat(input);
      if (value < 0.01) {
        notification["error"]({
          message: 'Error',
          description: "Cannot deposit less than 0.01 matic",
        });
        return
      } else {
        return value * bundlr.currencyConfig.base[1]
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
        await fundWallet();
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };


    return <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div style={{fontSize: '17px', lineHeight: '32px'}}>
        {address && shortenAddress(address)} <WalletOutlined /> {parseFloat(balance).toFixed(4)}
      </div>

    <Button type="primary" onClick={showModal}>
        Fund My Wallet
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
    </div>


  }