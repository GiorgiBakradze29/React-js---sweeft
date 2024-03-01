// src/components/HistoryPage.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import config from "../config.js";
import "./HistoryPage.css";
import ImageModal from "./ImageModal";
import "./ImageModal.css";

interface Image {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  likes: number;
  alt: string; // Add the missing 'alt' property
}

const HistoryPage: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [selectedQueryImages, setSelectedQueryImages] = useState<Image[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const isFetching = useRef<boolean>(false);

  // Function to fetch images for a given query
  const fetchImages = async (currentPage: number) => {
    if (isFetching.current) return;

    isFetching.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = `https://api.unsplash.com/search/photos?page=${currentPage}&client_id=${config.unsplashApiKey}&query=${selectedQuery}&per_page=20`;
      const response = await axios.get(apiUrl);

      const fetchedImages: Image[] = response.data.results;

      // If it's the first page, reset images
      if (currentPage === 1) {
        setSelectedQueryImages(fetchedImages);
      } else {
        setSelectedQueryImages((prevImages) => [
          ...prevImages,
          ...fetchedImages,
        ]);
      }

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError(error);
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    // Retrieve search history from local storage
    const historyFromStorage = localStorage.getItem("searchHistory");
    if (historyFromStorage) {
      setSearchHistory(JSON.parse(historyFromStorage));
    }
  }, []);

  useEffect(() => {
    if (selectedQuery && page === 1) {
      // Fetch only the first page initially
      fetchImages(page);
    }
  }, [selectedQuery, page]);

  const handleImageClick = (image: Image) => {
    setIsModalOpen(true);
    setSelectedImage(image);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleSearchClick = (query: string) => {
    setSelectedQuery(query);
    setPage(1); // Reset page when a new search is performed
    setSelectedQueryImages([]); // Reset images state
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 10 &&
      !isLoading
    ) {
      fetchImages(page);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, page]);

  return (
    <div>
      <h2>Search History</h2>
      <div className="button-container">
        {searchHistory.map((query, index) => (
          <button
            key={index}
            className="history-button"
            onClick={() => handleSearchClick(query)}
          >
            {query}
          </button>
        ))}
      </div>

      <h2>Images for Selected Query: {selectedQuery}</h2>
      <div className="container">
        {selectedQueryImages.map((image, index) => (
          <Card
            key={`${image.id}-${index}`}
            image={image}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        image={selectedImage}
      />
    </div>
  );
};

export default HistoryPage;
