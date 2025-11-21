import React, { useCallback, useEffect, useRef, useState } from 'react'

const Room = ({ socket }) => {

    const [roomId, setRoomId] = useState('');
    const roomIdRef = useRef(null);
    const [onlineRoomUsers, setOnlineRoomUsers] = useState([]);

    const generateRoomId = useCallback(() => {
        return Math.random().toString(36).substring(2, 7).toUpperCase();
    }, []);

    const [generatedRoomId, setGeneratedRoomId] = useState('');

    useEffect(() => {
        const id = generateRoomId();
        roomIdRef.current.value = id;
        setGeneratedRoomId(id);
    }, [generateRoomId]);

    useEffect(() => {
        const handler = ({ users }) => {
            setOnlineRoomUsers(users);
        };

        socket.on("room-joined-alert", handler);

        return () => socket.off("room-joined-alert", handler);
    }, [socket]);

    const handleJoinRoom = () => {
        if (!roomId.trim()) return;
        socket.emit("join-room", { roomId });
    };

    return (
        <div>
            <h1>Room</h1>
            <input
                ref={roomIdRef}
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleJoinRoom}>Join Room</button>

            <div>
                <h2>Room ID: {generatedRoomId}</h2>
                <h2>Users: {onlineRoomUsers.join(", ")}</h2>
            </div>
        </div>
    );
};

export default Room;

