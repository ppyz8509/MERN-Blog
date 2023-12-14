import {useContext, useState} from 'react'
import { Navigate } from 'react-router-dom'
import {UserContext} from "../context/UserContext"



const LoginPage = () => {
const [username, setUsername] = useState("")
const [password, setPassword] = useState("")
const [redirect , setRedurect] = useState(false)
const {setUserInfo} = UserContext(UserContext)
const login = async  (e) => {
  e.prevenDefault();
  const response = await fetch(`${baseURL}/login`,{
    method: "POST",
    body: JSON.stringify({ username,password }),
    headers: {"Content-Type": "application/jon"},
    credentials:"include"
  })
  if (response.ok) {
    response.json().then((userInfo) => {
      setUserInfo(userInfo);
      setRedirect(true);
    })
  }else {
    alert ("wrong Creadentials !")
  }
}  
if (redirect) {
   return <Navigate to={"/"}/>
}

return (
    <form className='login'onSubmit={login}>
        <h1>Login</h1>
    <input type="text" name="username"
     placeholder='username'onChange={(e) => setUsername(e.target.value)} />
    <input type="password" 
    name='password' 
    placeholder='password'onChange={(e) => setPassword(e.target.value)} />
    <button>Login</button>
    </form>
    
  )
}

export default LoginPage