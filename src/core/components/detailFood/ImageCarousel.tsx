import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageCarousel = ({ images }: any) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: any) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="mb-md-4 mb-3">
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {images.map((img:any, idx:any) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={img}
              alt={`Imagen ${idx + 1}`}
              style={{ 
                maxHeight: '500px',
                objectFit: 'cover'
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;