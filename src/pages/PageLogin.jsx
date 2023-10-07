import React, { useContext } from 'react'
import Login from '../components/login/Login'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'


const PageLogin = () => {
  let { user } = useContext(AuthContext)


  return (
    !user ?
      <div className='main'>
        <div className='login'>
          <Login />
        </div>
      </div>
      : <Navigate to='/main' />
  )
}

export default PageLogin