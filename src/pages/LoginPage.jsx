import React from 'react'

const LoginPage = () => {
  return (
    <form className='login'>
        <h1>Login</h1>
    <input type="text" name="username"
     placeholder='username' />
    <input type="password" 
    name='password' 
    placeholder='password' />
    <button>Login</button>
    </form>
    
  )
}

export default LoginPage