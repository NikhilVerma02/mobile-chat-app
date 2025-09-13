import { useState, useEffect } from 'react';
import socket from './socket';

const ChatRoom = ({ roomId, name, avatar }) => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState(() => JSON.parse(localStorage.getItem(roomId)) || []);
    const [typingUser, setTypingUser] = useState('');
    const [statusMap, setStatusMap] = useState({});

    useEffect(() => {
        socket.emit('joinRoom', { roomId, name, avatar });

        socket.on('receiveMessage', (data) => {
            setChat((prev) => {
                const updated = [...prev, data];
                localStorage.setItem(roomId, JSON.stringify(updated));
                return updated;
            });
            scrollToBottom();

            // 🔔 Trigger notification if tab is inactive
            if (document.hidden && Notification.permission === 'granted') {
                const body = `${data.name}: ${data.message}`;
                new Notification('New Message', {
                    body,
                    icon: data.avatar || '/defaultAvatar.png',
                });
                const audio = new Audio('/notification.wav');
                audio.play().catch((err) => console.warn('Audio play blocked:', err));
            }
        });

        socket.on('typing', (user) => {
            setTypingUser(user);
            setTimeout(() => setTypingUser(''), 1000);
        });

        socket.on('userStatus', ({ name, status, avatar }) => {
            setStatusMap((prev) => ({ ...prev, [name]: { status, avatar } }));
        });

        

        return () => {
            socket.off('receiveMessage');
            socket.off('typing');
            socket.off('userStatus');
        };
    }, []);

    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then((perm) => {
                console.log('Notification permission:', perm);
            });
        }
    }, []);

    useEffect(() => {
        // 🔊 Preload notification sound
        const preload = new Audio('/notification.wav');
        preload.load();
    }, []);



    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('sendMessage', { roomId, message, name, avatar });
            setMessage('');
        }
    };

    const handleTyping = () => {
        socket.emit('typing', { roomId, name });
    };

    return (
        <div className="container">
            <div className="header">Room: {roomId}</div>
            <div className="status">
                {Object.entries(statusMap).map(([user, info]) => (
                    <div key={user}>
                        <img src={info.avatar || '/default-avatar.png'} className="avatar" />
                        {user} is {info.status}
                    </div>
                    
                ))}
            </div>
            <div>
                {typingUser && <p className="typing">{typingUser} is typing...</p>}
            </div>
            <div className="chat-box">
                {chat.map((msg, i) => {
                    const isSelf = msg.name === name;
                    return (
                        <div key={i} className="message-row">
                            <img src={msg.avatar || '/defaultAvatar.png'} className="avatarBackground" />
                            <div className={`message ${isSelf ? 'self' : 'other'}`}>
                                <strong>{msg.name}:</strong> {msg.message}
                            </div>
                        </div>
                    );
                })} 
            </div>
            <div className="input-area">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (message.trim()) sendMessage();
                }} style={{ display: 'flex', width: '100%' }}>
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (message.trim()) sendMessage();
                            } else {
                                handleTyping();
                            }
                        }}
                        placeholder="Type a message..."
                        autoFocus
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;