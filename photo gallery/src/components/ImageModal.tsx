import React, { useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import config from "../config";
import "./Styles/ImageModal.css";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    id: string;
    urls: {
      small: string;
    };
    alt: string;
    likes: number;
  } | null;
}

interface ImageStats {
  views: {
    total: number;
  };
  downloads: {
    total: number;
  };
}

const fetchImageStats = async (photoId: string) => {
  const response = await axios.get(
    `https://api.unsplash.com/photos/${photoId}/statistics?client_id=${config.unsplashApiKey}`
  );
  return response.data;
};

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, image }) => {
  const { data: stats } = useQuery<ImageStats | null>(
    ["imageStats", image?.id],
    () => fetchImageStats(image!.id),
    {
      enabled: !!image,
    }
  );

  useEffect(() => {}, [stats]);

  if (!isOpen || !image) {
    return null;
  }

  const { urls, alt, likes } = image;

  const views = stats ? stats.views.total : "N/A";
  const downloads = stats ? stats.downloads.total : "N/A";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <img src={urls.small} alt={alt} />
        <div className="image-info">
          <p>Likes: {likes}</p>
          <p>Views: {views}</p>
          <p>Downloads: {downloads}</p>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ImageModal;
