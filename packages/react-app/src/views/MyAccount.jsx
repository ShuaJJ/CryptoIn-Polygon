import { Button, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { WebBundlr } from "@bundlr-network/client"
import CryptoInGrid from "../components/Grid";
import PostModal from "../components/PostModal";
import { getPosts } from "../helpers/utils";
import Deposit from "../components/Deposit";
import "./MyAccount.css";

export default function MyAccount({ provider, address, loadWeb3Modal, isPolygon }) {

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activities, setActivities] = useState([]);

  const getActivities = async () => {
    const posts = await getPosts();
    setActivities(posts);
  }

  useEffect(() => {
    getActivities();
  }, [])

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
      Please switch to Polygon Mumbai first
    </div>
  }

  return (
    <div style={{ width: "100%", maxWidth: "666px", margin: "0 auto", paddingTop: "32px"}}>
      {bundlr && <Deposit address={address} bundlr={bundlr} />}
      {bundlr ? <Button style={btnStyle} onClick={showModal}>Post</Button> : 
        <Button style={btnStyle} onClick={connectBundlr} loading={bundlrLoading}>Connect to Bundlr</Button>
      }
      <CryptoInGrid activities={activities} />
      <PostModal isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} bundlr={bundlr} />
    </div>
  );
}
