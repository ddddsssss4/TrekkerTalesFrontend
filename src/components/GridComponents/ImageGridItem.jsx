import React from 'react'
 
const ImageGridItem = ({src,alt}) => {

    return (
      <div className='w-60 h-60'>
        <img src={src} className="w-full h-full object-cover" alt="hi" />

      </div>
    )
}
 
export default ImageGridItem