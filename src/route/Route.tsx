import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/login/Login'
import Home from '../pages/Home'
import App from '../App'
import Profil from '../pages/profil/Profil'

export const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />
    }, 
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/home",
        element: <Home />
    },
    { 
        path: "/profil",
        element: <Profil />
    }
])