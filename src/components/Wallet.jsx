import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";

function Wallet(props) {
  const [response, setResponse] = useState(null);
  const [amt, setAmt] = useState(0);
  const [walletInputs, setWalletInputs] = useState([
    { id: 1, value: "" },
  ]); // Initialize with one wallet input

  const SendSol = () => {
    const connection = new Connection(
      "https://solana-devnet.g.alchemy.com/v2/g6bihrlVp0mfJByfpOqK15q-QTusXEO2"
    );

    const senderPublicKey = new PublicKey(props.publickey);
    const privateKeyHex = props.privatekey;
    const privateKeyArray = new Uint8Array(
      privateKeyHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    const senderKeypair = Keypair.fromSecretKey(privateKeyArray);

    walletInputs.forEach(async (wallet) => {
      const recipient = new PublicKey(wallet.value);
      const amount = amt * LAMPORTS_PER_SOL;

      let transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipient,
          lamports: amount,
        })
      );

      try {
        const signature = await connection.sendTransaction(transaction, [
          senderKeypair,
        ]);

        console.log("Transaction signature:", signature);
        alert("Sent");

        const confirmation = await connection.confirmTransaction(signature);
        console.log("Transaction confirmed:", confirmation);
      } catch (err) {
        console.error("Transaction failed:", err);
      }
    });
  };

  const makeRpcall = async (publicKey) => {
    const url =
      "https://solana-devnet.g.alchemy.com/v2/g6bihrlVp0mfJByfpOqK15q-QTusXEO2";
    const input = {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [publicKey],
    };
    try {
      const data = await axios.post(url, input);
      setResponse(data.data.result.value);
      console.log(data.data.result.value);
    } catch (error) {
      console.error("Error making JSON-RPC call:", error);
    }
  };

  const addWalletInput = () => {
    setWalletInputs([
      ...walletInputs,
      { id: walletInputs.length + 1, value: "" },
    ]);
  };

  const handleInputChange = (id, value) => {
    const updatedInputs = walletInputs.map((input) =>
      input.id === id ? { ...input, value } : input
    );
    setWalletInputs(updatedInputs);
  };

  useEffect(() => {
    makeRpcall(props.publickey);
  }, [props.publickey]);

  return (
    <div>
      <div className="bg-slate-800 text-white p-4 rounded-md border border-slate-700 mb-2">
        <p className="font-bold text-lg">Public Key:</p>
        <p>{props.publickey}</p>
      </div>
      <div className="bg-slate-800 text-white p-4 rounded-md border border-slate-700">
        <p className="font-bold text-lg">Private Key:</p>
        <p>{props.privatekey}</p>
      </div>
      <div className="py-4">
        <input
          type="text"
          placeholder="Amount"
          className="text-black border ms-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setAmt(e.target.value)}
        /><span className="ms-2 text-lg">Each wallet will receive equal amount of sol</span>
       
      </div>
      <div className="py-2">
        {walletInputs.map((wallet) => (
          <input
            key={wallet.id}
            type="text"
            placeholder="Wallet Address"
            value={wallet.value}
            className="text-black border ms-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            onChange={(e) => handleInputChange(wallet.id, e.target.value)}
          />
        ))}
        <button
          className="bg-amber-600 text-white ms-2 px-3 rounded-md hover:bg-blue-600"
          onClick={addWalletInput}
        >
          Add Wallet
        </button>
      </div>
      <button
        className="bg-blue-500 text-white py-2 ms-2 px-4 rounded-lg hover:bg-blue-600"
        onClick={SendSol}
      >
        Send
      </button>

      <p className="font-bold text-lg">Balance: {response / 1_000_000_000}</p>
    </div>
  );
}

export default Wallet;

Wallet.propTypes = {
  publickey: PropTypes.string.isRequired,
  privatekey: PropTypes.string.isRequired,
};
