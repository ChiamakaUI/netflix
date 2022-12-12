import React, { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import ReactPlayer from "react-player/lazy";
import { MdCancel } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { BsFillPlayFill, BsPlusCircle } from "react-icons/bs";
import { SlLike } from "react-icons/sl";
import ReactTooltip from "react-tooltip";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase";
import { currentUserContext } from "../App";
const Modal = ({ movie, closeFunc }) => {
  const [trailer, setTrailer] = useState("");
  const [genres, setGenres] = useState([]);
  const [like, setLike] = useState(false);
  const { currentUser } = useContext(currentUserContext);

  useEffect(() => {
    const getTrailer = async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.REACT_APP_IMDB_API_KEY
        }&language=en-US&append_to_response=videos`
      );
      const data = await res.data;
      console.log(data);
      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element) => element.type === "Trailer"
        );
        setTrailer(data.videos?.results[index]?.key);
      }
      if (data?.genres) {
        setGenres(data.genres);
      }
    };
    getTrailer();
  }, [movie]);
  // console.log(genres);
  const likeMovie = async () => {
    if (Object.keys(currentUser).length === 0) {
      alert("Please, login to like a movie");
      return;
    }
    setLike(!like);
    const movieRef = doc(db, "liked", currentUser?.uid);
    await updateDoc(movieRef, {
      likedShows: arrayUnion({
        id: movie.id,
        title: movie.title,
        img: movie.backdrop_path,
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
        id: movie.id,
        title: movie.title,
        img: movie.backdrop_path,
      }),
    });
  };
  const playMovie = () => {
    if (!trailer) {
      return;
    }
    window.location.href = `https://www.youtube.com/watch?v=${trailer}`;
  };
  return createPortal(
    <div className="fixed z-[1000] top-0 left-0 w-full h-full overflow-y-auto overflow-x-hidden	bg-black-overlay">
      <div className="w-[70%] bg-[#181818] my-[10%] mx-auto shadow-xl h-[1000px] flex flex-col">
        <MdCancel
          className="text-5xl text-white absolute top-28 right-44 cursor-pointer z-[1000]"
          onClick={() => closeFunc()}
        />
        <div className="w-full h-[50%] relative">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            playing
            muted={true}
          />
          <div className="flex flex-row items-center justify-between absolute bottom-3 bg-black-overlay w-full p-3.5">
            <div className="flex flex-row justify-between items-center w-[20%] ml-8">
              <div className="flex flex-row justify-between items-center w-full">
                <button
                  onClick={playMovie}
                  className="bg-gray-50 flex flex-row items-center w-[75px] px-3 py-0.5 rounded-md mr-1.5"
                >
                  <span>Play</span>
                  <BsFillPlayFill className="text-3xl" />
                </button>

                <div>
                  <BsPlusCircle
                    className="text-3xl text-gray-50 mr-1.5"
                    onClick={saveMovie}
                    data-tip
                    data-for="saveShow"
                  />
                  <ReactTooltip id="saveShow" place="top" effect="solid">
                    Add to my List
                  </ReactTooltip>
                </div>

                {like ? (
                  <div>
                    <AiFillLike
                      className="text-3xl  text-gray-50 mr-1.5"
                      onClick={() => setLike(!like)}
                      data-tip
                      data-for="unLikeShow"
                    />
                    <ReactTooltip id="unLikeShow" place="top" effect="solid">
                      unlike this
                    </ReactTooltip>
                  </div>
                ) : (
                  <div>
                    <SlLike
                      className="text-2xl text-gray-50 mr-1.5"
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
            </div>
            <p className="text-3xl text-white ml-6">
              {movie?.title || movie.original_title}
            </p>
          </div>
        </div>
        <div className="flex flex-row w-[95%] mx-auto h-[30%] justify-between items-center mt-6">
          <div className="w-[52%] h-full text-gray-200 overflow-hidden break-word text-wrap">
            <p>{movie?.overview}</p>
          </div>
          <div className="w-[30%] h-full text-gray-200 flex flex-row overflow-hidden break-word">
            <p className="mr-1">Genre:</p>

            {genres.map((genre, index) => (
              <p key={genre.id} className="mr-1 ">
                {genre.name}{" "}
                <span>{index === genres.length - 1 ? "." : ","}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
