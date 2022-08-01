import { Button } from "antd";
import React, { useEffect, useState } from "react";
import CryptoInGrid from "../components/Grid";
import PostModal from "../components/PostModal";
import { getPosts } from "../helpers/utils";

export default function MyAccount({ provider, address, loadWeb3Modal, bundlr }) {

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

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: "100%", maxWidth: "666px", margin: "0 auto", paddingTop: "32px"}}>
      {address ? (
        <div>
          <Button style={btnStyle} onClick={showModal}>Post</Button>
          <CryptoInGrid activities={activities} />
        </div>
      ) : (
        <Button style={btnStyle} onClick={loadWeb3Modal}>Connect Wallet</Button>
      )}
      <PostModal isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} bundlr={bundlr} />
    </div>
  );
}
