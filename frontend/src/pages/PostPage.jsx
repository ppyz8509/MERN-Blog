import {useState, useContext, useEffect} from 'react'
import { UserContext } from '../context/UserContext';
import {format} from "date-fns"
import { Navigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const baseURL = import.meta.env.VITE_BASE_U

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const {id} = useParams();
  useEffect(()=>{
    fetch(`${baseURL}/post/${id}`).then((response) =>{
      response.json().then((postInfo) =>{
        setPostInfo(postInfo);
      })
    })
  }, [id]);

  const handleDelete = (event) => {
    console.log(id)
    fetch(`${baseURL}/post/${id}`,{
      method:"DELETE"
    }).then((response) => {
      if(response.ok){
        
        return <Navigate to={"/"}/>
      }

      console.log(response.json);

    })
}

  if (!postInfo) return"";
  return (
    <div className='post-page'>
        <h1> {postInfo.title}</h1>

        <time> {format(new Date(postInfo.createdAt), 'dd MMMM yyyy HH:MM') }</time>

        <div href="" className='author'>{postInfo.author.username}</div>
      {userInfo?.id === postInfo.author._id && (
        <div className="edit-row">
          <Link to={`/edit/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>

          edit post</Link>

          
      <button
      className="btn grey"
       onClick={handleDelete} 
      >
      Delete Post
      </button>
        </div>

        
      )}


        <div className="image">
        <img src={`${baseURL}/${postInfo.cover}`} alt="" />
        </div>

        <div className="content" dangerouslySetInnerHTML={{__html: postInfo.content}}>
               
        </div>
    </div>
  )
}

export default PostPage