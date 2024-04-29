import { useEffect, useState } from 'react'
import { GlobalContext, VIEW_LANDING_PAGE, VIEW_CHAT, VIEW_CHANNEL_INFO } from './Global'
import Background from './components/Background'
import ChatBox from './components/ChatBox'
import ConnectionBanner from './components/ConnectionBanner'
import LeftMenu from './components/LeftMenu'
import StackableLayout from './components/StackableLayout'
import viteLogo from '/vite.svg'
import MessageSaveService from './serviceComponents/MessageSaveService'



function App() {

  const [stack, setStack] = useState(false);
  const [view, setView] = useState(GlobalContext.currentView.Get());

  useEffect(() => { 
    //listen size change event

    const resizeEvent = (e) => { 
      
      const h = window.innerHeight;
      const w = window.innerWidth;

      //breakpoint xs
      if (w < 768) {
        setStack(true);
      } else { 
        setStack(false);
      }

    }

    const viewId = GlobalContext.currentView.Subscribe(() => { 
      console.log(GlobalContext.currentView.Get());
      setView(GlobalContext.currentView.Get());
    })
    
    
    addEventListener('resize', resizeEvent);
    resizeEvent(null);

    return () => { 
      removeEventListener('resize', resizeEvent);
      GlobalContext.currentView.Unsubscribe(viewId);
    }
  }, [])

  return (
    <Background>
      <div className='w-full h-full relative'>

        { /*services*/}
        <MessageSaveService></MessageSaveService>

        { /*connection banner*/}
        <div className='w-full absolute z-10 top-0 left-0 backdrop-blur-md shadow-lg '>
          <ConnectionBanner></ConnectionBanner>
        </div>


        { /*application*/}
        <div className='w-full h-full overflow-auto'>
          <StackableLayout layer0={<LeftMenu />} layer1={<ChatBox />} stack={stack} showBottom={view == VIEW_LANDING_PAGE} layer1Class={"grow" } />
        </div>

      </div>
    </Background>
  )
}

export default App
