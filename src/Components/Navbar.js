import React, { useEffect, useState } from 'react';
import Logo from '../assets/logo1.png';
import CreateEtherService from '../Blockchain/CreateEtherService';
export const Header = ({ setAccount }) => {
    const [account, setLocalAccount] = useState(null);

    useEffect(() => {
        const storedAccount = CreateEtherService.getStoredAccount();
        if (storedAccount) {
            setLocalAccount(storedAccount);
            setAccount(storedAccount); // Update parent component
        }
    }, [setAccount]);

    const connectWallet = async () => {
        const { web3, account } = await CreateEtherService.connectWallet();
        if (account) {
            setAccount(account); // Pass the account to the parent component
            setLocalAccount(account); // Update local state
        }
    };

    const disconnectWallet = () => {
        CreateEtherService.disconnectWallet();
        setLocalAccount(null);
        setAccount(null); // Clear account in parent component
    };

    return (
        <nav className='bg-[#021826] shadow-slate-600 p-4 border-b'>
            <div className='items-center justify-between flex'>
                <img className='w-32 h-17' src={Logo} alt='logo' />
                {account ? (
                    <div className='flex items-center'>
                        <span className='text-white text-xl font-bold mr-4'>{`Connected: ${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                        <button
                            className='text-white text-xl font-bold rounded-xl bg-[#0079FD] p-3'
                            onClick={disconnectWallet}
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        className='text-white text-xl font-bold rounded-xl bg-[#0079FD] p-3'
                        onClick={connectWallet}
                    >
                        Connect Your Wallet
                    </button>
                )}
            </div>
        </nav>
    );
};
