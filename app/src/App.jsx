import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import './App.css'

const socket = io('/')

function App() {
  const [message, setMessage] = useState(0)
  const [messages, setMessages] = useState([{}])
  const [stream, setStream] = useState();
  useEffect(() => {
    socket.on('message', data => {
      setMessages([...messages , data])
    })
    socket.on('stream', img => {
      let lienzo = document.getElementById('lienzo')
      lienzo.src = img
    })
    console.log(messages);
  }, [messages]);
  const logger = (msg) => {
    const divText = document.getElementById('status')
    divText.innerText = msg
}
  const sendMessage = (e) => {
    e.preventDefault()
    socket.emit('message', message)
    setMessages([...messages , {
      body:message,
      from: 'Me'
    }])
  }
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  const loadCamera= (stream , video) => {
    try {
    video.srcObject = stream;
    } catch (error) {
    video.src = URL.createObjectURL(stream);
    }
    setStream(stream)
    logger("Camara conecatada");
    }
    const viewVideo = (video,context,canvas) => {
      context.drawImage(video,0,0,context.width,context.height);
      socket.emit('stream',canvas.toDataURL('image/webp'));
      }
  const handleCapture = () => {  
    let canvas = document.getElementById('preview')
    let context = canvas.getContext('2d')
    let video = document.getElementById('video')

      canvas.width = 900 
      canvas.height = 700 
      context.width = canvas.width
      context.height = canvas.height

      navigator.getUserMedia = ( navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msgGetUserMedia ); 
        if(navigator.getUserMedia){
            navigator.mediaDevices.getDisplayMedia(
             {
               video: {
                 displaySurface: "window",
               },
               audio: false,
             }
           )
           .then(stream => {
             loadCamera(stream , video)
             setInterval(function(){
              viewVideo(video,context,canvas);
            },4.5);
           })
           .catch(error => {
             logger(error)
           });
        }
    }
  const handleStreaming =  () => {
    let canvas = document.getElementById('preview')
    let context = canvas.getContext('2d')
    let video = document.getElementById('video')

      canvas.width = 900 
      canvas.height = 700 
      context.width = canvas.width
      context.height = canvas.height

      navigator.getUserMedia = ( navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msgGetUserMedia ); 

    if(navigator.getUserMedia){
        // navigator.getUserMedia({video: true, audio: true},loadCamera,loadFail);
        navigator.mediaDevices.getUserMedia({ video: true , audio: true })
        .then(stream => {
          // Aquí puedes usar el stream de video
           loadCamera(stream , video)
          })
        .catch(error => {
            logger(error)
          });
        }
        setInterval(function(){
          viewVideo(video,context,canvas);
        },4.5);
      
  }
  return ( 
    <>
      <h1>Chat Vibe</h1>
      <img src="" alt="Directo" id='lienzo' />
      <ul>
        {
          messages.length >= 2
          ? messages.map((item, i) => {
             return !item.body
             ? null
             :<li key={i}>from: {item.from} {item.body}</li>

          })
          :'No hay mensajes'
        }
      </ul>
      <form onSubmit={sendMessage}>
        <input placeholder='Ingresa el mensaje...' onChange={e => setMessage(e.target.value)} />
      </form>

      <div className="">
        <div id='status'></div>
        <video src="" id="video" autoPlay={true} ></video>
        <canvas id='preview' style={{display:'none'}}></canvas>
        <button id='btn-streaming' onClick={handleStreaming}>Transmitir</button>
        <button onClick={handleCapture}>Transmitir Pantalla</button>
        <button id='btn-streaming-stop' onClick={stopStream}>Parar</button>

      </div>
    </>
  )
}

export default App
