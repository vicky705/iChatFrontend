import React from 'react'

const Sendtext = ({data}) => {
  return (
    <div className='send-msg'>
      <div className='text-box'>
        <p className='text'>{data.message}</p>
      </div>
    </div>
  )
}

export default Sendtext
