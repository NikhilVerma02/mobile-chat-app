import { useState } from 'react';

const Login = ({ onLogin }) => {
    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('defaultAvatar.png');

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Join Chat Room</h2>
                {avatar && <img src={avatar} alt="Avatar" className="avatar-preview" />}
                <input placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="Avatar URL (optional)" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                <button onClick={() => onLogin(roomId, name, avatar)}>Enter</button>
            </div>
        </div>

    );
};

export default Login;