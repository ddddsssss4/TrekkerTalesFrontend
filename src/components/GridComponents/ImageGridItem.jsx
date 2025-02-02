
import PropTypes from 'prop-types';
 
const ImageGridItem = ({src,alt}) => {

    return (
      <div className='w-60 h-60'>
        <img src={src} className="w-full h-full object-cover" alt={alt} />

      </div>
    )
}
ImageGridItem.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ImageGridItem
