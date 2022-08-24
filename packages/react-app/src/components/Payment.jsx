import { InputNumber, Modal, Button, notification } from 'antd';
import { useState } from 'react';
const ethers = require("ethers");
const {default: Resolution} = require('@unstoppabledomains/resolution');

export default function CryptoPaymentModal({ provider, udomain }) {

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(1);
    const [receiver, setReceiver] = useState();
    const resolution = new Resolution();

    const tip = async () => {
      if (amount < 0.01) {
        notification["error"]({
          message: "Tip Failed",
          description: "Minimum is 0.01"
        })
        return;
      }
      setLoading(true);
      try {
        const receiverETHAddress = await resolution.addr(udomain, 'ETH');
        setReceiver(receiverETHAddress);
        let tx = {
            to: receiverETHAddress,
            value: ethers.utils.parseEther(amount.toString())
        }
        await provider.getSigner().sendTransaction(tx);
        setLoading(false);
        handleCancel();
      } catch(e) {
        notification["error"]({
          message: "Tip Failed",
          description: JSON.stringify(e)
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
        await tip();
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };


    return <>

      <Button type="primary" onClick={showModal}>
        Tip
      </Button>
      <Modal 
        title={"Tip " + udomain}
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText={loading && !receiver ? "Resolving domain..." : "Tip"}
        okButtonProps={{loading: loading}}
    >
        {loading && <div>{receiver ? ('Transferring MATIC to ' + receiver) : ('Resolving Unstoppable Domain ' + udomain)}</div>} 
        <InputNumber min={0.01} max={9999} value={amount} onChange={onChange} style={{width: "100%"}} />
      </Modal>
    </>


  }