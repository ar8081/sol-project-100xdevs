import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import "../main.css";

import Wallet from "./Wallet";

export function SolanaWallet({ mnmo }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keypairs, setKeypairs] = useState([]);

  const toHexString = (byteArray) => {
    return Array.from(byteArray, (byte) => {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  };

  const isValidMnemonic = (mnemonic) => {
    return mnemonic && mnemonic.split(" ").length === 12;
  };

  useEffect(() => {
    const storedKeypairs = localStorage.getItem('keypairs');
    if (storedKeypairs) {
      try {
        const parsedKeypairs = JSON.parse(storedKeypairs);
        // Reconstruct the public and private keys properly
        const reconstructedKeypairs = parsedKeypairs.map(kp => ({
          publicKey: new PublicKey(kp.publicKey),
          privateKey: Uint8Array.from(Object.values(kp.privateKey))
        }));
        setKeypairs(reconstructedKeypairs);
        setCurrentIndex(reconstructedKeypairs.length);
      } catch (e) {
        console.error("Failed to parse keypairs from localStorage:", e);
      }
    }
  }, []);

  const deleteKeypairs = () => {
    localStorage.removeItem('keypairs');
    localStorage.removeItem('mnemonic');
    setKeypairs([]);
    setCurrentIndex(0);
    alert("All keypairs have been deleted.");
    window.location.reload()
  };

  const addKeypair = () => {
    if (!isValidMnemonic(mnmo)) {
      alert("Invalid or missing mnemonic. Please provide a valid seed phrase.");
      return;
    }

    const seed = mnemonicToSeedSync(mnmo);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;

    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    const newKeypairs = [
      ...keypairs,
      { publicKey: keypair.publicKey, privateKey: secret },
    ];

    setKeypairs(newKeypairs);
    setCurrentIndex(currentIndex + 1);

    
    localStorage.setItem('keypairs', JSON.stringify(newKeypairs));
  };

  return (
    <div>
      <div className="flex justify-items-end pl-8 py-10">
      {keypairs.length > 0 && (
            <div className="pr-6">
            <button className="bg-red-500 text-black border border-red-600 py-4 px-8 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
              onClick={deleteKeypairs}
              >
              Delete All Wallets
            </button>
            </div>
          
        )}
        {mnmo && (
            <button className="bg-slate-200 text-black border border-gray-300 py-4 px-8 rounded-lg shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
            onClick={addKeypair}
            >
          Add wallet
        </button>
        )}
      </div>
      {keypairs.length > 0 && (
          <div className="border border-slate-700 p-6 mx-8">

        <p className="text-left pb-6 py-2 text-2xl text-slate-200 font-bold font-sans">Your Wallets</p>
        {keypairs.map((kp, index) => (
          
          <div key={index} className="bg-slate-800 text-white p-4 rounded-md border border-slate-700 mb-2">
          <p className="pb-2 text-xl">Wallet {index+1}</p>
          <Wallet key={index} publickey={kp.publicKey.toBase58()} privatekey={toHexString(kp.privateKey)} />
          </div>
        ))}
        
        
      </div>
    )}
    </div>
  );
}

SolanaWallet.propTypes = {
  mnmo: PropTypes.string.isRequired,
};
