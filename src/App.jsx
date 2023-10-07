import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import React from 'react';
import './App.css';
import PageLogin  from "./pages/PageLogin"
import PageHome from "./pages/PageHome"
import PrivateRoute from './utils/PrivateRoute'
import PageUsuarios from "./pages/PageUsuarios";
import PageTiendas from "./pages/PageTiendas";
import PageRelevos from "./pages/PageRelevos";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute><PageHome/></PrivateRoute>}/>
          <Route path="/main" element={<PageHome/>}/>
          <Route path="/login" element={<PageLogin/>}/>
          <Route path="/usuarios" element={<PageUsuarios/>}/>
          <Route path="/tiendas" element={<PageTiendas/>}/>
          <Route path="/relevos" element={<PageRelevos/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
