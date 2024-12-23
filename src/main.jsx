import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ChakraProvider} from '@chakra-ui/react'
import Customtheme from './components/theme.jsx'
import { Provider } from 'react-redux'
import { store } from '../app/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ChakraProvider theme = {Customtheme}>
    <App />
    </ChakraProvider>
    </Provider>
   
  </StrictMode>,
)
