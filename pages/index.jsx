import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

const App = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setProvider(provider);
        handleAccountsChanged(provider.selectedAddress ? [provider.selectedAddress] : []);

        // 监听账户更改
        provider.on('accountsChanged', handleAccountsChanged);
      } else {
        console.error('MetaMask provider not found');
      }
    };
    init();
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      console.log('Please connect to MetaMask.');
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
    } catch (error) {
      if (error.code === 4001) {
        console.log('User rejected the request.');
      } else {
        console.error(error);
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    // 这里没有直接的MetaMask方法来断开连接，但清空账户信息可以达到类似的效果
  };

  return (
    <div>
      <h1>My DApp</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={disconnectWallet}>Disconnect MetaMask</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default App;