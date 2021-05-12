import React, { useContext, useState } from 'react'
import { Button, Typography, TextField, Grid, Container, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    gridContainer: {
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    container: {
        width: '600px',
        margin: '35px 0',
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    },
    margin: {
        marginTop: 20,
    },
    padding: {
        padding: 20,
    },
    paper: {
        padding: '10px 20px',
        border: '2px solid black',
    },
}));

export default function Options({ children }) {
    const { call,
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
        answerCall } = useContext(SocketContext)

    const [idToCall, setIdToCall] = useState('');
    const classes = useStyles();
    return (
        <Container className={classes.Container}>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete={false}>
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography variant="h5" gutterBottom>Account Info</Typography>
                            <TextField label={'Name'} value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                            <CopyToClipboard text={me} className={classes.margin}>
                                <Button variant={'contained'} color='primary' fullWidth startIcon={<Assignment fontSize={'large'} />}>
                                    Copy your Id
                                </Button>
                            </CopyToClipboard>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography variant="h5" gutterBottom>Make a call</Typography>
                            <TextField label={'Id to call'} value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
                            {
                                callAccepted && !callEnded ?
                                    <>
                                        <Button variant={'contained'} color='secondary' fullWidth
                                            startIcon={<PhoneDisabled fontSize={'large'} />}
                                            onClick={leaveCall}
                                            className={classes.margin}> hang up</Button>
                                    </>
                                    :
                                    <Button variant={'contained'} color='primary' fullWidth
                                        startIcon={<Phone fontSize={'large'} />}
                                        onClick={() => {
                                            console.log(idToCall);
                                            callUser(idToCall);
                                        }}
                                        className={classes.margin}> call</Button>
                            }
                        </Grid>
                    </Grid>
                </form>
                {children}
            </Paper>
        </Container>
    )
}
