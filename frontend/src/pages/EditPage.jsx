import {useEffect , useState} from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Editor  from '../components/Editor';


const EditPage = () => {
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);
  
  useEffect(()=>{
    fetch(`${baseURL}/post/${id}`).then((response) =>{
      response.json().then((postInfo) =>{
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      })
    })
  }, [id]);
  const updatePost = async (e) => {
      e.preventDefault()
      const data = new FormData();
      data.set("title", title)
      data.set("summary", summary)
      data.set("content", content)
      data.set("id", id)
      if(files?.[0]) {
          data.set("file", files[0]);
      }
      const response = await fetch(`${baseURL}/post`,{
          method:"PUT",
          body:data,
          credentials:"include"
      });
      if (response.ok){
          setRedirect(true);
      }
      
  }
  if(redirect){
      return <Navigate to={"/"}/>
  }
  return (
      <form onSubmit={updatePost} >
          <input type="text" name="title" value={title} placeholder='title' onChange={(e)=>setTitle(e.target.value)}/>
          <input type="text" name="summary" value={summary} placeholder='summary'  onChange={(e)=>setSummary(e.target.value)} />
          <input type="file" name="file" id="file" onChange={(e)=>setFile(e.target.value)} />
          <Editor onChange={setContent} value={content}/>
          <button>Update post </button>
      </form>
)
}

export default EditPage