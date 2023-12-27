import {useState} from 'react'
const baseURL = import.meta.env.VITE_BASE_URL;
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const register = async (e) =>{
    e.preventDefault();
    const response = await fetch(`${baseURL}/register`,{
      method:"POST",
      body: JSON.stringify({username, password}),
      headers: { 'Content-Type': 'application/json' }
    });
    if(response.status === 200){
      alert("Register Succ !!")
    }
    else{
      alert("Register Failed !!")
    }
  };
  return (
    <form className='register' onSubmit={register}>
        <h1>Register</h1>
    <input 
    type="text" 
    name="username" 
    placeholder='username' 
    onChange={(e) => setUsername(e.target.value)} />
    <input 
    type="password" 
    name='password' 
    placeholder='password' 
    onChange={(e) => setPassword(e.target.value)} />
    <button>submit</button>
    </form>
  )
}

export default RegisterPage