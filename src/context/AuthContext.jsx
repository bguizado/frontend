import { createContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [superUser, setSuperUser] = useState(useState(() => (localStorage.getItem('superUser') ? JSON.parse(localStorage.getItem('superUser')) : false)))

    const navigate = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault()
        const response = await fetch('http://127.0.0.1:8000/proyecto/token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo: e.target.correo.value, password: e.target.password.value })
        });

        let data = await response.json()


        if (data) {
            localStorage.setItem('authTokens', JSON.stringify(data));
          
            setAuthTokens(data)
            let decodeJWT = jwtDecode(data.access)
            setUser(decodeJWT)
            setSuperUser(decodeJWT.is_superuser)
            localStorage.setItem('superUser', decodeJWT.is_superuser);

            // if (decodeJWT.is_superuser === true) {
            //     navigate('/main')
            // } else {
            //     alert('No tienes permisos de superusuario para esta acción');
            // }

        } else {
            alert('!Algo salió mal al iniciar sesión en el usuario¡')
        }
    }

    let logoutUser = (e) => {
        // e.preventDefault()
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/login')
        localStorage.removeItem('superUser')
    }

    const updateToken = async () => {

        const response = await fetch('http://127.0.0.1:8000/proyecto/token/refresh', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: authTokens?.refresh })
        })

        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        superUser: superUser
    }

    useEffect(() => {

        const REFRESH_INTERVAL = 1000 * 60 * 1 // 1 minutoS
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    }, [authTokens])


    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}