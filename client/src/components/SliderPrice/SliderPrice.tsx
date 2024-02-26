import React, { useState, useEffect } from "react";
import Slider from "react-slider";
import "./sliderPrice.css";

interface SliderPriceProps {
  onChange: (newValues: [number, number]) => void;
  min: number;
  max: number;
}

const SliderPrice: React.FC<SliderPriceProps> = ({ onChange, min, max }) => {
  const [values, setValues] = useState<number[]>([min, max]);

  useEffect(() => {
    onChange(values as [number, number]);
  }, [values, onChange]);
  return (
    <div className="sliderPrice">
      <div className="sliderPriceBox">
        <h3 className="h3SliderBlock">
          Price <span className="spanSliderPrice">Range</span>
        </h3>
        <div className={"values"}>
          £{values[0]} - £{values[1]}
        </div>
        <small>Current Range: £{values[1] - values[0]}</small>

        <Slider
          className="sliderReact"
          onChange={setValues}
          value={values}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

export default SliderPrice;
