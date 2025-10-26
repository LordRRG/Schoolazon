import React, { useState, useEffect } from 'react';
import api from '../api';
import ProfileModal from './ProfileModal';
import { useState as useReactBootstrapState } from 'react';
import CommunityFeed from './CommunityFeed';

export default function Home({ token, setToken }){
  const [communities, setCommunities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showProfile, setShowProfile] = useReactBootstrapState(false);
  const [user, setUser] = useState(null);

  useEffect(()=>{ fetchCommunities(); }, []);
  useEffect(() => {
    // Fetch user details (replace with your actual API endpoint if needed)
    async function fetchUser() {
      try {
        const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, [token]);

  async function fetchCommunities(q=''){
    const res = await api.get('/communities?q='+encodeURIComponent(q));
    setCommunities(res.data);
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3 gap-2">
        <button className="btn btn-outline-primary" onClick={() => setShowProfile(true)}>View Profile</button>
        <button className="btn btn-outline-danger" onClick={()=>{ localStorage.removeItem('token'); setToken(null); }}>Logout</button>
      </div>
      <ProfileModal show={showProfile} onHide={() => setShowProfile(false)} user={user} />
      <h2 className="mb-4">Communities</h2>
      <ul className="list-group mb-3">
        {communities.map(c=> (
          <li key={c._id} className="list-group-item list-group-item-action" onClick={()=>setSelected(c)} style={{cursor:'pointer'}}>
            {c.name} {c.grade ? `(${c.grade})` : ''}
          </li>
        ))}
      </ul>
      <CreateCommunity onCreated={fetchCommunities} />
      {selected && (
        <div className="mt-4">
          <h3>{selected.name}</h3>
          <CommunityFeed community={selected} />
        </div>
      )}
    </div>
  );
}

function CreateCommunity({ onCreated }){
  const [name,setName]=useState(''); const [grade,setGrade]=useState(''); const [school,setSchool]=useState('');
  const submit = async e=>{ e.preventDefault(); await api.post('/communities', { name, grade, schoolName:school }); setName(''); setGrade(''); setSchool(''); onCreated(); };
  return (
    <div className="card mt-3">
      <div className="card-body">
        <h4 className="card-title mb-3">Create community</h4>
        <form onSubmit={submit} className="row g-2">
          <div className="col-md-4">
            <input className="form-control" placeholder="Community name" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Grade" value={grade} onChange={e=>setGrade(e.target.value)} />
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="School" value={school} onChange={e=>setSchool(e.target.value)} />
          </div>
          <div className="col-md-1">
            <button className="btn btn-success" type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
