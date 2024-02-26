// Slider.tsx
import React, { useState } from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import "../../pages/Home/index.scss";
interface SliderProps {
  imgUrl: string[]; // Define the type of imgUrl as an array of strings
}

function Slider({ imgUrl }: SliderProps) {
  const [imgIndex, setImgIndex] = useState(0);

  function showNextImg() {
    setImgIndex((index) => {
      if (index === imgUrl.length - 1) return 0;
      return index + 1;
    });
  }

  function showPrevImg() {
    setImgIndex((index) => {
      if (index === 0) return imgUrl.length - 1;
      return index - 1;
    });
  }

  return (
    <div className="sliderInside">
      <img src={imgUrl[imgIndex]} className="img-slider-img" />
      <button
        onClick={showPrevImg}
        className="img-slider-btn"
        style={{ left: 0 }}
      >
        <ArrowBigLeft />
      </button>
      <button
        onClick={showNextImg}
        className="img-slider-btn"
        style={{ right: 0 }}
      >
        <ArrowBigRight />
      </button>
    </div>
  );
}

export default Slider;
