import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import Card from "./Card";
import { useInfiniteQuery } from "react-query";
import { useSearchContext } from "./SearchContext";
import "./Styles/HistoryPage.css";
import ImageModal from "./ImageModal";

interface Image {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  likes: number;
  alt: string;
}

const HistoryPage: React.FC = () => {
  const { searchHistory } = useSearchContext();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const fetchImages = async ({ pageParam = 1 }) => {
    if (selectedWord) {
      const apiUrl = `https://api.unsplash.com/search/photos?page=${pageParam}&client_id=${config.unsplashApiKey}&query=${selectedWord}&per_page=20`;
      const response = await axios.get(apiUrl);
      return response.data.results;
    }
    return [];
  };

  const {
    data: images,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery(["images", selectedWord], fetchImages, {
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1;
    },
  });

  const handleButtonClick = (word: string) => {
    if (word !== selectedWord) {
      setSelectedWord(word);
      fetchNextPage();
    }
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
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 10 &&
        !isFetching &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, isFetching, hasNextPage]);

  return (
    <div>
      <h2>Search History:</h2>
      <div className="button-container">
        {searchHistory.map((word, index) => (
          <button
            className="history-button"
            key={index}
            onClick={() => handleButtonClick(word)}
          >
            {word}
          </button>
        ))}
      </div>
      <div className="container">
        {images?.pages.map((page, pageIndex) =>
          page.map((image: Image, index: number) => (
            <Card
              key={`${image.id}-${index}-${pageIndex}`}
              image={image}
              onClick={() => handleImageClick(image)}
            />
          ))
        )}
      </div>
      {isFetching && <div>Loading more...</div>}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        image={selectedImage}
      />
    </div>
  );
};

export default HistoryPage;
