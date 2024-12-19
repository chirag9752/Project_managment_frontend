import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './redux/store';

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
    <BrowserRouter>
     <App />
     <Toaster/>
    </BrowserRouter> 
   </Provider>  
)
