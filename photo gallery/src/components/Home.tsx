import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import config from "../config";
import Card from "./Card";
import SearchBar from "./SearchBar";
import "./HomePage.css";
import ImageModal from "./ImageModal";
import { useSearchContext } from "./SearchContext";

interface Image {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  likes: number;
  alt: string;
}

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const { addToSearchHistory } = useSearchContext();

  const fetchImages = async ({ pageParam = 1 }) => {
    const apiUrl = searchQuery
      ? `https://api.unsplash.com/search/photos?page=${pageParam}&client_id=${config.unsplashApiKey}&query=${searchQuery}&per_page=20`
      : `https://api.unsplash.com/photos?page=${pageParam}&client_id=${config.unsplashApiKey}&order_by=popularity&per_page=20`;

    const response = await axios.get(apiUrl);

    return searchQuery ? response.data.results : response.data;
  };

  const {
    data: images,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery(["images", searchQuery], fetchImages, {
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1;
    },
  });

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    addToSearchHistory(query);
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
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching, hasNextPage, fetchNextPage]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
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
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        image={selectedImage}
      />
    </div>
  );
};

export default HomePage;
