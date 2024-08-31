import CryptoJS from "crypto-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const secretKey = "aG1dLqE0zr1UYYsv/lx2LxzggkkFOkTKJeMYmWgfNoEi";

function encryptData(password) {
  return CryptoJS.AES.encrypt(JSON.stringify(password), secretKey).toString();
}

function decryptData(passenc) {
  const bytes = CryptoJS.AES.decrypt(passenc, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
}

function storePassword(password) {
  const encryptedPassword = encryptData(password);
  localStorage.setItem("password", encryptedPassword);
}


export function Security() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const passwordExists = localStorage.getItem("password") ? true : false;

  const handleSubmit = () => {
    const storedPassword = localStorage.getItem("password");

    if (passwordExists) {
      if (storedPassword && decryptData(storedPassword) === password) {
        
        navigate("/create-wallet");
      } else {
        alert("Password not Matched");
      }
    } else {
      storePassword(password);
      
      navigate("/create-wallet");
    }
  };
  function logout() {
    localStorage.removeItem("password");
    localStorage.removeItem('keypairs');
    localStorage.removeItem('mnemonic');
    
    alert("Loged out of the wallet");
    window.location.reload()
    
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <p className="text-5xl text-slate-100 font-bold font-sans mb-6">Enter Password</p>
      <p className="text-xl text-slate-500 font-bold font-sans mb-6">
        Create a new one if you dont already have
      </p>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 p-3 rounded-md mb-4 w-80"
        placeholder="Enter your password"
      />
      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
