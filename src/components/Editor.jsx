import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

const Editor = (value, onChange) => {

  return (
    <div className='centent'>
        <ReactQuill value={ value} theme='snow'
        modules={modules}/>
    </div>
  )
}

export default Editor