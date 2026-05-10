import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Index from "./screens/index/Index.tsx";
import Login from "./screens/login/Login.tsx";
import AuthProvider from "./auth/AuthContext.tsx";
import RutaProtegida from "./components/ruta_protegida/RutaProtegida.tsx";
import DetalleLibro from "./screens/detalle_libro/DetalleLibro.tsx";
import Categorias from "./screens/categorias/Categorias.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Register from "./screens/register/Register.tsx";
import Legal from "./screens/legal/Legal.tsx";
import Contacto from "./screens/contacto/Contacto.tsx";
import Anadir from "./screens/anadir/Anadir.tsx";

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
              <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/" element={
                        <RutaProtegida>
                            <Index/>
                        </RutaProtegida>
                    } />
                    <Route path="/categorias" element={
                        <RutaProtegida>
                            <Categorias/>
                        </RutaProtegida>
                    }/>
                    <Route path="/libro/:libroId" element={
                        <RutaProtegida>
                            <DetalleLibro/>
                        </RutaProtegida>
                    }/>
                    <Route path="/resultados" element={
                        <RutaProtegida>
                            <Anadir/>
                        </RutaProtegida>
                    }/>
                    <Route path="/contacto" element={
                        <RutaProtegida>
                            <Contacto/>
                        </RutaProtegida>
                    }/>
                    <Route path="/legal" element={
                        <RutaProtegida>
                            <Legal/>
                        </RutaProtegida>
                    }/>
                </Routes>
              </AuthProvider>
          </BrowserRouter>
      </QueryClientProvider>
  )
}

export default App
