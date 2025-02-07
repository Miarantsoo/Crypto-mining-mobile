import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/login/Login'
import Home from '../pages/Home'
import App from '../App'
import Profil from '../pages/profil/Profil'
import Cours from '../pages/cours/Cours'
import Historique from "../pages/historique/Historique";
import PorteFeuille from "../pages/portefeuille/PorteFeuille";
import Solde from "../pages/solde/Solde";

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
    },
    { 
        path: "/cours",
        element: <Cours />
    },
    {
        path: "/historiques",
        element: <Historique />
    },
    {
        path: "/portefeuille",
        element: <PorteFeuille />
    },
    {
        path: "/demande",
        element: <Solde />
    },
])