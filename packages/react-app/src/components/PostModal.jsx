import { Modal, Input, notification, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Arweave from "arweave";
import Compressor from 'compressorjs';
import { useState } from 'react';
import ArweaveImage from './ArweaveImage';
import { APP_NAME } from '../helpers/utils';
const ethers = require("ethers");
const { TextArea } = Input;
const { Dragger } = Upload;

const PostModal = ({isModalVisible, handleOk, handleCancel, bundlr}) => {

    const [content, setContent] = useState('');
    const [file, setFile] = useState()
    const [fileCost, setFileCost] = useState()
    const [localImage, setLocalImage] = useState()
    const [imageType, setImageType] = useState();
    const [loading, setLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const [uploadTx, setUploadTx] = useState();
    const [URI, setURI] = useState()

    const onChange = (e) => {
        setContent(e.target.value);
    };

    const customRequest = (info) => {
        const infoFile = info.file;
        setImageType(infoFile.type);
        const img = URL.createObjectURL(infoFile)
        setLocalImage(img)
        new Compressor(infoFile, {
            quality: 0.6,
            success(result) {
                checkUploadCost(result.size)
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (reader.result) {
                        setFile(Buffer.from(reader.result))
                    }
                }
                reader.readAsArrayBuffer(result)
            },
            error(err) {
              console.log(err.message);
            },
          });
    };

    const post = async () => {
        setPostLoading(true);
        if (!content && !uploadTx) {
            notification['error']({
                message: 'Error',
                description:
                  'Please write something or upload an image at least',
              });
        } else {
            const tags = [
                { name: 'Content-Type', value: 'text/plain' },
                { name: 'App-Name', value: APP_NAME }
            ]

            const imageURI = uploadTx ? ('https://arweave.net/'+uploadTx.id) : '';

            const video = {
                content,
                imageURI,
                createdAt: new Date(),
                createdBy: bundlr.address,
            }

            try {
                let tx = await bundlr.createTransaction(JSON.stringify(video), { tags })
                await tx.sign()
                const { data } = await tx.upload()

                console.log(`http://arweave.net/${data.id}`)
                setPostLoading(false);
                handleOk();
            } catch (err) {
                setPostLoading(false);
                notification['error']({
                    message: 'Post Error',
                    description: err.toString(),
                });
            }
        }
    }

    const clear = () => {
        setImageType(null);
        setUploadTx(null);
        setContent('');
    }

    async function checkUploadCost(bytes) {
        if (bytes) {
            const cost = await bundlr.getPrice(bytes)
            setFileCost(ethers.utils.formatEther(cost.toString()))
        }
    }
    
    async function uploadFile() {
        if (!file) return
        const tags = [{ name: 'Content-Type', value: imageType }]
        try {
          let tx = await bundlr.uploader.upload(file, tags)
          setURI(`http://arweave.net/${tx.data.id}`)
        } catch (err) {
          notification["error"]({
            message: "File Upload Error",
            description: err.toString()
          })
        }
    }


  return (
    <Modal 
        title="Post something about your work or project" 
        visible={isModalVisible} 
        onOk={post} 
        onCancel={handleCancel} 
        afterClose={clear}
        okButtonProps={{loading: postLoading}}
    >
        <div style={{textAlign: "center", marginBottom: "15px"}}>
            <Upload
                name="Image File"
                multiple={false}
                listType="picture-card"
                className="file-uploader"
                showUploadList={false}
                customRequest={customRequest}
            >
                {localImage ? (
                    <img src={localImage} />
                ) : (<div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>)}
            </Upload>
        </div>
        
        <TextArea showCount maxLength={140} style={{ height: 100 }} onChange={onChange} value={content} />
    </Modal>
  );
};

export default PostModal;