import { ChangeEvent, useCallback, useEffect, useRef } from "react";

import "./../../css/MultiRangeSlider.css";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  setMinVal: (val: number) => void;
  setMaxVal: (val: number) => void;
  onChange: (values: OnChangeProps) => void;
}

interface OnChangeProps {
  min: number;
  max: number;
}

const MultiRangeSlider = ({
  min,
  max,
  minVal,
  maxVal,
  setMinVal,
  setMaxVal,
  onChange,
}: MultiRangeSliderProps) => {
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const updateMinValue = (inputValue: string) => {
    const value = Math.min(+inputValue, maxVal - 1);
    if (maxValRef.current) {
      const minPercent = getPercent(value);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
    onChange({ min: value, max: maxVal });
    setMinVal(value);
  };

  const updateMaxValue = (inputValue: string) => {
    const value = Math.max(+inputValue, minVal);
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
    onChange({ min: minVal, max: value });
    setMaxVal(value);
  };

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  return (
    <div className="container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          updateMinValue(e.target.value);
          e.target.value = e.target.value.toString();
        }}
        className={"thumb thumb--zindex-3"}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          updateMaxValue(e.target.value);
          e.target.value = e.target.value.toString();
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="slider">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
