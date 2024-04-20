import { GlobalContext } from './Global'
import Background from './components/Background'
import ChatBox from './components/ChatBox'
import ConnectionBanner from './components/ConnectionBanner'
import LeftMenu from './components/LeftMenu'
import viteLogo from '/vite.svg'



function App() {

  return (
    <Background>
      <div className='flex w-full h-full relative'>

        { /*connection banner*/}
        <div className='w-full absolute z-10 top-0 left-0 backdrop-blur-md shadow-lg '>
          <ConnectionBanner></ConnectionBanner>
        </div>


        { /*application*/}
        <div className='flex w-full h-full overflow-auto'>
          <div className='hidden md:block'>
            <LeftMenu/>
          </div>
          <div className='flex grow w-0'>
            <ChatBox/>
          </div>
        </div>
      </div>
    </Background>
  )
}

export default App
