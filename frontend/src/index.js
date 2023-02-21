import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import ChatProvider from './components/context/DataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>   {/*This is a routerDom which is used to shift pages between certain end points*/}
    <ChatProvider>
      <ChakraProvider>  {/*This ChakraProvider is used at the root of your application to ensure the elements are used all along the root and its children. */}
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>,
);