import React, { useContext } from 'react'
import { Button } from '@material-ui/core/'

import { SocketContext } from '../SocketContext';

export default function Notifications() {
    const { answerCall, call, callAccepted } = useContext(SocketContext);
    return (
        <>
            {call.isReceivingCall && !callAccepted && (
                <div styles={{ display: 'flex', justifyContent: 'center' }}>
                    <h1>{call.name} is calling</h1>
                    <Button onClick={answerCall} color="primary" variant="contained">Answer</Button>
                </div>
            )}
        </>
    )
}
