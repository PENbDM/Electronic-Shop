import React from "react";
import "./index.scss";
const FullScreenLoader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // You can adjust the background color and opacity
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <p className="pLoading">Loading...</p>
    </div>
  );
};

export default FullScreenLoader;
