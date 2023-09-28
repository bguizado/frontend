import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import React from 'react';
import './App.css';
import PageLogin  from "./pages/PageLogin"
import PageHome from "./pages/PageHome"
import PrivateRoute from './utils/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute><PageHome/></PrivateRoute>}/>
          <Route path="/main" element={<PageHome/>}/>
          <Route path="/login" element={<PageLogin/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
