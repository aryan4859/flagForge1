import React from "react";
import { Triangle } from "react-loader-spinner"; // Using Triangle loader
import Navbar from "./Navbar";

const Loading = () => {
  return (
    <div className="h-[70vh] flex justify-center items-center">
      <Triangle
        height="125"   // Increased height
        width="125"    // Increased width
        color="#ef4444"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass="triangle-wrapper"
      />
    </div>
  );
};

export default Loading;
