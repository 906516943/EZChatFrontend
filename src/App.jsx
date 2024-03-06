import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ChatBox from './components/ChatBox/ChatBox'




function App() {

  const [mQueue, setmQueue] = useState([{ id: Date.now(), user: "User1", msg: {text: "Hello world", imgs: []}, date: new Date()}])

  const handleNewMsg = (x, imgs) => { 

    setmQueue(mQueue.concat({ id: Date.now(), user: "User2", msg: {text: x, imgs: imgs}, date: new Date()}))
  }


  return (
    <div className='size-full'>
      <ChatBox msgQueue={mQueue} user={"User2"} newMsg={ handleNewMsg}></ChatBox>
    </div>
  )
}

export default App
