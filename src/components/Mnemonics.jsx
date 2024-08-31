import { useState, useEffect } from "react";
import { generateMnemonic } from "bip39";
import "../main.css";
import { SolanaWallet } from "./SolanaWallet";
import { ClipboardIcon } from "@heroicons/react/24/outline";

export function Mnemonics() {
    const [mnemonic, setMnemonic] = useState("");
    const [hideSeed, setHideSeed] = useState(true);

    useEffect(() => {
        // Load mnemonic from localStorage when the component mounts
        const storedMnemonic = localStorage.getItem('mnemonic');
        if (storedMnemonic) {
            setMnemonic(storedMnemonic);
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mnemonic)
            .then(() => alert('Mnemonic copied to clipboard!'))
            .catch(err => alert('Failed to copy mnemonic: ' + err));
    };

    const generateAndStoreMnemonic = async () => {
        setHideSeed(false); // Show seed phrase when generated
        const mn = await generateMnemonic();
        setMnemonic(mn);
        localStorage.setItem('mnemonic', mn);
    };

    const toggleSeedPhraseVisibility = () => {
        setHideSeed(!hideSeed); // Toggle visibility
    };

    const mnemonicWords = mnemonic.split(' ');

    return (
        <>
            <p className="text-center py-8 text-5xl text-slate-100 font-bold font-sans">Create Solana Wallet</p>
            <p className="text-center py-2 text-2xl text-slate-400 font-bold font-sans">Most secure way to store your funds</p>
            <div className="">
                <div className="flex justify-center py-8">
                    <button
                        className="bg-slate-200 text-black border border-gray-300 py-4 px-8 rounded-lg shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
                        onClick={generateAndStoreMnemonic}
                    >
                        Create Seed Phrase
                    </button>

                    <button
                        className="bg-lime-400 text-black border ms-3 border-gray-300 py-4 px-8 rounded-lg shadow-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
                        onClick={toggleSeedPhraseVisibility}
                    >
                        {hideSeed ? "Show" : "Hide"}
                    </button>
                </div>

                {mnemonic && (
                    <div className="border border-slate-700 p-8 mx-10">
                        <p className="text-left pb-6 py-2 text-2xl text-slate-200 font-bold font-sans">Your secret phrase</p>

                        {!hideSeed && (
                            <div className="grid grid-cols-4 gap-4">
                                {mnemonicWords.map((word, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-800 text-white p-4 rounded-md text-center border border-slate-700 hover:bg-slate-700"
                                    >
                                        {word}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center py-4 px-4">
                            <ClipboardIcon
                                className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-600"
                                onClick={copyToClipboard}
                            />
                            <span
                                className="ml-2 text-lg text-slate-200 cursor-pointer hover:underline font-sans text-slate-400"
                                onClick={copyToClipboard}
                            >
                                Copy to Clipboard
                            </span>
                        </div>
                    </div>
                )}
                <SolanaWallet mnmo={mnemonic} />
            </div>
        </>
    );
}
