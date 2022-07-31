import { Modal, Input, notification, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Arweave from "arweave";
import Compressor from 'compressorjs';
import { useState } from 'react';
import ArweaveImage from './ArweaveImage';
const { TextArea } = Input;
const { Dragger } = Upload;

const PostModal = ({isModalVisible, handleOk, handleCancel}) => {

    const [content, setContent] = useState('');
    const [imageType, setImageType] = useState();
    const [loading, setLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const [uploadTx, setUploadTx] = useState();

    const initOptions = {
        host: "arweave.net",
        port: 443,
        protocol: "https",
        timeout: 60000,
        logging: true,
      };

    const arweave = Arweave.init(initOptions);

    const runUpload = async (data, contentType) => {
        try {
            let key = {"kty":"RSA","n":"z4h7VBQMcnisquU3liJzj5ryX0nIXcdoGwzS16g07BvObcAW3ByS-5YXGN55HvK68IP8a0SGL-QpH5qGYQjRKGj5WwAqKlEGF4oq64vH_6OJyVlVH1LyCNOo_i_eqnoBvBE7tekzCae6yhCYZoLfkZA9bpv0FLwxXd_DydDEv6yPUBgF_gEkgMMsi0tJghpA3YqeCecQ1L-c8lHaUGtJMRwns468-DKXBuowC7MFryo7PMUnBr6HRXJklFvafcyyvC7NlgWd4WSxP7PlxYa8phcucedvuJMTrAV-2QnuxW0hgtPSbis2NlvbRfGFQxgqX_PZTLJxW_8z3QD0xHBcxRWRRWj89OvTjCG0gAWiOI2AKlp-txvIF0rTlMmBFo8H14nbW8F6-Y-B3gASzs4c-EHgqbtyERMo5PdF3Gp5a9K8qXf7E3agYo85xrdfcRuWWw_NbNzM-10Kwzgnir0wS2LBopPySMZaUumP7EPPAQFoz1GraHM8ZDe6xgTAtwpiWcEO9SzBGmkrqXltkFQcsZ7MSdHLWp2uujVJvTZD6he9hcM0YtVFpXLYyzDVEqBJADopBfULhNUAwDa5VljrMJB-1qlpTERFCQpyZ1WMIESGf9XC0fH7YMiA_rFtUaIwrzmIi-cTWYgV6hvmu_b75R20jAwX-M4p2RVFUN_9uiM","e":"AQAB","d":"ks5hL6DfDTsAKgPrxnCofrWFLpLrAivFIR15KMT8aulgpZJ0mVA9SWtq-1SlKZdbVjiHnvniUo576LdOx-WMz6Eyg4UiTrzyKkS7B9ThrZzqI1zmMjpirIvNx8HlKYMVJwypyI0mZXYZVEdZB2sc68O1MUFw8BoQce-QeHsOMujGmEnmM0BrqgpmwEKJxVb8-7rLAQZLibPiOihc3vaF2A-qpgIa-xgObf3L7vq80qR1Mw_kA4lT93RsYeZ4MPVUmnohRDbE8GRiXkXMDGa7nGJZoImvJkokaFOa371_AnmocvuUqAo5V0qzWk73jfbSQv4kgXTZa9KjxXqfqzYw6JMiyj5vK6lWqVNZHsww7wSWmZNMegGEnMXOGuH9tWEeLnSMlWGbJTlA-Mi5mb5RVLYZ8ymJNEvANx-EFlV96L5JjpmZO_deAyMfDfJbT3zaO3LjaGOt023_Sgu4qy1ygYL6veYgMCeqUVK5NXg2tMC5oI_N-HHkN6QzXzt0rFd83B8ZLRRR7k4dzev4tASqEmNfjUCheUDkQ6LSo9lofo-2KPuMDPXtWc3tO00lLsm2T5VDbUaWTuNLOkOFAWCCl5KlnX1nNyoPWFfHDMEO4iikj8Lx8Q1-KLkL7eYodoicHu-5MuDLjmTq7NqafKAIaEzjMIwtcZEYYAlaKyP2nkE","p":"9Jz2Q-shQEQD08Oy4M4zkptE27tv-CE0ZAkiICdm-L28dhIRxXZNWCRzAYfAoQcr2_Y2ZAyLCu2B4nH23VTX4w_OflYRy6WAo4_87857JklR8wbjmMY3WZucU5sFfSW9pI9iI0kOerwrrzLtLNhbqLDO_mXx4aroV_4vizPDs_jRgACrI_JtZrTNoV5owkVk4eE5e2sKt2xUjaML987Yd5C0jRDc9tzf38KJ5kL3M8JM8s58o8d6ARBat4TPzPktJD_3PMEcGuRFj-ZT6uTFQ8mYPs1CVr5N6CiJkna1EjstA14MGB-4CeXgU6rksxx0mXi9KlrbCORaejdNARq3xQ","q":"2TGj0s5bxg2vNmGdctgyzeRVEsNhkU3s3ziH3ZAojCdMJEqU3273d8iT5FVpfQbZp2-trbyP8cQB8JXt-vDm1NkBIDYMwLQkk25_gwrVC9I5gEQnmPycMJEqzsygQIo6ZY5D-CjRSjDEmWqDY5X2GnvTkSuHzEvxP1Eh_Te8cq2huMmpKMCGZkeGIfknrC4y_1kloRW7ixgB3ca6MHlEB4VXleJy6AbhE_90FKEPopHIBY8XgkgINnCb1x6WVMqyPhjhcJtaE99b2LvZabS5GbRVD4GTrHi4oQ9Ozw7WmovuM2HWYePGr77wFdrKWhDIQ9mTKMjsem0z2a8k-ANgxw","dp":"mwbrcKoRPcidYFWUBbPJra2oG1aUpP5uVMQRE63FLfoZ-f6DstDCPg2DscGWjLedzV8io4_rgzZ5bclqemWuGSLIbPshdh5jA8ZauKT1GZO4UzzXe9iL9ceQcNA7z0_e--8_dDt16MVfLj8pX5WTqbq8xTBY9vu5GyNmgGODMYmNRQGndTXMrh4CgLXz0MPoJtv18Ukq1oran5VpHVnDiSt1sj2wvOfJHugNO5jPUMdguzWweqAOq6PwyoRqqm51dJbxm1iL9mMbzxJbtu_cMZUPXyX5WD5t46flYKTJJ0_HvG2bXqKjoepFnOEe5oEvSKDjyncggGcxDGoF7KBBPQ","dq":"nSISudLeBp2j454fwRS1PMwy2E5OakeMVbqaYSuIik1sAt2Kc1Pe6eRNSuaYWQH5ue9MIePH6Eu8c4ilEeXzuo39CIbSFyC9TYSl7_KIS_Md8rRcSYyIm4KLC-5zCf53XT3d4s31DM3Xjn7G6-d0k5h-agqqRp2yvfI-uun2Bqmj1QLgxUD0e07HthCCKUmLT735QV9tvaXyw7agwa0aEK7hvOiF5WQEtukb3Ejh_OWnZo4tne3rMyepN6tDa7jx14c8orFiK_pugpD1LEq5l-UlnQBMDH2SZcOjap37mPgfr0DbTxrxhfiHzefqedqmaKAinWEv5SrYVmcmQeB_xQ","qi":"k2mVr3-_f-8_PX_liHQgpUnzcI8mGdeJTijJ1FFzphACopFMZBrKjIXgOK58UrhxBC3yYe6DUjJhjgsY3CBIfaKjFq7hz-_dibrokgsseeDBQjYa8KNXP-T4Os0bJQIvwHccFgAaYnCj_VJ9MJXpNREJDynpmsyM7FRAsgM_uOd1se17DJvIJLTQnEtxvbn1xH3v6JiDQtKe8QlgUZKKHbKR7UWOZ1y8zvcA71ACx8zi-pFeFFqiG1r49kIAwQK05rAfJcjgbAbxVDo_StXZIeON2Oa8W4V4DzytyshMgMICnGJIioPZ9fbhpyLnaEM9f6IIpLgrXuH6w--u5zy4Gg"};
            const tx = await arweave.createTransaction({ data: data }, key);
            tx.addTag('Content-Type', contentType);
            await arweave.transactions.sign(tx, key);

            let uploader = await arweave.transactions.getUploader(tx);
            while (!uploader.isComplete) {
                await uploader.uploadChunk();
                console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
            }
            setUploadTx(tx);
            setLoading(false);
        } catch(e) {
            console.error("uploadError", e);
            setLoading(false);
        }
      };

    const onChange = (e) => {
        setContent(e.target.value);
      };

      function handleFileLoad(event) {
        const data = event.target.result;
        runUpload(data, imageType)
      }

    const post = async () => {
        setPostLoading(true);
        if (!content && !uploadTx) {
            notification['error']({
                message: 'Error',
                description:
                  'Please write something or upload an image at least',
              });
        } else {
            var postContent = {
                summary: content
            };
            if (uploadTx) {
                postContent["contents"] = [{
                    mime_type: imageType,
                    address: ['https://arweave.net/'+uploadTx.id],
                }];
            }
            try {
                await rss3.items.custom.post(postContent);
                await rss3.files.sync();
                setPostLoading(false);
                handleOk();
            } catch(e) {
                setPostLoading(false);
                notification['error']({
                    message: 'Error',
                    description: e.toString(),
                  });
            }

            const tags = [
                { name: 'Content-Type', value: 'text/plain' },
                { name: 'App-Name', value: APP_NAME }
            ]

            const imageURI = uploadTx ? ('https://arweave.net/'+uploadTx.id) : '';

            const video = {
                content,
                imageURI,
                createdAt: new Date(),
                createdBy: bundlrInstance.address,
            }

            try {
                let tx = await bundlr.createTransaction(JSON.stringify(video), { tags })
                await tx.sign()
                const { data } = await tx.upload()

                console.log(`http://arweave.net/${data.id}`)
                setTimeout(() => {
                    router.push('/')
                }, 2000)
            } catch (err) {
                console.log('error uploading video with metadata: ', err)
            }
        }
    }

    const clear = () => {
        setImageType(null);
        setUploadTx(null);
        setContent('');
    }

    const customRequest = (info) => {
        setImageType(info.file.type);
        setLoading(true);
        new Compressor(info.file, {
            quality: 0.6,
            success(result) {
                const reader = new FileReader();
                reader.onload = handleFileLoad;
                reader.readAsDataURL(result);
            },
            error(err) {
              console.log(err.message);
            },
          });
    };


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
                {uploadTx ? (
                    <ArweaveImage txId={"https://arweave.net/"+uploadTx.id} />
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