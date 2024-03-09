import React from 'react'

const Recieverfile = ({data}) => {
    const getTime = () => {
        const date = new Date(data.createDate)
        return date.getHours()+":"+date.getMinutes()
      }
  return (
    <div className='image-file-recieve'>
        <div className='inner'>
            <img src={data.fileUrl}/>
            <p>{getTime()}</p>
        </div>
        
    </div>
    
  )
}

export default Recieverfile
