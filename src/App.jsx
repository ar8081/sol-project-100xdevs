import { Mnemonics } from "./components/Mnemonics";
import { Security } from "./components/Security";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
    return(
      <>
      <Router>
        <Routes>
          <Route path={"/"} element={<Security />} />
          <Route path={"/create-wallet"} element={<Mnemonics />} />
          

        </Routes>
      </Router>
      
      </>
    )
  
}

export default App;
