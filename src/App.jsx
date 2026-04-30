import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Vote, Calendar, UserCheck, ClipboardList, Send, MapPin, Search, Info, CheckCircle, Clock, Camera, AlertCircle, Loader2, Fingerprint, LogIn, ExternalLink, X, ShieldAlert, ShieldCheck, ChevronLeft, ChevronRight, ListChecks, Bell, Zap, PlayCircle, Sparkles } from 'lucide-react';
import DOMPurify from 'dompurify';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import './index.css';

// --- FIREBASE MOCK CONFIGURATION ---
const firebaseConfig = {
  apiKey: "REDACTED_MOCK_KEY",
  authDomain: "election-assistant-demo.firebaseapp.com",
  projectId: "election-assistant-demo",
  storageBucket: "election-assistant-demo.appspot.com",
  messagingSenderId: "0000000000",
  appId: "0:0000000000:web:mock123456",
  measurementId: "G-DEMO12345"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// --- UTILITIES & SECURITY ---
/**
 * Simulated Error Boundary to catch UI crashes and prevent info leaks.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{ padding: '40px', textAlign: 'center' }}><h1>Something went wrong.</h1><p>The application encountered an error. Please refresh.</p></div>;
    return this.props.children;
  }
}

/**
 * Mock Google Cloud Natural Language API for misinformation analysis.
 * @param {string} text - The news snippet to analyze.
 * @returns {Promise<Object>} Sentiment and entities.
 */
const mockNLPAPICall = async (text) => {
  console.log("Calling Google Cloud Natural Language API...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ score: -0.8, magnitude: 0.9, entities: ["Election", "Date"] });
    }, 1500);
  });
};

/**
 * Mock Google Cloud Vision API for document analysis.
 * @param {string} imageData - Base64 encoded image data.
 * @returns {Promise<Object>} Verification results.
 */
const mockVisionAPICall = async (imageData) => {
  console.log("Calling Google Cloud Vision API for document analysis...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        label: "Voter ID Card",
        confidence: 0.98,
        detectedText: "ELECTION COMMISSION OF INDIA"
      });
    }, 2000);
  });
};

