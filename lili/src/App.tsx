import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Index from "./screens/index/Index.tsx";


function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
