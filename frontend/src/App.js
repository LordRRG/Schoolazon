import React, { useState, useEffect } from 'react';
import api from './api';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(()=> {
    if(token){
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  if(!token) return <div style={{padding:20}}><h2>Schoolazon MVP</h2><Signup setToken={setToken} /><hr/><Login setToken={setToken} /></div>;
  return <Home token={token} setToken={setToken} />;
}
