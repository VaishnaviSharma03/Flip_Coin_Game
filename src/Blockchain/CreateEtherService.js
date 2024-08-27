import Web3 from 'web3';
import abi from './CoinFlip.json';
import BigNumber from 'bignumber.js';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const adminAccount = process.env.REACT_APP_ADMIN_ACCOUNT; // Admin account address
const adminPrivateKey = process.env.REACT_APP_ADMIN_PRIVATE_KEY; // Admin private key
const web3Provider = process.env.WEB3_PROVIDER || "https://bsc-testnet-rpc.publicnode.com";
const web3 = new Web3(web3Provider);
const tokenContract = new web3.eth.Contract(abi.abi, contractAddress);
const CreateEtherService = {
    flipCoin: async function (account, side, riskAmount) {
        try {
            // Validate account
            if (!web3.utils.isAddress(account)) {
                throw new Error('Invalid account address');
            }

            // Convert riskAmount to Wei
            const riskAmountInWei = web3.utils.toWei(riskAmount.toString(), "ether");

            // Estimate gas fee
            const gasFee = await this.getGasFee('DelegateTransfer'); // Update the operation name

            const tx = await tokenContract.methods.flip(side).send({
                from: adminAccount,
                value: riskAmountInWei,
                gas: gasFee,
                gasPrice: web3.utils.toWei('5', 'gwei')
            });

            console.log("Coin flipped!", tx);
            return tx;
        } catch (error) {
            console.error("Error flipping coin:", error);
        }
    },

    processResult: async function (userAccount, result, riskAmount) {
        try {
            const gasFee = await this.getGasFee('DelegateTransfer');

            const valueToSend = web3.utils.toWei(riskAmount, "ether");
            const valueToReceive = web3.utils.toWei((2 * riskAmount).toString(), "ether");

            const tx = {
                from: adminAccount,
                to: result === 'win' ? userAccount : adminAccount,
                value: result === 'win' ? valueToReceive : valueToSend,
                gas: gasFee,
                gasPrice: web3.utils.toWei('5', 'gwei')
            };

            console.log(tx, "Transaction details");

            const signedTx = await web3.eth.accounts.signTransaction(tx, adminPrivateKey);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            console.log("Transaction successful", receipt);
        } catch (error) {
            console.error("Error processing result:", error);
        }
    },

    connectWallet: async function () {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const account = accounts[1];
                console.log("Wallet connected! Account:", account);
                return { web3, account };
            } catch (error) {
                console.error("User rejected wallet connection:", error);
            }
        } else {
            console.error("No Ethereum provider found. Install MetaMask.");
        }
    },

    getStoredAccount: function () {
        return localStorage.getItem('account'); // Example implementation
    },

    disconnectWallet: function () {
        localStorage.removeItem('account'); // Example implementation
    },

    getGasFee: async function (operation) {
        const operationGasUsed = {
            DelegateTransfer: 200000,
            PreAuthorizedSell: 238794,
            Buy: 76093,
            DelegateApprove: 115338,
            BuyWithSignature: 124608,
        };

        const gasUsed = operationGasUsed[operation];
        let gasPrice;

        try {
            gasPrice = await web3.eth.getGasPrice();
            console.log(gasPrice, "gasPrice");

            // Convert gasPrice to gwei
            const gasP = web3.utils.fromWei(gasPrice, 'gwei');
            console.log(gasP, "gaspp");

            // Convert gasUsed to BigNumber for precision
            const gasU = new BigNumber(gasUsed);
            const GasP = gasU.multipliedBy(gasP).toString(); // Use toString() to avoid number precision issues

            console.log(GasP, "gasP===>>>>>>>>");
            return GasP;
        } catch (error) {
            console.error("Error calculating gas fee:", error);
            throw error;
        }
    },

    getAccountBalance: async function (account) {
        try {
            const balance = await web3.eth.getBalance(account);
            return web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error("Error getting account balance:", error);
            throw error;
        }
    }
};

export default CreateEtherService;
