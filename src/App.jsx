
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Box } from '@chakra-ui/react'
import Login from './pages/login/Login'
import { ToasterContainer } from './components/toaster'
import Maincontent from './layout/mainContent'
// import Maincontent from './layout/mainContent'

function App() {

  return (
    <>
      <Box h={"100%"}>
        <ToasterContainer />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/*' element={<Maincontent/>} />
          </Routes>
        </BrowserRouter>
      </Box>
    </>
  )
}

export default App
