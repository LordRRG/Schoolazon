import React, { useState } from 'react';
import api from '../api';

export default function Login({ setToken }){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');
  const submit = async (e)=>{
    e.preventDefault();
    try{
      const r = await api.post('/auth/login', { email, password });
      setToken(r.data.token);
    }catch(err){ setMsg(err.response?.data?.error || 'Error'); }
  };
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">Login</h3>
          <form onSubmit={submit}>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">Login</button>
          </form>
          {msg && <div className="mt-3 alert alert-danger">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
