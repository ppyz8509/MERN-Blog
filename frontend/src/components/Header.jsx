import { useContext ,useEffect} from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
const baseURL = import.meta.env.VITE_BASE_URL;



const Header = () => {
  const {setUserInfo, userInfo} = useContext(UserContext);
  const username = userInfo?.username;
  return (
    <header>
        <Link to={"/"} className="logo">
            SE NPRU blog
        </Link>
        <nav>
          {username && (
            <>
             <Link to="/create">Create new Post</Link>
            <a onClick={logout}>Logout({username})</a>
            </>
          )}
            <Link to ={"/login"}>Login</Link>
            <Link to ={"/register"}>Register</Link>

        </nav>
    </header>
  )
}

export default Header