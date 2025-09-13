import { useState, useEffect } from 'react';
import Login from './Login';
import ChatRoom from './ChatRoom';
import './styles.css';

const App = () => {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <>
      <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
      {roomId && name ? (
        <ChatRoom roomId={roomId} name={name} avatar={avatar} />
      ) : (
        <Login onLogin={(r, n, a) => { setRoomId(r); setName(n); setAvatar(a); }} />
      )}
    </>
  );
};

export default App;