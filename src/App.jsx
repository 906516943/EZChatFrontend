import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ChatBox from './components/ChatBox/ChatBox'




function App() {

  const [mQueue, setmQueue] = useState([{id: Date.now(), user: "User1", text: "Hello world", date: new Date()}])

  const handleTextEntered = (x) => { 

    setmQueue(mQueue.concat({id: Date.now(), user: "User2", text: x, date: new Date()}))
  }


  return (
    <div className='size-full'>
      <ChatBox msgQueue={mQueue} user={"User2"} newMsg={ handleTextEntered}></ChatBox>
    </div>
  )
}

export default App
