import React, { useState, useEffect } from 'react';
import Bitcoin from '../assets/bithead-removebg-preview.png';
import SideModal from './SideModal';
import CreateEtherService from '../Blockchain/CreateEtherService';
import './styles/gameDashboard.css';

export const GameDashboard = ({ account }) => {
    const [side, setSide] = useState('');  // State for the selected side
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState(''); // State for the result of the coin flip
    const [isFlipping, setIsFlipping] = useState(false); // State to manage coin flipping animation
    const [balance, setBalance] = useState(''); // State to store user's balance
    const [riskAmount, setRiskAmount] = useState(''); // State for the risk amount

    useEffect(() => {
        // Fetch and set the initial balance when the component mounts
        if (account) {
            checkBalance();
        }
    }, [account]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const flipCoin = async () => {
        if (!account) {
            console.error("No account connected");
            return;
        }

        if (!riskAmount || isNaN(riskAmount) || Number(riskAmount) <= 0) {
            console.error("Invalid risk amount");
            return;
        }

        setIsFlipping(true);
        try {
            // Convert string 'Head' or 'Tail' to boolean
            const booleanSide = side === 'Head';

            // Convert risk amount to string and ensure it's a valid number
            const riskAmountInEther = Number(riskAmount);

            // Fetch balance before the game
            const initialBalance = await CreateEtherService.getAccountBalance(account);

            // Flip coin
            const tx = await CreateEtherService.flipCoin(account, booleanSide, riskAmountInEther);

            setTimeout(async () => {
                // Simulate coin flip result
                const sides = ['Head', 'Tail'];
                const outcome = sides[Math.floor(Math.random() * sides.length)];
                const userResult = outcome === side ? 'win' : 'lose';

                setResult(userResult === 'win' ? 'You won!' : `You lost! The coin landed on ${outcome}.`);

                // Handle processing of result and update balance
                await CreateEtherService.processResult(account, userResult, riskAmountInEther);

                // Fetch updated balance after the game
                const updatedBalance = await CreateEtherService.getAccountBalance(account);
                setBalance(updatedBalance);

                setIsFlipping(false);
            }, 1000);
        } catch (error) {
            console.error("Error flipping coin:", error);
            setResult('Error flipping coin. Please try again.');
            setIsFlipping(false);
        }
    };

    const checkBalance = async () => {
        try {
            const userBalance = await CreateEtherService.getAccountBalance(account);
            setBalance(userBalance);
        } catch (error) {
            console.error("Error checking balance:", error);
        }
    };

    return (
        <div className='p-4'>
            <h1 className='font-bold text-2xl text-white'>FLIP THE COIN</h1>
            <div className='m-3 p-5 items-center flex justify-center relative'>
                <img
                    src={Bitcoin}
                    alt='coin'
                    className={`max-w-xl h-max ${isFlipping ? 'animate-spin-slow' : ''}`}  // Apply spin animation during flip
                />
                {side && !isFlipping && (
                    <>
                        <button
                            className='absolute text-xl font-bold rounded-xl bg-transparent border-2 border-[#021826] p-3'
                            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                            onClick={flipCoin}
                        >
                            Flip Coin
                        </button>
                    </>
                )}
            </div>
            <button
                className='text-white text-xl font-bold rounded-xl bg-[#0079FD] p-3 mt-4'
                onClick={handleOpen}
                disabled={isFlipping}  // Disable button during flipping
            >
                {side ? `You Chose ${side}` : 'Choose Your Side'}
            </button>
            {open && (
                <SideModal
                    open={open}
                    handleClose={handleClose}
                    setSide={setSide}
                    side={side}
                />
            )}
            {result && (
                <div className='mt-4 text-white text-xl'>
                    {result}
                </div>
            )}
            <div className='mt-4 text-xl'>
                <input
                    type='number'
                    value={riskAmount}
                    onChange={(e) => setRiskAmount(e.target.value)}
                    placeholder='Enter amount to risk'
                    className='border-2 border-[#021826] rounded-xl p-2'
                />
            </div>
            <div className='mt-4 text-white text-xl'>
                <button
                    className='text-white text-xl font-bold rounded-xl bg-[#0079FD] p-3 mt-4'
                    onClick={checkBalance}
                    disabled={isFlipping}  // Disable button during flipping
                >
                    Check Balance
                </button>
                <div>
                    Current Balance: {balance} ETH
                </div>
            </div>
        </div>
    );
};
