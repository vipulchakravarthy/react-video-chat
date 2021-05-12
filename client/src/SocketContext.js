import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState();

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {

        //get the permissions from user in browser
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;
        })

        //get the id from socket connect
        socket.on('me', (id) => {
            setMe(id);
        })

        //getting a call from other person
        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal })
        })
    }, [])

    const answerCall = () => {
        //call accepted
        setCallAccepted(true)
        console.log('inside answer call');
        //setting the peer 
        const peer = new Peer({ initiator: false, trickle: false, stream });


        peer.on('signal', (data) => {
            //emit that call as answered
            socket.emit('answerCall', { signal: data, to: call.from })
        })

        //stream the other user video
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })

        //transmitt the signal
        peer.signal(call.signal)

        //connection ref
        connectionRef.current = peer;
    }

    const callUser = (id) => {

        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            //emit that call as answered
            socket.emit('callUser', { userToCall: id, signalData: data, from: me, name })
        })

        //stream the other user video
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal)
        })

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }