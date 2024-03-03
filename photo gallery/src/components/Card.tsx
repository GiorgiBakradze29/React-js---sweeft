import React from "react";

interface Image {
  urls: {
    small: string;
  };
  alt_description: string;
}

interface CardProps {
  image: Image;
  onClick?: (image: Image) => void;
}

const Card: React.FC<CardProps> = ({ image, onClick }) => {
  const handleImageClick = () => {
    if (onClick) {
      onClick(image);
    }
  };

  return (
    <div className="card" onClick={handleImageClick}>
      <img src={image.urls.small} alt={image.alt_description} />
    </div>
  );
};

export default Card;
