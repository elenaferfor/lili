import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Index from "./screens/index/Index.tsx";
import Login from "./screens/login/Login.tsx";
import AuthProvider from "./auth/AuthContext.tsx";
import RutaProtegida from "./components/ruta_protegida/RutaProtegida.tsx";


function App() {

  return (
      <BrowserRouter>
          <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/" element={
                    <RutaProtegida>
                        <Index/>
                    </RutaProtegida>
                } />
            </Routes>
          </AuthProvider>
      </BrowserRouter>
  )
}

export default App
