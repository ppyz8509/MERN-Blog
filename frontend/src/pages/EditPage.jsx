import {useEffect , useState} from 'first';
import { useParams, Navigate } from 'react-router-dom';
import Editor  from '../components/Editor';
const EditPage = () => {
  const {id} = useParams
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    fetch(`${baseURL}/post/${id}`).
      then((response) => {
        response.json().then((posts) => {
          setPosts(posts);
        });
      });
  })


  if(redirect) {
     return <Navigate/>
  }
  return (
    <form >
            <input type="text" name="title" placeholder='title'/>
            <input type="text" name="summary" placeholder='summary' />
            <input type="file" name="file" id="file" />
            <Editor />
            <button>Create post </button>
        </form>
  )
}

export default EditPage