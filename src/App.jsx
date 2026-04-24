import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Vote, Calendar, UserCheck, ClipboardList, Send, MapPin, Search, Info, CheckCircle, Clock, Camera, AlertCircle, Loader2, Fingerprint, LogIn, ExternalLink, X, ShieldAlert, ShieldCheck, ChevronLeft, ChevronRight, ListChecks, Bell, Zap, PlayCircle } from 'lucide-react';
import './index.css';

// --- DATA ---
const steps = [
  { id: 1, label: "Step 1", title: "Voter Registration", content: "The first step to participating in any election is ensuring you are registered.", icon: <UserCheck size={32} />, feature: "registration" },
  { id: 2, label: "Step 2", title: "Candidate Research", content: "Learn about the candidates, their platforms, and their vision for the future.", icon: <Search size={32} />, feature: "research" },
  { id: 3, label: "Step 3", title: "Find Your Polling Place", content: "Locate where you need to go on election day or explore early voting.", icon: <MapPin size={32} />, feature: "location" },
  { id: 4, label: "Step 4", title: "Document Checker", content: "Upload your ID and let our AI check if it's valid for voting in your area.", icon: <Camera size={32} />, feature: "scanner" },
  { id: 5, label: "Step 5", title: "Booth Finder", content: "Find your nearest polling booth with real-time crowd updates.", icon: <MapPin size={32} />, feature: "map" },
  { id: 6, label: "Step 6", title: "First-Time Voter?", content: "Try our 30-second interactive simulator to see inside the booth.", icon: <LogIn size={32} />, feature: "simulator" },
  { id: 7, label: "Step 7", title: "Cast Your Vote", content: "Make your voice heard. Follow the specific instructions for your method.", icon: <Vote size={32} />, feature: "voting" },
  { id: 8, label: "Step 8", title: "Follow Results", content: "Stay updated as the votes are counted and official results are certified.", icon: <ClipboardList size={32} />, feature: "results" }
];

const simSteps = [
  { title: "Arrival & ID Check", desc: "Show your ID to the polling officer. They verify your name.", icon: <UserCheck size={48} /> },
  { title: "The Indelible Ink", desc: "Special ink is applied to your finger—a mark of pride!", icon: <Fingerprint size={48} /> },
  { title: "Secret Ballot", desc: "Enter the compartment. Your choice is completely private.", icon: <ShieldCheck size={48} /> },
  { title: "The Beep", desc: "Press the button for your candidate. Your vote is cast!", icon: <Vote size={48} /> }
];

const timeline = [
  { date: "6 Months Out", title: "Voter Registration Opens", description: "Start checking your registration status." },
  { date: "1 Month Out", title: "Early Voting Begins", description: "Many locations offer mail-in ballot requests." },
  { date: "Election Day", title: "The Big Day", description: "Polls are open until evening. Final day to vote." }
];

const checklistItems = [
  { id: 1, title: "Voter ID Card", desc: "The primary document needed for verification." },
  { id: 2, title: "Aadhaar Card / Alternate ID", desc: "Mandatory secondary ID if Voter ID is missing." },
  { id: 3, title: "Voter Information Slip", desc: "Contains your booth number and serial number." },
  { id: 4, title: "Face Mask & Sanitizer", desc: "Recommended for health safety at the booth." }
];

const reels = [
  { id: 1, title: "How Voting Works", desc: "A quick 30-second guide on the democratic process.", img: "https://images.unsplash.com/photo-1540910419892-f0bbddcf6a88?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "How EVM Works", desc: "Understanding the Electronic Voting Machine.", img: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=800" }
];

// --- SHARED COMPONENTS ---
const Navbar = () => (
  <nav className="nav-bar">
    <div className="nav-content">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '600' }}>
        <Vote size={20} color="var(--accent-blue)" /> ElectionBot
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Guide</Link>
        <Link to="/checklist" className="nav-link">Checklist</Link>
        <Link to="/reels" className="nav-link">Tutorials</Link>
      </div>
    </div>
  </nav>
);

