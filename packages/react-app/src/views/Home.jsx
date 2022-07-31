import { LoadingOutlined } from "@ant-design/icons";
import React, {useState, useEffect} from "react";
import { getPosts } from '../helpers/utils'
import CryptoInGrid from "../components/Grid";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home() {
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const getActivities = async () => {
    setLoading(true);
    const posts = await getPosts();
    setActivities(posts);
    setLoading(false);
  }

  useEffect(() => {
    getActivities();
  }, [])

  return (
    <div>
      {loading ? 
      <div style={{fontSize: '32px', color: '#fff', margin: '32px 0', textAlign: 'center'}}>
        <LoadingOutlined />
      </div> : <div style={{margin: '32px auto', maxWidth: "1000px"}}>
        <CryptoInGrid activities={activities} columnCount={5} />
      </div>
      }
    </div>
  );
}

export default Home;
