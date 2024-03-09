import React from 'react'

const Sendfile = ({data}) => {
    const getTime = () => {
        const date = new Date(data.createDate)
        return date.getHours()+":"+date.getMinutes()
      }
  return (
    <div className='image-file-send'>
        <div className='inner'>
            <img src={data.fileUrl}/>
            <p>{getTime()}</p>
        </div>
        
    </div>
  )
}

export default Sendfile
