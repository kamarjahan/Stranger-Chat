"use client";

import DonationButton from './DonationButton';
import React, { useState, useEffect } from 'react';
import { 
  Download, Send, Linkedin, Github, Instagram, Mail, 
  ExternalLink, Code, CheckCircle, Loader2, Award, Menu, X, FileText, 
  QrCode, XCircle, Moon, Sun, Calendar, BookOpen, Facebook, Twitter, Music, Map
} from 'lucide-react';

import { db } from '../firebase'; 
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import MarketTicker from './MarketTicker';

export default function Portfolio() {
  const [text, setText] = useState('');
  const fullText = "Commerce Student. Tech Enthusiast. Digital Innovator.";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Data States
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showBlogs, setShowBlogs] = useState(false);

  // Modals State
  const [requestModal, setRequestModal] = useState(null); 
  const [showBizCard, setShowBizCard] = useState(false);
  const [readBlog, setReadBlog] = useState(null); // NEW: Blog Reader Modal

  const [contactInfo, setContactInfo] = useState('');
  const [reqStatus, setReqStatus] = useState('idle');

  // Toggle Dark Mode Function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Typewriter
    let i = 0;
    const typing = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(typing);
    }, 100);

    // Fetch Data
    const fetchAll = async () => {
      const projSnap = await getDocs(collection(db, "projects"));
      setProjects(projSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const achieveSnap = await getDocs(collection(db, "achievements"));
      setAchievements(achieveSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const roadSnap = await getDocs(collection(db, "roadmap"));
      setRoadmap(roadSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const blogSnap = await getDocs(collection(db, "blogs"));
      setBlogs(blogSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    fetchAll();

    return () => clearInterval(typing);
  }, []);

  // Handlers
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setReqStatus('loading');
    try {
      await addDoc(collection(db, "cert_requests"), {
        achievement: requestModal,
        contact: contactInfo,
        timestamp: serverTimestamp()
      });
      setReqStatus('success');
      setTimeout(() => {
        setReqStatus('idle');
        setRequestModal(null);
        setContactInfo('');
      }, 2000);
    } catch (error) { setReqStatus('error'); }
  };

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, "messages"), { ...formData, timestamp: serverTimestamp() });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) { setStatus('error'); }
  };

  return (
    <main className="min-h-screen bg-slate-light dark:bg-slate-dark text-oxford dark:text-white overflow-x-hidden relative transition-colors duration-300">
      
      {/* 1. MARKET TICKER */}
      <MarketTicker onShowID={() => setShowBizCard(true)} />

      {/* --- BLOG READER MODAL --- */}
      {readBlog && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative animate-fade-up p-8">
            <button onClick={() => setReadBlog(null)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 z-10"><XCircle size={28} /></button>
            
            <span className="text-xs font-bold text-gold uppercase tracking-widest">{readBlog.category}</span>
            <h2 className="text-3xl font-bold mt-2 mb-4 text-oxford dark:text-white">{readBlog.title}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 pb-6 border-b dark:border-slate-700">
               <span>{readBlog.date?.seconds ? new Date(readBlog.date.seconds * 1000).toLocaleDateString() : 'Recently'}</span>
               <span>•</span>
               <span>{readBlog.readTime}</span>
            </div>
            {readBlog.imageUrl && <img src={readBlog.imageUrl} className="w-full h-64 object-cover rounded-xl mb-6" />}
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {readBlog.content}
            </div>
          </div>
        </div>
      )}

      {/* --- DIGITAL BUSINESS CARD MODAL --- */}
      {showBizCard && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-card rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative animate-fade-up">
            <button onClick={() => setShowBizCard(false)} className="absolute top-4 right-4 text-white hover:text-red-200 z-10"><XCircle size={28} /></button>
            <div className="bg-oxford p-8 text-center text-white relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 bg-gray-200 overflow-hidden">
                 <img src="/profile.png" className="w-full h-full object-cover"/>
              </div>
              <h2 className="text-2xl font-bold mt-2">Kamar Jahan</h2>
              <p className="text-gold text-xs font-bold tracking-widest uppercase">Finance & Tech</p>
            </div>
            <div className="pt-12 pb-8 px-8 text-center space-y-6">
              <div className="flex justify-center">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://kamarjahan.in`} alt="Scan Me" className="border-4 border-slate-100 dark:border-slate-700 rounded-xl"/>
              </div>
              <p className="text-xs text-slate-400">Scan to visit Portfolio</p>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg dark:text-slate-300">
                  <Mail size={18} className="text-gold"/> <span className="text-sm font-medium">contact@kamarjahan.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- REQUEST POPUP MODAL --- */}
      {requestModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-card rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-up">
            <h3 className="text-2xl font-bold text-oxford dark:text-white mb-2">Request Credential</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Enter your details for: <span className="font-bold text-gold">{requestModal}</span></p>
            {reqStatus === 'success' ? (
              <div className="text-center py-8"><CheckCircle size={48} className="text-green-500 mx-auto mb-4"/><p className="font-bold">Request Sent!</p></div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <input autoFocus className="w-full p-4 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:border-gold dark:bg-slate-900 dark:text-white" placeholder="Enter Email or Phone" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setRequestModal(null)} className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                  <button disabled={reqStatus === 'loading'} className="flex-1 py-3 bg-oxford text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex justify-center">{reqStatus === 'loading' ? <Loader2 className="animate-spin"/> : "Send Request"}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-oxford dark:text-white">
            Kamar<span className="text-gold">Jahan</span>.in
          </h1>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
            <a href="#home" className="hover:text-gold transition-colors">Home</a>
            <a href="#git" className="hover:text-gold transition-colors">About</a>
            <a href="#achievements" className="hover:text-gold transition-colors">Achievements</a>
            <a href="#roadmap" className="hover:text-gold transition-colors">Goals</a>
            <a href="#projects" className="hover:text-gold transition-colors">Projects</a>
            <a href="/insights" className="hover:text-gold transition-colors">Blogs</a>
            
            {/* DARK MODE TOGGLE */}
            <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-oxford dark:text-gold hover:scale-110 transition-all">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a href="/admin" className="text-slate-300 hover:text-oxford dark:hover:text-white">Admin</a>
          </div>

          <div className="flex items-center gap-4 md:hidden">
             <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-oxford dark:text-gold">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-oxford dark:text-white">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-card border-t border-gray-100 dark:border-slate-800 p-4 flex flex-col gap-4 font-bold shadow-xl">
            <a href="#home" onClick={()=>setMobileMenuOpen(false)} className="dark:text-white">Home</a>
            <a href="#achievements" onClick={()=>setMobileMenuOpen(false)} className="dark:text-white">Achievements</a>
            <a href="#roadmap" onClick={()=>setMobileMenuOpen(false)} className="dark:text-white">Goals</a>
            <a href="#projects" onClick={()=>setMobileMenuOpen(false)} className="dark:text-white">Projects</a>
            <a href="/insights" className="dark:text-white">Blogs</a>
            
            <a href="/admin" className="text-gold">Admin Panel</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="pt-20 pb-20 px-6 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left space-y-6 animate-fade-up">
          <p className="text-gold font-bold tracking-widest uppercase text-xs">Welcome to my Portfolio</p>
          <h1 className="text-5xl md:text-7xl font-black text-oxford dark:text-white leading-tight">
            Muhammad <br/> Kamar Jahan
          </h1>
          <div className="h-8">
             <p className="text-xl text-slate-gray dark:text-slate-400 font-medium border-r-4 border-gold inline-block pr-2">{text}</p>
          </div>
          <p className="text-slate-gray dark:text-slate-400 text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
            Combining <strong>Financial Literacy</strong> with <strong>Modern Technology</strong> to build smarter, efficient digital solutions. 
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start pt-4">
            <a href="/resume.pdf" download="Kamar_Jahan_Resume.pdf" className="px-8 py-3 bg-oxford dark:bg-gold dark:text-oxford text-white rounded-lg shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 font-bold cursor-pointer">
              <Download size={18} /> Download Resume
            </a>
            
            <a href="#contact" className="px-8 py-3 border-2 border-oxford dark:border-white text-oxford dark:text-white rounded-lg hover:bg-oxford hover:text-white transition-all flex items-center justify-center gap-2 font-bold">
              Contact Me
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center relative">
          <div className="absolute w-80 h-80 bg-blue-100 dark:bg-slate-800 rounded-full blur-3xl -z-10 top-10 animate-pulse-slow"></div>
          <div className="w-64 h-64 md:w-96 md:h-96 bg-gray-200 dark:bg-slate-800 rounded-full border-8 border-white dark:border-slate-700 shadow-2xl overflow-hidden animate-float relative">
             <img src="/profile.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" className="py-24 bg-white dark:bg-slate-card/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-oxford dark:text-white mb-12 text-center">Achievements & Certifications</h2>
          {achievements.length === 0 ? (
            <p className="text-center text-slate-400">Loading achievements...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {achievements.map((item) => (
                <div key={item.id} className="bg-slate-light dark:bg-slate-card border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-oxford dark:bg-slate-800 p-3 rounded-lg text-white"><Award size={28} /></div>
                    <span className="bg-gold/20 text-oxford dark:text-gold px-3 py-1 rounded-full text-xs font-bold uppercase">Certified</span>
                  </div>
                  <h3 className="text-xl font-bold text-oxford dark:text-white">{item.title}</h3>
                  <p className="text-slate-gray dark:text-slate-400 mb-6">Issued by {item.issuer} • {item.year}</p>
                  <button onClick={() => setRequestModal(item.title)} className="mt-auto w-full py-3 border-2 border-oxford dark:border-gold text-oxford dark:text-gold rounded-lg font-bold hover:bg-oxford hover:text-white dark:hover:bg-gold dark:hover:text-oxford transition-all flex items-center justify-center gap-2">
                    <FileText size={18} /> Request Certificate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="py-24 bg-slate-light dark:bg-slate-dark relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-oxford dark:text-white text-center mb-16">My Goals & Roadmap</h2>
          <div className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-6 md:ml-1/2 space-y-12">
            {roadmap.map((item, index) => (
               <div key={item.id} className={`relative pl-8 md:pl-0 md:flex ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center justify-between w-full group`}>
                 <div className={`absolute -left-[9px] md:left-1/2 md:-translate-x-[9px] w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 shadow-md z-10 
                   ${item.status === 'completed' ? 'bg-oxford dark:bg-blue-500' : item.status === 'current' ? 'bg-gold animate-pulse' : 'bg-gray-300 dark:bg-slate-600'}`}>
                 </div>
                 <div className={`md:w-[45%] p-6 rounded-xl border shadow-sm transition-all
                    ${item.status === 'current' ? 'bg-white dark:bg-slate-card border-2 border-gold shadow-lg' : 'bg-slate-light dark:bg-slate-900 border-gray-100 dark:border-slate-700'}`}>
                    <span className={`text-xs font-bold uppercase ${item.status === 'current' ? 'text-gold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.status === 'completed' ? 'Completed' : item.status === 'current' ? 'Present' : 'Target'}
                    </span>
                    <h4 className="text-lg font-bold text-oxford dark:text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.org} • {item.year}</p>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION (HOME VERSION - LIMITED TO 2) */}
      <section id="projects" className="py-24 bg-white dark:bg-slate-card/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-oxford dark:text-white text-center mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* SLICE(0, 2) SHOWS ONLY THE FIRST 2 PROJECTS */}
            {projects.slice(0, 2).map((proj) => (
              <div key={proj.id} className="bg-slate-light dark:bg-slate-card p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 hover:-translate-y-2 transition-all flex flex-col">
                {proj.imageUrl && <div className="w-full h-64 mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-900"><img src={proj.imageUrl} className="w-full h-full object-cover" /></div>}
                <h3 className="font-bold text-xl text-oxford dark:text-white mb-2">{proj.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">{proj.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">{proj.tech}</span>
                    {proj.link && <a href={proj.link} target="_blank" className="flex items-center gap-1 text-sm font-bold text-oxford dark:text-white hover:text-gold transition-colors">View <ExternalLink size={16} /></a>}
                </div>
              </div>
            ))}
          </div>
          
          {/* SHOW MORE BUTTON */}
          <div className="text-center mt-12">
            <a 
              href="/projects" 
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-oxford dark:border-white text-oxford dark:text-white font-bold rounded-full hover:bg-oxford hover:text-white dark:hover:bg-white dark:hover:text-oxford transition-all"
            >
              Show All Projects <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </section>

      

      {/* CONTACT */}
      <section id="contact" className="py-24 bg-oxford dark:bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
           <div className="space-y-4">
                 <div className="flex items-center gap-4 text-lg hover:text-gold transition-colors cursor-pointer">
                    <Mail /> contact@kamarjahan.in
                 </div>
                 
                 {/* SOCIAL MEDIA LINKS */}
                 <div className="flex gap-5 pt-6">
                    {/* Facebook */}
                    <a href="https://facebook.com/kamarjahan" target="_blank" className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full text-oxford dark:text-white hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1">
                      <Facebook size={20} />
                    </a>

                    {/* X (Formerly Twitter) */}
                    <a href="https://x.com/kamarjahan" target="_blank" className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full text-oxford dark:text-white hover:bg-black hover:text-white transition-all hover:-translate-y-1">
                      <Twitter size={20} />
                    </a>

                    {/* Instagram */}
                    <a href="https://instagram.com/kammu.in" target="_blank" className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full text-oxford dark:text-white hover:bg-pink-600 hover:text-white transition-all hover:-translate-y-1">
                      <Instagram size={20} />
                    </a>

                    {/* Spotify (Using Music Icon) */}
                    <a href="https://open.spotify.com/user/kamarjahan" target="_blank" className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full text-oxford dark:text-white hover:bg-green-500 hover:text-white transition-all hover:-translate-y-1">
                      <Music size={20} />
                    </a>

                    {/* Github */}
                    <a href="https://github.com/kamarjahan" target="_blank" className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full text-oxford dark:text-white hover:bg-gray-700 hover:text-white transition-all hover:-translate-y-1">
                      <Github size={20} />
                    </a>          
                 </div>
                 {/* Quote */}
                 <div className="pt-5 mt-4 border-t border-gray-50 dark:border-slate-400">
                    <p className="text-lg font-serif italic text-slate-200 dark:text-slate-250 leading-relaxed">
                       "Technology is the pen, and Finance is the story. I write both."
                    </p>
                    <p className="text-sm font-bold text-gold mt-2">— Kamar Jahan</p>
                 </div>

                 {/* Location & Status */}
                 <div className="pt-8 space-y-4">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                       <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-oxford dark:text-gold">
                          <Map size={18} />
                       </div>
                       <span className="text-sm">Based in India • Available Worldwide</span>
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-full">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       Open to Opportunities
                    </div>
                 </div>
                 
              </div>

           <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-card p-6 rounded-xl text-oxford dark:text-white shadow-2xl space-y-4">
              <input name="name" value={formData.name} onChange={handleChange} required type="text" placeholder="Your Name" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 outline-none focus:border-gold transition-all" />
              <input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="Your Email" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 outline-none focus:border-gold transition-all" />
              <textarea name="message" value={formData.message} onChange={handleChange} required rows="3" placeholder="Message" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 outline-none focus:border-gold transition-all"></textarea>
              <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-oxford dark:bg-gold dark:text-oxford text-white font-bold rounded-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2 disabled:opacity-70">{status === 'loading' ? <Loader2 className="animate-spin" /> : "Send Message"}</button>
              <a 
  href="https://calendly.com/ztenkammu/30min" 
  target="_blank" 
  className="flex items-center gap-4 text-lg hover:text-gold transition-colors cursor-pointer mt-4"
>
  <div className="bg-gold/20 p-2 rounded-full text-gold">
     {/* You need to import Calendar from lucide-react at the top */}
     <Calendar size={20} /> 
  </div>
  Schedule a Meeting
</a>
           </form>
           <DonationButton />
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-sm bg-oxford dark:bg-slate-950 border-t border-gray-800">
        <p>© 2025 Muhammad Kamar Jahan. Built with Next.js & Firebase.</p>
      </footer>
    </main>
  );
}