import React from 'react'
import Editor  from '../components/Editor'
const EditPage = () => {
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