import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Movie from "./Movie";
const Row = ({ title, fetchURL, rowID }) => {
  const { data, isLoading } = useQuery([`${title}`], () => {
    return axios
      .get(fetchURL)
      .then((res) => res.data.results)
      .catch((err) => console.log(err.message));
  });

  if (isLoading) {
    return <h1>loading</h1>;
  }
  // console.log(data);

  const slideLeft = () => {
    const slider = document.getElementById("slider" + rowID);
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    const slider = document.getElementById("slider" + rowID);
    slider.scrollLeft = slider.scrollLeft + 500;
  };
  return (
    <>
      <h2 className="text-white font-bold md:text-xl p-4">{title}</h2>
      <div className="relative flex items-center group">
        <MdChevronLeft
          onClick={slideLeft}
          className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer hover:z-[100] hidden group-hover:block"
          size={40}
        />
        <div
          id={"slider" + rowID}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
        >
          {data.map((movie) => (
            <Movie key={movie.id} item={movie} />
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer hover:z-[100] hidden group-hover:block"
          size={40}
        />
      </div>
    </>
  );
};

export default Row;

