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

export function Solanaopts() {
  const [response, setResponse] = useState(null);
  const [amt, setAmt] = useState(0);

  const SendSol = () => {
    const connection = new Connection(
      "https://solana-devnet.g.alchemy.com/v2/g6bihrlVp0mfJByfpOqK15q-QTusXEO2"
    );

    const recipient = new PublicKey(
      "E5yiBZpo6ga4YviQvZapkCAjDse9RnzP7Fr7f3t3xgU6"
    );
    const amount = amt * LAMPORTS_PER_SOL;

    const senderPublicKey = new PublicKey("HNJ4oQCVP8rdckdEJTafZAw4VwAw4i7oxUFRy9ttQ8iq");

    
    const privateKeyHex = "450e637fba98a192c08f8ffb6754808a888c8c77415bc8eb9afe3a063c92a93af32f7bdddc26c807f6c7a6e61e8c53f03c406b27cd648669575ec2f011158e1e";
    const privateKeyArray = new Uint8Array(
      privateKeyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );

    const senderKeypair = Keypair.fromSecretKey(privateKeyArray);

    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: recipient,
        lamports: amount,
      })
    );

    (async () => {
      try {
        
        const signature = await connection.sendTransaction(transaction, [
          senderKeypair,
        ]);

        console.log("Transaction signature:", signature);
        alert("sent");

        // Optionally, confirm the transaction
        const confirmation = await connection.confirmTransaction(signature);
        console.log("Transaction confirmed:", confirmation);
      } catch (err) {
        console.error("Transaction failed:", err);
      }
    })();
  };

  const bal = response / 1_000_000_000;

  const makeRpcall = async () => {
    const url =
      "https://solana-devnet.g.alchemy.com/v2/g6bihrlVp0mfJByfpOqK15q-QTusXEO2";
    const input = {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [`E5yiBZpo6ga4YviQvZapkCAjDse9RnzP7Fr7f3t3xgU6`],
    };
    try {
      const data = await axios.post(url, input);
      setResponse(data.data.result.value);
      console.log(data.data.result.value);
    } catch (error) {
      console.error("Error making JSON-RPC call:", error);
    }
  };

  useEffect(() => {
    makeRpcall();
  });

  return (
    <>
      <p className="text-left py-2 text-2xl text-slate-200 font-bold font-sans">
        {bal}
      </p>
      <input
        type="text"
        className="text-left py-2 text-xl text-black-200 font-bold font-sans"
        onChange={(e) => setAmt(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
        onClick={SendSol}
      >
        Send
      </button>
    </>
  );
}
