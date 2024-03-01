// src/components/Main.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../config";
import Card from "./Card";
import SearchBar from "./SearchBar";
import "./MainPage.css";
import ImageModal from "./ImageModal";

interface Image {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  likes: number;
  alt: string; // Add the missing 'alt' property
}

const MainPage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const isMounted = useRef<boolean>(true);
  const isFetching = useRef<boolean>(false);

  const fetchImages = async (currentPage: number) => {
    if (isFetching.current) return;

    isFetching.current = true;

    setIsLoading(true);
    setError(null);

    try {
      let apiUrl;

      if (searchQuery) {
        apiUrl = `https://api.unsplash.com/search/photos?page=${currentPage}&client_id=${config.unsplashApiKey}&query=${searchQuery}&per_page=20`;
      } else {
        apiUrl = `https://api.unsplash.com/photos?page=${currentPage}&client_id=${config.unsplashApiKey}&order_by=popularity&per_page=20`;
      }

      const response = await axios.get(apiUrl);

      // Check if the response contains a 'results' property (indicating a search query)
      const fetchedImages = searchQuery ? response.data.results : response.data;

      // If it's the first page, reset images
      if (currentPage === 1) {
        setImages(fetchedImages);
        // Store data in local storage
        localStorage.setItem(searchQuery, JSON.stringify(fetchedImages));

        // Update search history in local storage
        const searchHistory =
          JSON.parse(localStorage.getItem("searchHistory")) || [];
        if (!searchHistory.includes(searchQuery)) {
          localStorage.setItem(
            "searchHistory",
            JSON.stringify([...searchHistory, searchQuery])
          );
        }
      } else {
        // Append new data to existing images
        setImages((prevImages) => [...prevImages, ...fetchedImages]);
        // Update local storage with the new data
        const cachedData = JSON.parse(localStorage.getItem(searchQuery)) || [];
        localStorage.setItem(
          searchQuery,
          JSON.stringify([...cachedData, ...fetchedImages])
        );
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
    if (isMounted.current) {
      // Retrieve data from local storage
      const cachedData = localStorage.getItem(searchQuery);
      if (cachedData) {
        setImages(JSON.parse(cachedData));
      } else {
        fetchImages(page);
      }
      isMounted.current = false;
    }
  }, [isMounted, searchQuery, page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 10 &&
      !isLoading
    ) {
      fetchImages(page);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setImages([]); // Reset images state
  };

  const handleImageClick = (image: Image) => {
    setIsModalOpen(true);
    setSelectedImage(image);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    // Fetch images after resetting the state
    fetchImages(1);
  }, [searchQuery]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, page]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="container">
        {images.map((image, index) => (
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

export default MainPage;
