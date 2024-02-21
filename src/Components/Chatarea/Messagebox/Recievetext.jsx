import React from 'react'

const Recievetext = ({data}) => {
  return (
    <div className='recieve-msg'>
        <div className="text-box">
            <p className='text'>{data.message}</p>
        </div>
    </div>
  )
}

export default Recievetext
