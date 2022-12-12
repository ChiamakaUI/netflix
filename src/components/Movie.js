import React, { useState, useContext, useEffect } from "react";
import { BsPlayCircle, BsPlusCircle } from "react-icons/bs";
import { TfiArrowCircleDown } from "react-icons/tfi";
import { SlLike } from "react-icons/sl";
import Modal from "./Modal";
import { AiFillLike } from "react-icons/ai";
import { currentUserContext } from "../App";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase";
import axios from "axios";
// import Tooltip from "./Tooltip";
import ReactTooltip from "react-tooltip";

const Movie = ({ item }) => {
  const [isShown, setIsShown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [like, setLike] = useState(false);
  const { currentUser } = useContext(currentUserContext);
  const [trailer, setTrailer] = useState("");

  useEffect(() => {
    const getTrailer = async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/${item?.media_type === "tv" ? "tv" : "movie"
        }/${item?.id}?api_key=${process.env.REACT_APP_IMDB_API_KEY
        }&language=en-US&append_to_response=videos`
      );
      const data = await res.data;
      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element) => element.type === "Trailer"
        );
        setTrailer(data.videos?.results[index]?.key);
      }
    };
    getTrailer();
  }, [item]);

  const closeModal = () => {
    setShowModal(false);
  };
  const likeMovie = async () => {
    if (Object.keys(currentUser).length === 0) {
      alert("Please, login to like a movie");
      return;
    }
    setLike(!like);
    const movieRef = doc(db, "liked", currentUser?.uid);
    await updateDoc(movieRef, {
      likedShows: arrayUnion({
        id: item.id,
        title: item.title,
        img: item.backdrop_path,
      }),
    });
  };

  const saveMovie = async () => {
    if (Object.keys(currentUser).length === 0) {
      alert("Please, login to save a movie");
      return;
    }
    const movieRef = doc(db, "saved", currentUser?.uid);
    await updateDoc(movieRef, {
      savedShows: arrayUnion({
        id: item.id,
        title: item.title,
        img: item.backdrop_path,
      }),
    });
  };

  const playMovie = () => {
    if (!trailer) {
      return;
    }
    window.location.href = `https://www.youtube.com/watch?v=${trailer}`;
  };
  return (
    //hover:h-[250px] hover:w-[350px] hover:z-50
    <div
      className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2 hover:h-[300px] hover:scale-150 hover:z-50 shadow-2xl transition duration-700 ease-in-out"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <img
        className={`w-full h-auto block  ${isShown ? "rounded-t-lg" : "rounded-lg"
          }`}
        src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
        alt={item?.title}
      />

      {isShown && (
        <div className="w-full bg-[#181818] rounded-b-lg">
          <p className="text-sm text-white ml-2">{item?.title}</p>
          <div className="h-[95px] flex flex-row justify-between items-center w-[94%] mx-auto">
            <div className="flex flex-row justify-between items-center w-[40%]">
              <BsPlayCircle
                className="text-2xl text-gray-50"
                onClick={playMovie}
              />
              <div>
                <BsPlusCircle
                  className="text-2xl text-gray-50"
                  onClick={saveMovie}
                  data-tip
                  data-for="saveShow"
                />
                <ReactTooltip id="saveShow" place="top" effect="solid">
                  Add to my List
                </ReactTooltip>
              </div>

              {like ? (
                <AiFillLike
                  className="text-2xl text-gray-50"
                  onClick={() => setLike(!like)}
                />
              ) : (
                <div>
                  <SlLike
                    className="text-2xl text-gray-50"
                    onClick={likeMovie}
                    data-tip
                    data-for="likeShow"
                  />
                  <ReactTooltip id="likeShow" place="top" effect="solid">
                    I like this
                  </ReactTooltip>
                </div>
              )}
            </div>
            <div>
              <TfiArrowCircleDown
                data-tip
                data-for="moreInfo"
                className="text-2xl text-gray-50"
                onClick={() => setShowModal(true)}
              />
              <ReactTooltip id="moreInfo" place="top" effect="solid">
                More Info
              </ReactTooltip>
            </div>
          </div>
        </div>
      )}
      {showModal && <Modal movie={item} closeFunc={closeModal} />}
    </div>
  );
};

export default Movie;
