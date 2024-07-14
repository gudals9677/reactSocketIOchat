import { useState, useEffect } from 'react'
import './App.css'

// ES modules
import { io } from "socket.io-client";

function App() {
  //const [count, setCount] = useState(0);

  const [isConnected, setIsConnected] = useState(false);

  const [messages, setMessages] = useState([]);

  const [username, setUsername] = useState('');

  const [userInput, setUserInput] = useState('');

  const [socket, setSocket] = useState(null);

  function connectToChatServer() {
    console.log('connected to server!');
    const _socket = io('http://localhost:3000', {
      autoConnect: false,
      query: {
        username: username,
      }
    });
    _socket.connect();
    setSocket(_socket); 
  }

  function disconnectToChatServer() {
    console.log('disconnected to server!');
    socket?.disconnect(); //socket이 있다면 disconnect
  }

  function onConnected() {
    console.log('프론트 - onConnected!');
    setIsConnected(true);
  }

  function onDisconnected() {
    console.log('프론트 - onDisconnected!');
    setIsConnected(false);
  }

  function onMessageRecevied(msg) {
    console.log('프론트 - onMessageRecevied!');
    console.log(msg);

    setMessages(previous => [...previous, msg]);
  }

  function sendMessageToChatServer() {
    console.log(`프론트 - onDisconnected! input: ${userInput}`);
    socket?.emit("new message", {username: username, message: userInput }, (response) => {
      console.log(response);
    });
  }

  useEffect(() => {
    console.log('useEffect 스크롤 올리기!');
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth"
    })
  }, [messages]);

  useEffect(() => {
    console.log('useEffect called!');
    socket?.on('connect', onConnected);
    socket?.on('disconnect', onDisconnected);

    socket?.on('new message', onMessageRecevied);

    return () => {
      console.log('useEffect clean up called!');
      socket?.off('connect', onConnected);
      socket?.off('disconnect', onDisconnected);
      socket?.off('disconnect', onDisconnected);
      socket?.off('new message', onMessageRecevied);
    };
  }, [socket]);

  const messageList = messages.map((aMsg, index) => 
    <li key={index}>
      {aMsg.username} : {aMsg.message}
    </li>
  );

  return (
    <>
      <div className='Navbar'>
        <h1>유저: {username}</h1>
        <h2>현재 접속상태: {isConnected ? "접속중" : "미접속"}</h2>
        <div className='Card'>
            <input value={username} onChange={e => setUsername(e.target.value)}/>
            {!isConnected && (
            <button onClick={() => connectToChatServer()}>
              접속
            </button>
            )}
            {isConnected && (
            <button onClick={() => disconnectToChatServer()}>
              접속종료
            </button>
            )}
        </div>
      </div>

      <u className='ChatList'>
          {messageList}
      </u>

      <form className='MessageInput' onSubmit={event => {
             event.preventDefault();  // 페이지 리로드 방지
            sendMessageToChatServer();
      }}>
            <input value={userInput} onChange={e => setUserInput(e.target.value)}/>
            <button type="submit">
                보내기
            </button>
      </form>

        
    </>
  )
}

export default App
