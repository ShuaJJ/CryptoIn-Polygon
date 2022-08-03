import { Button, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { WebBundlr } from "@bundlr-network/client"
import CryptoInGrid from "../components/Grid";
import PostModal from "../components/PostModal";
import { getPosts } from "../helpers/utils";
import Deposit from "../components/Deposit";
import "./MyAccount.css";

const ethers = require("ethers");

export default function MyAccount({ provider, address, isPolygon }) {

  const btnStyle = {
    width: "100%",
    backgroundColor: "#00D3C5",
    border: "none",
    color: "#222",
    height: "56px",
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "24px"
  }

  const [bundlr, setBundlr] = useState();
  const [bundlrLoading, setBundlrLoading] = useState(false);
  const [balance, setBalance] = useState("0.0");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activities, setActivities] = useState([]);

  const getActivities = async () => {
    const posts = await getPosts();
    setActivities(posts);
  }

  const getBalance = async () => {
    const bal = await bundlr.getLoadedBalance()
    setBalance(ethers.utils.formatEther(bal.toString()))
  }

  useEffect(() => {
    if (bundlr) {
      getActivities();
      getBalance();
    }
  }, [bundlr])

  const showModal = () => {
    setIsModalVisible(true);
  };

  const connectBundlr = async () => {
    setBundlrLoading(true);
    const br = new WebBundlr("https://node1.bundlr.network", "matic", provider)
    try {
      await br.ready()
      setBundlrLoading(false);
      setBundlr(br);
    } catch(e) {
      notification["error"]({
        message: "Connection Error",
        description: e.toString()
      })
      setBundlr(undefined)
      setBundlrLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (!address) {
    return <div className="connect-info">
      Please connect your wallet first
    </div>
  }

  if (!isPolygon) {
    return <div className="connect-info">
      Please switch to Polygon first
    </div>
  }

  const noBalance = !balance || parseFloat(balance) == 0.0;

  return (
    <div style={{ width: "100%", maxWidth: "666px", margin: "0 auto", paddingTop: "32px"}}>
      {bundlr ? (
        <div>
          <Deposit address={address} bundlr={bundlr} balance={balance} getBalance={getBalance} />
          <Button style={btnStyle} disabled={noBalance} onClick={showModal}>Post</Button>
          {noBalance && <p style={{marginTop: '8px'}}>To post, you have to fund your wallet with MATIC first</p>}
        </div>
      ) : (
        <Button style={btnStyle} onClick={connectBundlr} loading={bundlrLoading}>Connect to Bundlr</Button>
      )}

      <CryptoInGrid activities={activities} myAddress={address} />
      <PostModal isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} bundlr={bundlr} />
    </div>
  );
}
