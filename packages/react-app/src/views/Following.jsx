
import { LoadingOutlined } from "@ant-design/icons";
import React, {useState, useEffect} from "react";
import { getPosts } from '../helpers/utils'
import CryptoInGrid from "../components/Grid";

export default function Following({address}) {

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
  
  if (loading) {
    return <div style={{fontSize: '32px', color: '#fff', margin: '32px 0', textAlign: 'center'}}>
        <LoadingOutlined />
      </div>
  }

  if (activities.length == 0) {
    return <div style={{textAlign: 'center', marginTop: '32px'}}>
              You haven't followed anyone yet...
            </div>
  }

  return (
    <div>
      <div style={{margin: '32px auto', maxWidth: "1000px"}}>
        <CryptoInGrid activities={activities} myAddress={address} />
      </div>
    </div>
  );
}
