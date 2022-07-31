import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";


export default function ArweaveImage({ txId, width = "100%", height = "auto" }) {

    const [data, setData] = useState();

    const getImageData = async () => {
        const imageData = await axios.get(txId);
        setData(imageData.data);
    }
  
    useEffect(() => {
        getImageData();
    }, []);
  
    if (data) {
        return <img src={data} style={{width, height, borderRadius: '8px'}} />
    }

    return <div style={{width, height: '100px', background: "#ccc", color: "#666", paddingTop: '32px'}}><LoadingOutlined /></div>
  }