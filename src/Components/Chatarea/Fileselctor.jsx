import React, { useRef, useState } from 'react'

const Fileselctor = ({setIsFileSelector, isFile, setIsFile, onSumbitMessageHandeler}) => {
    const fileInputBox = useRef()
    const [fileUrl, setFileUrl] = useState('')

    const onClickOpenFileSelector = () => {
        fileInputBox.current.click()
    }
    const onChangeFile = (event) => {
        const file = event.target.files[0]
        setIsFile(file)
        const reader = new FileReader();
        reader.onloadend = () => {
            setFileUrl(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const onClickClose = () => {
        setIsFileSelector(false)
        setIsFile('')
        setFileUrl('')
    }

    
  return (
    <div className='file-selector'>
        <i class="fa-solid fa-circle-xmark" onClick={() => onClickClose()}></i>
        <div className='select'>
            {
                fileUrl ? <img src={fileUrl} className='selected-img'/>
                :
                <i class="fa-solid fa-plus" onClick={() => onClickOpenFileSelector()}></i>
            }
        </div>
        <form onSubmit={e => onSumbitMessageHandeler(e)}>
            <input ref={fileInputBox} type='file' name='file' className='d-none' onChange={e => onChangeFile(e)}/>
            <button type='submit' name='file' className='send-btn'>send</button>
        </form>
    </div>
  )
}

export default Fileselctor
