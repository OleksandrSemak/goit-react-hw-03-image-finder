import React, { Component } from "react";
import axios from "axios";

import Loader from "react-loader-spinner";
import Notiflix from "notiflix";

import Searchbar from "../Searchbar/Searchbar";
import ImageGallery from "../ImageGallery/ImageGallery";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

import "./App.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends Component {
  state = {
    images: [],
    currentImage: {},
    queryString: "",
    isLoaded: true,
    isModalOpened: false,
  };

  fetchImages = (requestedImages, updatedPageNumber) => {
    const apiKey = "22716086-2fdd68696acd66b897a29f84e";
    const url = `https://pixabay.com/api/?q=${requestedImages}&page=${updatedPageNumber}&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=12`;

    if (requestedImages) {
      this.setState({ isLoaded: false });

      axios
        .get(url)
        .then(({ data }) =>
          this.setState(({ queryString, images }) => {
            const imagesArray = data.hits;

            const sameRequest = requestedImages === queryString;

            let updatedImagesArray = [];

            if (sameRequest) {
              updatedImagesArray = images.concat(imagesArray);
            } else {
              updatedImagesArray = imagesArray;
            }

            return {
              images: updatedImagesArray,
              queryString: requestedImages,
              isLoaded: true,
            };
          })
        )
        .catch((error) => Notiflix.Notify.failure(error.message));
    }
  };

  loadMoreImages = (updatedPageNumber) => {
    const { queryString } = this.state;

    this.fetchImages(queryString, updatedPageNumber);

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  handleOpenModal = (imageId) => {
    const { images } = this.state;

    const currentImage = images.find(({ id }) => id === imageId);

    this.setState({ currentImage, isModalOpened: true });

    window.addEventListener("keydown", this.escClickListener);
  };

  escClickListener = (e) => {
    if (e.key === "Escape") {
      this.handleCLoseModal();
    }
  };

  handleCLoseModal = () => {
    this.setState({ currentImage: {}, isModalOpened: false });

    window.removeEventListener("keydown", this.escClickListener);
  };

  resetImagesArray = () => {
    this.setState({ images: [] });
  };

  render() {
    const {
      fetchImages,
      loadMoreImages,
      handleOpenModal,
      handleCLoseModal,
      resetImagesArray,
      state,
    } = this;
    const { images, isLoaded, isModalOpened, currentImage, queryString } =
      state;
    const { largeImageURL, tags } = currentImage;

    const isButtonVisible = images.length > 0;

    return (
      <>
        <Searchbar
          fetchImages={fetchImages}
          queryString={queryString}
          resetImagesArray={resetImagesArray}
        />

        <Loader
          type="TailSpin"
          color="#00BFFF"
          height={80}
          width={80}
          visible={!isLoaded}
        />

        {isLoaded && (
          <ImageGallery images={images} handleOpenModal={handleOpenModal} />
        )}

        {isButtonVisible && <Button loadMoreImages={loadMoreImages} />}

        {isModalOpened && (
          <Modal
            largeImageURL={largeImageURL}
            tags={tags}
            handleCLoseModal={handleCLoseModal}
          />
        )}
      </>
    );
  }
}

export default App;