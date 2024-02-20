import React from 'react';
import './styles/App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from './pages/main/MainLayout';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/forgot-password" element={<ForgotPassword />}/>
      <Route path="/page/*" element={<MainLayout />}/>
    </Routes>
  </BrowserRouter>
)

export default App;