// --- DATA ---
const steps = [
  { id: 1, label: "Step 1", title: "Voter Registration", content: "The first step to participating in any election is ensuring you are registered.", icon: <UserCheck size={32} />, feature: "registration", color: "#FF3B30" },
  { id: 2, label: "Step 2", title: "Candidate Research", content: "Learn about the candidates, their platforms, and their vision for the future.", icon: <Search size={32} />, feature: "research", color: "#FF9500" },
  { id: 3, label: "Step 3", title: "Find Your Polling Place", content: "Locate where you need to go on election day or explore early voting.", icon: <MapPin size={32} />, feature: "location", color: "#FFCC00" },
  { id: 4, label: "Step 4", title: "Document Checker", content: "Upload your ID and let our AI check if it's valid for voting in your area.", icon: <Camera size={32} />, feature: "scanner", color: "#34C759" },
  { id: 5, label: "Step 5", title: "Booth Finder", content: "Find your nearest polling booth with real-time crowd updates.", icon: <MapPin size={32} />, feature: "map", color: "#5AC8FA" },
  { id: 6, label: "Step 6", title: "First-Time Voter?", content: "Try our 30-second interactive simulator to see inside the booth.", icon: <LogIn size={32} />, feature: "simulator", color: "#007AFF" },
  { id: 7, label: "Step 7", title: "Cast Your Vote", content: "Make your voice heard. Follow the specific instructions for your method.", icon: <Vote size={32} />, feature: "voting", color: "#5856D6" },
  { id: 8, label: "Step 8", title: "Follow Results", content: "Stay updated as the votes are counted and official results are certified.", icon: <ClipboardList size={32} />, feature: "results", color: "#AF52DE" }
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
const Navbar = React.memo(() => (
  <nav className="nav-bar" aria-label="Main Navigation">
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
));
Navbar.displayName = "Navbar";

const DecorativeShapes = React.memo(() => (
  <div className="bg-shapes">
    <div className="shape" style={{ top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(255, 59, 48, 0.1)' }} />
    <div className="shape" style={{ top: '60%', right: '5%', width: '400px', height: '400px', background: 'rgba(0, 122, 255, 0.1)' }} />
    <div className="shape" style={{ top: '40%', left: '40%', width: '250px', height: '250px', background: 'rgba(52, 199, 89, 0.1)' }} />
    <div className="confetti" style={{ top: '20%', left: '15%', background: '#FF3B30', transform: 'rotate(15deg)' }} />
    <div className="confetti" style={{ top: '25%', right: '20%', background: '#FF9500', transform: 'rotate(-20deg)' }} />
    <div className="confetti" style={{ bottom: '30%', left: '10%', background: '#34C759', transform: 'rotate(45deg)' }} />
    <div className="confetti" style={{ top: '50%', right: '10%', background: '#007AFF', transform: 'rotate(10deg)' }} />
  </div>
));
DecorativeShapes.displayName = "DecorativeShapes";

// --- PAGES ---
const ReelsPage = () => (
  <main className="reels-page" aria-label="Tutorial Reels">
    <Navbar />
    <Link to="/" className="reel-back" aria-label="Go back to home"><ChevronLeft size={20} /> Back</Link>
    {reels.map(reel => (
      <div key={reel.id} className="reel-card" style={{ backgroundImage: `url(${reel.img})` }}>
        <div className="reel-content">
          <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>{reel.title}</h2>
          <p style={{ fontSize: '17px', opacity: 0.9 }}>{reel.desc}</p>
        </div>
      </div>
    ))}
  </main>
);

const ChecklistPage = () => {
  const [checked, setChecked] = useState([]);
  const toggle = (id) => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <div className="checklist-page">
      <Navbar />
      <DecorativeShapes />
      <main id="main-content" className="apple-container" style={{ maxWidth: '800px', marginTop: '60px' }}>
        <Link to="/" className="back-link" aria-label="Return to the main election guide"><ChevronLeft size={20} /> Back to Guide</Link>
        <header>
          <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>What to Carry.</h1>
          <p style={{ fontSize: '21px', color: 'var(--text-secondary)', marginBottom: '40px' }}>Your personalized checklist for election day.</p>
        </header>
        <section aria-label="Interactive checklist">
          <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
            {checklistItems.map(item => (
              <button 
                key={item.id} 
                className="checklist-item" 
                onClick={() => toggle(item.id)}
                aria-pressed={checked.includes(item.id)}
                aria-label={`Mark ${item.title} as ${checked.includes(item.id) ? 'incomplete' : 'complete'}`}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <div className={`check-circle ${checked.includes(item.id) ? 'checked' : ''}`}>{checked.includes(item.id) && <CheckCircle size={20} color="white" />}</div>
                <div style={{ fontWeight: '600', fontSize: '17px' }}>{item.title}</div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const GuidePage = () => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [location, setLocation] = useState("Detecting...");
  const [deadlines, setDeadlines] = useState({ register: "October 12", vote: "November 3" });
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
    setTimeout(() => { setLocation("New Delhi, India"); }, 2000);
    const interval = setInterval(() => {
      const levels = ["Low", "Moderate", "High"];
      const times = ["5 mins", "15 mins", "45 mins"];
      const rand = Math.floor(Math.random() * 3);
      setCrowdLevel(levels[rand]); setWaitTime(times[rand]);
      if (levels[rand] === "Low" && !showLiveAlert) { setShowLiveAlert(true); }
    }, 5000);
    return () => clearInterval(interval);
  }, [showLiveAlert]);

  /**
   * Toggles the completion state of a specific step.
   * @param {number} id - The ID of the step to toggle.
   */
  const toggleStep = (id) => setCompletedSteps(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  
  /**
   * Handles the AI-powered ID scanning process.
   */
  const handleScan = async () => { 
    setScanning(true); 
    setScanResult(null); 
    try {
      const result = await mockVisionAPICall("mock_image_data");
      setScanning(false); 
      setScanResult({ status: "success", message: `Valid ${result.label} Detected! (Verified by AI)` }); 
    } catch (error) {
      setScanning(false);
      setScanResult({ status: "error", message: "Scan failed. Please try again." });
    }
  };
  
  /**
   * Verifies news snippets using Google Cloud Natural Language AI.
   */
  const handleVerifyNews = async () => {
    if (!newsInput.trim()) return;
    setDetecting(true); 
    setNewsResult(null);
    const sanitizedInput = DOMPurify.sanitize(newsInput.toLowerCase());
    
    // Using Google Cloud NLP API (Mocked)
    const nlpResult = await mockNLPAPICall(sanitizedInput);
    
    setDetecting(false);
    const isFake = nlpResult.score < -0.5 || sanitizedInput.includes("postponed") || sanitizedInput.includes("cancel");
    setNewsResult({ type: isFake ? "fake" : "verified", message: isFake ? "Misinformation Detected by Google NLP AI" : "Verified by Google Cloud AI" });
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="app">
      <a href="#main-content" className="skip-link" style={{ position: 'absolute', top: '-40px', left: 0, background: 'var(--accent-blue)', color: 'white', padding: '8px', zIndex: 2000 }}>Skip to content</a>
      <Navbar />
      <DecorativeShapes />
      <div className="progress-bar" style={{ top: '52px' }} role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" aria-label="Completion progress"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      
      <AnimatePresence>
        {showLiveAlert && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 72, opacity: 1 }} exit={{ y: -100, opacity: 0 }} style={{ position: 'fixed', top: '0', left: '50%', transform: 'translateX(-50%)', zIndex: 1001, width: 'calc(100% - 40px)', maxWidth: '500px' }} role="alert">
            <div style={{ background: '#1d1d1f', color: 'white', padding: '16px 24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ background: 'var(--accent-blue)', padding: '10px', borderRadius: '12px' }}><Zap size={20} fill="white" /></div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: '600', fontSize: '15px' }}>Best time to go vote!</div><div style={{ fontSize: '13px', opacity: 0.8 }}>Crowd is LOW right now.</div></div>
              <button onClick={() => setShowLiveAlert(false)} aria-label="Close alert" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} style={{ marginBottom: '20px', color: 'var(--accent-blue)' }} aria-hidden="true">
          <Sparkles size={48} />
        </motion.div>
        <motion.h1 id="hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          Understand your vote. <br />
          <span style={{ color: 'var(--accent-blue)' }}>Interactive election assistant.</span>
        </motion.h1>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="apple-container">
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} style={{ background: 'white', borderRadius: '24px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--card-shadow)', borderLeft: '8px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ background: '#f5f5f7', padding: '15px', borderRadius: '15px' }}><Calendar color="var(--accent-blue)" /></div>
              <div><div className="card-label">Smart Tracker • {location}</div><h3 style={{ fontSize: '24px', fontWeight: '600' }}>Election Day: {deadlines.vote}</h3></div>
            </div>
            <div style={{ textAlign: 'right' }}><p style={{ color: '#ff3b30', fontWeight: '600', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={18} /> Reg. deadline: {deadlines.register}</p></div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '0 20px 40px' }}>
        <div className="apple-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#f5f5f7', borderRadius: '24px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '15px' }}><ListChecks color="#FF3B30" /></div>
                <div><h3 style={{ fontSize: '18px' }}>What to carry?</h3><p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Personalized document list.</p></div>
              </div>
              <button onClick={() => navigate('/checklist')} style={{ background: '#FF3B30', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>Checklist <ChevronRight size={18} /></button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} style={{ background: '#1d1d1f', color: 'white', borderRadius: '24px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px' }}><PlayCircle color="#FF9500" /></div>
                <div><h3 style={{ fontSize: '18px' }}>Tutorials & FAQs</h3><p style={{ opacity: 0.7, fontSize: '14px' }}>Watch interactive guides.</p></div>
              </div>
              <button onClick={() => navigate('/reels')} style={{ background: '#FF9500', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>View <ChevronRight size={18} /></button>
            </motion.div>
          </div>
        </div>
      </section>

      <section>
        <div className="apple-container">
          <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>The Process. <span style={{ color: 'var(--text-secondary)' }}>Step by step.</span></h2>
          <div className="scroll-container">
            {steps.map((step, index) => (
              <motion.div key={step.id} className="card" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} style={{ borderTop: `8px solid ${step.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><div style={{ color: step.color }}>{step.icon}</div>{completedSteps.includes(step.id) && <CheckCircle color="#34C759" fill="#34C759" size={24} />}</div>
                <div className="card-label" style={{ color: step.color }}>{step.label}</div><h3 className="card-title">{step.title}</h3>
                {step.feature === "scanner" && (
                  <div className="scanner-container" role="region" aria-live="polite" aria-label="ID scanner results">
                    {scanning && <div className="scanner-line" aria-label="Scanning in progress..." />}
                    <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400" className="id-preview" alt="Placeholder voter identification card" />
                    {!scanning && !scanResult && <button onClick={handleScan} aria-label={`Start scanning for ${step.title}`} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', border: 'none', padding: '10px 20px', borderRadius: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Scan ID</button>}
                    {scanResult && <div style={{ position: 'absolute', inset: 0, background: 'rgba(52, 199, 89, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><div><CheckCircle size={40} aria-hidden="true" /><p>{scanResult.message}</p></div></div>}
                  </div>
                )}
                {step.feature === "map" && (
                  <div className="map-mockup">
                    <MapPin className="map-pin" size={32} />
                    <div className="map-label">Booth #42 • <span style={{ color: crowdLevel === 'High' ? '#FF3B30' : '#34C759' }}>{crowdLevel} Crowd</span><div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Wait: {waitTime}</div></div>
                    <button 
                      onClick={() => window.open('https://www.google.com/maps/search/polling+booth+near+me', '_blank')}
                      aria-label="View polling booth on Google Maps"
                      style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', border: 'none', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MapPin size={12} color="#4285F4" /> Open in Maps
                    </button>
                  </div>
                )}
                {step.feature === "simulator" && (
                  <div style={{ marginTop: '20px' }}>
                    <p className="card-content" style={{ marginBottom: '20px' }}>Experience the process inside the booth in a safe demo.</p>
                    <button onClick={() => setShowSim(true)} style={{ background: step.color, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', width: '100%', boxShadow: `0 4px 14px ${step.color}44` }}>Launch Simulator</button>
                  </div>
                )}
                {(!["scanner", "map", "simulator"].includes(step.feature)) && (
                  <p className="card-content">{step.content}</p>
                )}
                <div style={{ position: 'absolute', bottom: '40px', left: '40px' }}><button onClick={() => toggleStep(step.id)} style={{ background: completedSteps.includes(step.id) ? '#f5f5f7' : step.color, color: completedSteps.includes(step.id) ? 'var(--text-primary)' : 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer' }}>{completedSteps.includes(step.id) ? "Done ✔" : "Mark Done"}</button></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="timeline-section" style={{ background: 'transparent' }}>
        <div className="apple-container">
          <h2 style={{ fontSize: '32px', marginBottom: '60px', textAlign: 'center' }}>Election Timeline</h2>
          <div className="timeline">{timeline.map((item, index) => (
            <div key={index} className="timeline-item"><div className="timeline-dot" style={{ background: 'var(--accent-blue)' }} /><div className="timeline-content" style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: 'var(--card-shadow)' }}><div className="card-label">{item.date}</div><h3>{item.title}</h3><p>{item.description}</p></div></div>
          ))}</div>
        </div>
      </section>

      <AnimatePresence>
        {showSim && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
            <motion.div className="modal-content" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ borderTop: '8px solid var(--accent-blue)' }}>
              <button onClick={() => {setShowSim(false); setSimIndex(0);}} aria-label="Close Simulator" style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
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
      </main>
      <footer style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }} role="contentinfo">
        <p>© 2026 Election Assistant • Guided Democracy. Built for accessibility.</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GuidePage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/reels" element={<ReelsPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
