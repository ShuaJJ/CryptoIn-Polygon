import { Modal, Input, notification, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Compressor from 'compressorjs';
import { useState } from 'react';
import { APP_NAME } from '../helpers/utils';
import './PostModal.css';


const ethers = require("ethers");
const { TextArea } = Input;

const PostModal = ({isModalVisible, handleOk, handleCancel, bundlr, myAddress}) => {

    const [content, setContent] = useState('');
    const [file, setFile] = useState()
    const [fileCost, setFileCost] = useState()
    const [localImage, setLocalImage] = useState()
    const [imageType, setImageType] = useState();
    const [postLoading, setPostLoading] = useState(false);

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
        if (!content && !file) {
            notification['error']({
                message: 'Error',
                description:
                  'Please write something or upload an image at least',
              });
        } else {
            const tags = [
                { name: 'Content-Type', value: 'text/plain' },
                { name: 'App-Name', value: APP_NAME },
                { name: 'Author', value: myAddress.toLowerCase() },
            ]

            let imageURI = '';
            if (file) {
                const uri = await uploadFile();
                if (!uri) {
                    setPostLoading(false);
                    return;
                }
                imageURI = uri;
            }

            const feed = {
                content,
                imageURI,
                createdAt: new Date(),
                createdBy: myAddress,
            }

            try {
                let tx = await bundlr.createTransaction(JSON.stringify(feed), { tags })
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
        setFile(null);
        setContent('');
    }

    async function checkUploadCost(bytes) {
        if (bytes) {
            const cost = await bundlr.getPrice(bytes)
            setFileCost(ethers.utils.formatEther(cost.toString()))
        }
    }
    
    async function uploadFile() {
        if (!file) return undefined
        const tags = [{ name: 'Content-Type', value: imageType }]
        try {
          let tx = await bundlr.uploader.upload(file, tags)
          return `http://arweave.net/${tx.data.id}`;
        } catch (err) {
          notification["error"]({
            message: "File Upload Error",
            description: err.toString()
          })
          return undefined
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
        <div className="upload-wrapper">
            <Upload
                name="Image File"
                multiple={false}
                listType="picture-card"
                className="file-uploader"
                showUploadList={false}
                customRequest={customRequest}
            >
                {localImage ? (
                    <img className='preview-img' src={localImage} />
                ) : (<div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>)}
            </Upload>
            {localImage && <p>Estimated Upload Cost: {parseFloat(fileCost).toFixed(8)} MATIC</p>}
        </div>
        
        <TextArea showCount maxLength={140} style={{ height: 100 }} onChange={onChange} value={content} />
    </Modal>
  );
};

export default PostModal;