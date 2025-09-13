import { useState } from 'react';
import socket from './socket';

const MediaUpload = ({ roomId, name, avatar }) => {
    const [file, setFile] = useState(null);

    const handleUpload = () => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            const mediaType = file.type.startsWith('image')
                ? 'image'
                : file.type.startsWith('video')
                    ? 'video'
                    : file.type.startsWith('audio')
                        ? 'audio'
                        : 'file';

            socket.emit('sendMedia', {
                roomId,
                mediaType,
                mediaData: base64,
                name,
                avatar,
            });
            setFile(null);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="media-upload">
            <input type="file" accept="image/*,video/*,audio/*" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Send Media</button>
        </div>
    );
};

export default MediaUpload;