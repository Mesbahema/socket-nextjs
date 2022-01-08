import styled from '@emotion/styled';
import { Button, Grid, Paper, TextField } from '@mui/material'
// import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import shortid from 'shortid';
import io from 'socket.io-client'

const MessageComponent = styled.div(({inComing}) => ({
  width: 'fit-content',
  marginRight: 'auto',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  padding: '2px 5px 5px 5px',
  color: 'white',
  margin: '5px',
  backgroundColor: inComing ? 'green' : 'blue',
  marginLeft: inComing ? 'auto' : ''
}))
export default function Home({pid}) {
  const initialValues = {
    message: {},
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
    setMessages([...messages, {
      content: values.message,
      inComing: false
    }])
    socket.emit('send-message', values.message , pid)
  }
  const onJoin = () => {
    socket.emit('join-room', values.room , message => {
      setMessages([...messages, {
        content: message,
        inComing: false
      }])
    })
  }
  useEffect(() => {
    if (newMessage) setMessages([...messages, {
      content: newMessage,
      inComing: true
    }])
  }, [newMessage])

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      if (socket) {
        socket.on('connect', () => {
          setMessages([...messages, {
            content: `you connected with id: ${socket.id}`,
            inComing: false
          }])
          socket.on(`recieve-message-${pid}`, (message) => {
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
            flexDirection: 'column',
            flexWrap: 'wrap',
            '& > :not(style)': {
              marginTop: 2,
              width: '100%',
              height: '300px',
              overflowY: 'auto'
            },
          }}
        >
          <Paper elevation={4} >
            {
              messages.map(item => (
                <MessageComponent inComing={item.inComing} key={shortid.generate()}>
                  {item.content}
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
            <Button onClick={onJoin} fullWidth variant="contained">Join</Button>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export async function getServerSideProps({params: {pid}}) {

  return {
    props: { pid: pid }, // will be passed to the page component as props
  }
}
