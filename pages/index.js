import styled from '@emotion/styled';
import { Button, Grid, Paper, TextField } from '@mui/material'
// import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useState, useEffect } from 'react';
import shortid from 'shortid';
import io from 'socket.io-client'

const MessageComponent = styled.div({
  width: 'fit-content',
  backgroundColor: 'blue',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  padding: '2px 5px 5px 5px',
  color: 'white',
  margin: '5px'
})
export default function Home() {
  const initialValues = {
    message: '',
    room: ''
  }
  const [values, setValues] = useState(initialValues)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState(null)
  const [socket, setSocket] = useState(null)

  const onChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSend = () => {
    console.log(messages)
    setMessages([...messages, values.message])
    socket.emit('send-message', values.message)
  }
  useEffect(() => {
    if(newMessage) setMessages([...messages, newMessage])
  }, [newMessage])

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      if (socket) {
        socket.on('connect', () => {
          setMessages([...messages, `you connected with id: ${socket.id}`])
          socket.on('recieve-message', (message)=> {
            setNewMessage(message)
          })
        })
      }
    })
  }, [socket])

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      setSocket(io())
    })
  }, [])
  return (
    <>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
              marginTop: 2,
              width: '100%',
              height: '300px',
            },
          }}
        >
          <Paper elevation={4} >
            {
              messages.map(message => (
                <MessageComponent key={shortid.generate()}>
                  {message}
                </MessageComponent>))
            }

          </Paper>
        </Box>
        <Grid container mt={2} alignItems={'center'} spacing={2}>
          <Grid item xs={9}>
            <TextField name="message" onChange={onChange} value={values.name} fullWidth id="standard-basic" variant="outlined" placeholder='write your message' />
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth onClick={onSend} variant="contained">Send</Button>
          </Grid>
          <Grid item xs={9}>
            <TextField name="room" onChange={onChange} value={values.room} fullWidth id="standard-basic" variant="outlined" placeholder='insert the room' />
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant="contained">Join</Button>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
