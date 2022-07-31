import { Menu } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Header,
  ThemeSwitch,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import { Web3ModalSetup } from "./helpers";
import { Home, MyAccount } from "./views";
import { useStaticJsonRPC } from "./hooks";
import { WebBundlr } from "@bundlr-network/client"
import Following from "./views/Following";
import Deposit from "./components/Deposit";
import Tip from "./components/Tip";
import Conversations from "./views/Conversations";
import { LoadingOutlined } from "@ant-design/icons";

const { ethers } = require("ethers");
const initialNetwork = NETWORKS.mumbai;
const USE_BURNER_WALLET = false; // toggle burner wallet feature

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [isPolygon, setIsPolygon] = useState(false);
  const [bundlr, setBundlr] = useState();
  const [userSigner, setUserSigner] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(initialNetwork.name);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
      setUserSigner(null);
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);

        const chainId = await userSigner.getChainId();
        setIsPolygon(chainId == 80001);
        
        const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", injectedProvider)
        await bundlr.ready()
      }
    }
    getAddress();
  }, [userSigner]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    const ip = new ethers.providers.Web3Provider(provider);
    setInjectedProvider(ip);
    setUserSigner(ip.getSigner());

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      const ip = new ethers.providers.Web3Provider(provider);
      setInjectedProvider(ip);
      setUserSigner(ip.getSigner());
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      const ip = new ethers.providers.Web3Provider(provider);
      setInjectedProvider(ip);
      setUserSigner(ip.getSigner());
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header>
        {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 1, paddingTop: "8px" }}>
            {isPolygon ? <Deposit address={address} signer={userSigner} /> : (userSigner && <span>Please switch to Mumbai</span>)}
            <Account
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
            />
            <ThemeSwitch />
          </div>
        </div>
      </Header>

      <Menu style={{ textAlign: "center", marginTop: 20, borderBottom: "none" }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/" className="linkTitle">Featured</Link>
        </Menu.Item>
        <Menu.Item key="/following">
          <Link to="/following" className="linkTitle">Following</Link>
        </Menu.Item>
        <Menu.Item key="/mine">
          <Link to="/mine" className="linkTitle">Mine</Link>
        </Menu.Item>
        <Menu.Item key="/chats">
          <Link to="/chats" className="linkTitle">Chats</Link>
        </Menu.Item>
      </Menu>

      {userSigner ? <Switch>
        <Route exact path="/">
          {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
          <Home />
        </Route>
        <Route exact path="/following">
          <Following />
        </Route>
        <Route path="/mine">
          <MyAccount provider={injectedProvider} address={address} loadWeb3Modal={loadWeb3Modal} />
        </Route>
        <Route exact path="/chats">
          <Conversations provider={injectedProvider} />
        </Route>
      </Switch> : <div style={{color: "#00ACF1", fontSize: "18px", marginTop: '32px', fontWeight: "600"}}>Please connect your wallet first</div>}

      <div className="footer">
              <strong style={{fontSize: '17px'}}>Stack</strong>
              <p>Read/post feeds & Permanent storage service - <a href="https://www.arweave.org/" target="_blank"><img src="/nav-logo.svg" /> arweave</a></p>
              <p>Contracts editor and deployment - <a href="https://chainide.com/" target="_blank">ChainIDE</a></p>
              <p>Chats feature(secure messaging protocol) - <a href="https://xmtp.com/" target="_blank"><img src="https://xmtp.com/logos/main.svg" /> XMTP Labs</a></p>
              <p>Decentralized Access Control - <a href="https://litprotocol.com/" target="_blank"><img src="https://litprotocol.com/lit-logo.png" /> Lit Protocol</a></p>
              <p>Follow Connections - <a href="https://cyberconnect.me/" target="_blank"><img src="https://cyberconnect.me/_next/image?url=%2Fassets%2Fgrains.svg&w=64&q=75" /> CyberConnect</a></p>
              <br/>
              <strong style={{fontSize: '17px'}}>Joshua Jiang - The Developer</strong>
              <div style={{marginBottom: "15px"}}>I am a web3 developer who is currently working for <a href="https://theunit.one">The Unit</a>. I am glad about registering this Hackthon and learned all these new projects. </div>
              {isPolygon && <Tip signer={userSigner} />}
      </div>
    </div>
  );
}

export default App;
