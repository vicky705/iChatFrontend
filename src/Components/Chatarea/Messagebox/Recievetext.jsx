import React from 'react'

const Recievetext = ({data}) => {
  const getTime = () => {
    const date = new Date(data.createDate)
    return date.getHours()+":"+date.getMinutes()
  }
  return (
    <div className='recieve-msg'>
        <div className="text-box">
            <p className='text'>{data.message}</p>
            <p className='date'>{getTime()}</p>
        </div>
    </div>
  )
}

export default Recievetext
