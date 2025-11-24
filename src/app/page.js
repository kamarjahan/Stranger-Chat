"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  initializeApp 
} from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  runTransaction, 
  serverTimestamp, 
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { Send, User, X, Loader2, MessageSquare } from 'lucide-react';

/* --- FIREBASE CONFIGURATION ---
  REPLACE THIS WITH YOUR ACTUAL CONFIG FROM THE FIREBASE CONSOLE 
*/
const firebaseConfig = {
  apiKey: "AIzaSyB7erSUaE6TxsMUZUNLNIvFIfcqhf3ONic", 
  authDomain: "stranger-chat-b6585.firebaseapp.com",
  projectId: "stranger-chat-b6585",
  storageBucket: "stranger-chat-b6585.firebasestorage.app",
  messagingSenderId: "602913229838",
  appId: "1:602913229838:web:5d9db1b605d396995d005f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function StrangerChat() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, searching, chatting
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  // 1. Handle Anonymous Auth on Load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((err) => {
          console.error("Auth Error:", err);
          setError("Could not sign in anonymously. Check console.");
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Auto-scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Matchmaking Logic
  const findStranger = async () => {
    if (!user) return;
    setStatus('searching');
    setError('');
    setMessages([]);

    try {
      // Step A: Look for someone waiting in the queue
      const queueRef = collection(db, 'queue');
      const q = query(queueRef, where('status', '==', 'waiting'), orderBy('timestamp', 'asc'), limit(1));
      
      let foundMatch = false;

      // Use a transaction to safely "claim" a waiting user
      await runTransaction(db, async (transaction) => {
        const snapshot = await getDocs(q);
        
        // Filter out our own request if we accidentally left it there
        const validDocs = snapshot.docs.filter(d => d.data().userId !== user.uid);

        if (validDocs.length > 0) {
          // Found a stranger!
          const matchDoc = validDocs[0];
          const newRoomId = [user.uid, matchDoc.data().userId].sort().join('_'); // Unique Room ID
          
          // 1. Update the waiter's ticket to say "matched" and give them the room ID
          transaction.update(matchDoc.ref, {
            status: 'matched',
            roomId: newRoomId,
            matchedWith: user.uid
          });

          // 2. Create the room (optional, but good for security rules)
          const roomRef = doc(db, 'rooms', newRoomId);
          transaction.set(roomRef, {
            createdAt: serverTimestamp(),
            participants: [user.uid, matchDoc.data().userId]
          });

          setRoomId(newRoomId);
          foundMatch = true;
        }
      });

      if (foundMatch) {
        setStatus('chatting');
        return;
      }

      // Step B: If no one found, add OURSELVES to the queue
      const myQueueRef = doc(db, 'queue', user.uid);
      await setDoc(myQueueRef, {
        userId: user.uid,
        status: 'waiting',
        timestamp: serverTimestamp()
      });

      // Step C: Listen to our own queue document to see if someone picks us
      const unsubscribe = onSnapshot(myQueueRef, (snapshot) => {
        const data = snapshot.data();
        if (!data) return; // Document deleted

        if (data.status === 'matched' && data.roomId) {
          // Someone found us!
          setRoomId(data.roomId);
          setStatus('chatting');
          // Cleanup our queue ticket
          deleteDoc(myQueueRef);
          unsubscribe(); // Stop listening to queue
        }
      });

      // Cleanup listener if we cancel searching manually
      return () => unsubscribe();

    } catch (err) {
      console.error("Matchmaking error:", err);
      setError("Failed to match. Please try again.");
      setStatus('idle');
    }
  };

  // 4. Listen for Messages (Only when in a room)
  useEffect(() => {
    if (status !== 'chatting' || !roomId) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [status, roomId]);

  // 5. Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !roomId || !user) return;

    const text = inputText;
    setInputText(''); // Optimistic clear

    try {
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: text,
        senderId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Send error:", err);
      setError("Failed to send message.");
    }
  };

  // 6. Leave Chat
  const leaveChat = () => {
    setStatus('idle');
    setRoomId(null);
    setMessages([]);
    // Optional: Send a "User disconnected" system message before leaving
    // Optional: Delete the room doc if you want ephemeral chats
  };

  // --- RENDER HELPERS ---

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <span className="ml-3">Connecting to Stranger Server...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
             <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StrangerChat
          </h1>
        </div>
        <div className="text-xs text-gray-400">
          ID: {user.uid.slice(0, 6)}...
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        
        {/* IDLE STATE */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-gray-700">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Talk to a Stranger</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Click below to find a random chat partner. Your identity is kept anonymous.
            </p>
            <button
              onClick={findStranger}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full shadow-lg transform transition active:scale-95 flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Find Stranger
            </button>
            {error && <p className="mt-4 text-red-400 bg-red-900/20 px-4 py-2 rounded">{error}</p>}
          </div>
        )}

        {/* SEARCHING STATE */}
        {status === 'searching' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Looking for someone...</h2>
            <p className="text-gray-400 mb-8">Please wait while we match you with a stranger.</p>
            <button
              onClick={leaveChat}
              className="px-6 py-2 border border-gray-600 hover:bg-gray-800 text-gray-300 rounded-full transition"
            >
              Cancel
            </button>
          </div>
        )}

        {/* CHATTING STATE */}
        {status === 'chatting' && (
          <div className="flex flex-col h-full">
            {/* Top Bar */}
            <div className="bg-gray-800/50 p-3 flex justify-between items-center text-sm border-b border-gray-700 backdrop-blur-sm">
              <span className="text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Connected with Stranger
              </span>
              <button 
                onClick={leaveChat}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 hover:bg-red-900/20 px-3 py-1 rounded transition"
              >
                <X className="w-4 h-4" /> Stop
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-10 text-sm">
                  Say hello!
                </div>
              )}
              
              {messages.map((msg) => {
                const isMe = msg.senderId === user.uid;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm
                        ${isMe 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-gray-700 text-gray-200 rounded-bl-none'
                        }
                      `}
                    >
                      {msg.text}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}