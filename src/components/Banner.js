import React, { useState } from "react";
import axios from "axios";
import requests from "../Requests";
import { useQuery } from "@tanstack/react-query";
import { GrPlayFill } from "react-icons/gr";
import { BiInfoCircle } from "react-icons/bi";
import Modal from "./Modal";

const Banner = () => {
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading } = useQuery(["popular"], () => {
    return axios
      .get(requests.requestPopular)
      .then((res) => res.data.results)
      .catch((err) => console.log(err.message));
  });
  //   console.log(data);
  if (isLoading) {
    return <h1>loading</h1>;
  }
  const movie = data[Math.floor(Math.random() * data?.length)];

  // console.log(movie);
  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full h-[600px] text-white">
      <div className="w-full h-full">
        <div className="absolute w-full h-[600px] bg-gradient-to-r from-black" />
        <img
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
          alt={movie?.title}
        />
        <div className="absolute w-full top-[20%] p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold">{movie?.title}</h1>
          <div className="my-4 flex flex-row justify-between items-center w-[21%]">
            <button className="border bg-gray-50 text-black border-gray-300 py-2 px-5 flex flex-row justify-between items-center w-[105px] rounded-lg">
              <GrPlayFill className="text-xl" />
              Play
            </button>
            <button
              className="border text-white border-gray-300 py-2 px-5 ml-4 flex flex-row justify-between items-center w-[140px] rounded-lg"
              onClick={() => setShowModal(true)}
            >
              <BiInfoCircle className="text-2xl" />
              More Info
            </button>
          </div>
          <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
            {truncateString(movie?.overview, 150)}
          </p>
        </div>
      </div>
      {showModal && <Modal movie={movie} closeFunc={closeModal} />}
    </div>
  );
};

export default Banner;
