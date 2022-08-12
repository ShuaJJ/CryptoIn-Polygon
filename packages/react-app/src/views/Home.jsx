import CryptoInGrid from "../components/Grid";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ address, provider }) {

  return (
    <CryptoInGrid type="home" myAddress={address} provider={provider} />
  );
}

export default Home;
