import React,{useContext} from 'react';
import { UseContext,useEffect } from 'react';
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
const baseURL = import.meta.env.VITE_BASE_URL;



const Header = () => {
  const {setUserInfo, userInfo} = useContext(UserContext);
  const username = userInfo?.username;
  const logout = () => {
    fetch(`${baseURL}/logout`,{
      credentials: "include",
      method:"POST",
    });
    setUserInfo(null);
  }
  return (
    <header>
        <Link to={"/"} className='logo'>
            SE NPRU blog
        </Link>
        <nav>
          {username && (
            <>
            <Link to={"/create"}>Create new post</Link> 
            <a onClick={logout}>Logout ({username})</a>
            </>
          )}
          {!username && (
            <>
            <Link to={"/login"}>Login</Link> 
            <Link to={"/register"}>Register</Link>
            </>
          )}
        </nav>
    </header>
  )
}

export default Header