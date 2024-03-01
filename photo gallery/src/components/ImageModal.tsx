import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import "./ImageModal.css";

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

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, image }) => {
  const [stats, setStats] = useState<ImageStats | null>(null);

  const fetchImageStats = async (
    photoId: string
  ): Promise<ImageStats | null> => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/${photoId}/statistics?client_id=${config.unsplashApiKey}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching image stats:", error);
      return null;
    }
  };

  useEffect(() => {
    const getImageStats = async () => {
      if (image) {
        const stats = await fetchImageStats(image.id);
        setStats(stats);
      }
    };

    getImageStats();
  }, [image]);

  if (!isOpen || !image) {
    return null;
  }

  const { urls, alt, likes } = image;

  // Check if stats are available
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