// --- PAGES ---
const ReelsPage = () => (
  <div className="reels-page">
    <Navbar />
    <Link to="/" className="reel-back"><ChevronLeft size={20} /> Back</Link>
    {reels.map(reel => (
      <div key={reel.id} className="reel-card" style={{ backgroundImage: `url(${reel.img})` }}>
        <div className="reel-content">
          <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>{reel.title}</h2>
          <p style={{ fontSize: '17px', opacity: 0.9 }}>{reel.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

const ChecklistPage = () => {
  const [checked, setChecked] = useState([]);
  const toggle = (id) => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <motion.div className="checklist-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Navbar />
      <div className="apple-container" style={{ maxWidth: '800px', marginTop: '60px' }}>
        <Link to="/" className="back-link"><ChevronLeft size={20} /> Back to Guide</Link>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>What to Carry.</h1>
        <p style={{ fontSize: '21px', color: 'var(--text-secondary)', marginBottom: '40px' }}>Your personalized checklist.</p>
        <div style={{ background: '#f5f5f7', borderRadius: '24px', overflow: 'hidden' }}>
          {checklistItems.map(item => (
            <div key={item.id} className="checklist-item" onClick={() => toggle(item.id)}>
              <div className={`check-circle ${checked.includes(item.id) ? 'checked' : ''}`}>{checked.includes(item.id) && <CheckCircle size={20} color="white" />}</div>
              <div style={{ fontWeight: '600', fontSize: '17px' }}>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const GuidePage = () => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [location, setLocation] = useState("Detecting...");
  const [deadlines, setDeadlines] = useState({ register: "May 15", vote: "Nov 5" });
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [crowdLevel, setCrowdLevel] = useState("Low");
  const [waitTime, setWaitTime] = useState("5 mins");
  const [showSim, setShowSim] = useState(false);
  const [simIndex, setSimIndex] = useState(0);
  const [newsInput, setNewsInput] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [newsResult, setNewsResult] = useState(null);
  const [showLiveAlert, setShowLiveAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => { setLocation("New Delhi, India"); setDeadlines({ register: "October 12", vote: "November 3" }); }, 2000);
    const interval = setInterval(() => {
      const levels = ["Low", "Moderate", "High"];
      const times = ["5 mins", "15 mins", "45 mins"];
      const rand = Math.floor(Math.random() * 3);
      setCrowdLevel(levels[rand]); setWaitTime(times[rand]);
      if (levels[rand] === "Low" && !showLiveAlert) { setShowLiveAlert(true); }
    }, 5000);
    return () => clearInterval(interval);
  }, [showLiveAlert]);

  const toggleStep = (id) => setCompletedSteps(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const handleScan = () => { setScanning(true); setScanResult(null); setTimeout(() => { setScanning(false); setScanResult({ status: "success", message: "Valid Voter ID Detected!" }); }, 3000); };
  const handleVerifyNews = () => {
    if (!newsInput.trim()) return;
    setDetecting(true); setNewsResult(null);
    setTimeout(() => {
      setDetecting(false);
      const isFake = newsInput.toLowerCase().includes("postponed") || newsInput.toLowerCase().includes("cancel") || newsInput.toLowerCase().includes("holiday");
      setNewsResult({ type: isFake ? "fake" : "verified", message: isFake ? "Potential Misinformation Detected" : "Information Verified" });
    }, 2000);
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="app">
      <Navbar />
      <div className="progress-bar" style={{ top: '52px' }}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      
      <AnimatePresence>
        {showLiveAlert && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 52, opacity: 1 }} exit={{ y: -100, opacity: 0 }} style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1001, width: 'calc(100% - 40px)', maxWidth: '500px' }}>
            <div style={{ background: '#1d1d1f', color: 'white', padding: '16px 24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'var(--accent-blue)', padding: '10px', borderRadius: '12px' }}><Zap size={20} fill="white" /></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: '600', fontSize: '15px' }}>Best time to go vote!</div><div style={{ fontSize: '13px', opacity: 0.8 }}>Crowd is LOW right now.</div></div>
              <button onClick={() => setShowLiveAlert(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="hero">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          Understand your vote. <br />
          <span style={{ color: 'var(--accent-blue)' }}>Interactive election assistant.</span>
        </motion.h1>
      </section>

      <section style={{ padding: '0 20px 40px' }}>
        <div className="apple-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#f5f5f7', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'white', padding: '12px', borderRadius: '12px', width: 'fit-content' }}><ListChecks color="var(--accent-blue)" size={20} /></div>
              <h3 style={{ fontSize: '17px' }}>What to carry?</h3>
              <button onClick={() => navigate('/checklist')} style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Open Checklist</button>
            </div>
            <div style={{ background: '#1d1d1f', color: 'white', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', width: 'fit-content' }}><PlayCircle color="white" size={20} /></div>
              <h3 style={{ fontSize: '17px' }}>Tutorials & FAQs</h3>
              <button onClick={() => navigate('/reels')} style={{ background: 'white', color: '#1d1d1f', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>View Tutorials</button>
            </div>
            <div style={{ background: 'white', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ background: '#f5f5f7', padding: '12px', borderRadius: '12px', width: 'fit-content' }}><Calendar color="var(--accent-blue)" size={20} /></div>
              <h3 style={{ fontSize: '17px' }}>Day: {deadlines.vote}</h3>
              <div style={{ color: '#ff3b30', fontSize: '12px', fontWeight: '600' }}>Reg: {deadlines.register}</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="apple-container">
          <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>The Process. <span style={{ color: 'var(--text-secondary)' }}>Step by step.</span></h2>
          <div className="scroll-container">
            {steps.map((step, index) => (
              <motion.div key={step.id} className="card" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><div style={{ color: 'var(--accent-blue)' }}>{step.icon}</div>{completedSteps.includes(step.id) && <CheckCircle color="#34c759" fill="#34c759" size={24} />}</div>
                <div className="card-label">{step.label}</div><h3 className="card-title">{step.title}</h3>
                {step.feature === "scanner" && (
                  <div className="scanner-container">
                    {scanning && <div className="scanner-line" />}
                    <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400" className="id-preview" alt="ID Mockup" />
                    {!scanning && !scanResult && <button onClick={handleScan} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', border: 'none', padding: '10px 20px', borderRadius: '15px', fontWeight: '600', cursor: 'pointer' }}>Scan ID</button>}
                    {scanResult && <div style={{ position: 'absolute', inset: 0, background: 'rgba(52, 199, 89, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><div><CheckCircle size={40} /><p>{scanResult.message}</p></div></div>}
                  </div>
                )}
                {step.feature === "map" && (
                  <div className="map-mockup">
                    <MapPin className="map-pin" size={32} />
                    <div className="map-label">Booth #42 • <span style={{ color: crowdLevel === 'High' ? '#ff3b30' : '#34c759' }}>{crowdLevel} Crowd</span><div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Wait: {waitTime}</div></div>
                  </div>
                )}
                {step.feature === "simulator" && (
                  <div style={{ marginTop: '20px' }}>
                    <p className="card-content" style={{ marginBottom: '20px' }}>Experience the process inside the booth in a safe demo.</p>
                    <button onClick={() => setShowSim(true)} style={{ background: 'var(--text-primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', width: '100%' }}>Launch Simulator</button>
                  </div>
                )}
                {(!["scanner", "map", "simulator"].includes(step.feature)) && <p className="card-content">{step.content}</p>}
                <div style={{ position: 'absolute', bottom: '40px', left: '40px' }}><button onClick={() => toggleStep(step.id)} style={{ background: completedSteps.includes(step.id) ? '#f5f5f7' : 'var(--accent-blue)', color: completedSteps.includes(step.id) ? 'var(--text-primary)' : 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer' }}>{completedSteps.includes(step.id) ? "Done ✔" : "Mark Done"}</button></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="timeline-section">
        <div className="apple-container">
          <h2 style={{ fontSize: '32px', marginBottom: '60px', textAlign: 'center' }}>Election Timeline</h2>
          <div className="timeline">{timeline.map((item, index) => (
            <div key={index} className="timeline-item"><div className="timeline-dot" /><div className="timeline-content"><div className="card-label">{item.date}</div><h3>{item.title}</h3><p>{item.description}</p></div></div>
          ))}</div>
        </div>
      </section>

      <AnimatePresence>
        {showSim && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <button onClick={() => {setShowSim(false); setSimIndex(0);}} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              <div className="sim-step-indicator">{simSteps.map((_, i) => <div key={i} className={`sim-dot ${i <= simIndex ? 'active' : ''}`} />)}</div>
              <div style={{ textAlign: 'center' }}><div style={{ color: 'var(--accent-blue)', marginBottom: '20px' }}>{simSteps[simIndex].icon}</div><h2>{simSteps[simIndex].title}</h2><p>{simSteps[simIndex].desc}</p></div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                {simIndex > 0 && <button onClick={() => setSimIndex(s => s - 1)} style={{ flex: 1, background: '#f5f5f7', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '600', cursor: 'pointer' }}>Back</button>}
                <button onClick={() => simIndex < simSteps.length - 1 ? setSimIndex(s => s + 1) : setShowSim(false)} style={{ flex: 2, background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '600', cursor: 'pointer' }}>{simIndex < simSteps.length - 1 ? "Next Step" : "Complete"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}><p>© 2026 Election Assistant • Guided Democracy</p></footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuidePage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/reels" element={<ReelsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
