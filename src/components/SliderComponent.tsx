import React, { useEffect, useState } from "react";

interface SliderComponentProperties {
  onSliderChange: (newLayer: number) => void;
  maxSize: number;
}

const SliderComponent: React.FC<SliderComponentProperties> = ({
  onSliderChange,
  maxSize,
}) => {
  // hold the slider state
  const [layer, setLayer] = useState<number>(0);
  const [layerMax, setLayerMax] = useState<number>(maxSize);
  // Prevent going over max
  const increment = () => {
    const newLayer = Math.min(layer + 1, layerMax);
    setLayer(newLayer);
    onSliderChange(newLayer);
  };
  // Prevent going below min
  const decrement = () => {
    const newLayer = Math.max(layer - 1, 0);
    setLayer(newLayer);
    onSliderChange(newLayer);
  };

  useEffect(() => {
    setLayer(0);
    setLayerMax(maxSize);
  }, [maxSize]);

  return (
    <>
      <div className="flex items-center columns-4">
        {/* Increment */}
        <button
          onClick={decrement}
          className="px-3 py-1 bg-gray-200 border-1 border-solid border-color-black rounded-full hover:bg-gray-300 active:scale-95 transition cursor-pointer"
        >
          <strong>-</strong>
        </button>
        {/* Slider */}
        <input
          type="range"
          min="0"
          max={layerMax}
          value={layer}
          onChange={(e) => {
            const newLayer = Number(e.target.value);
            setLayer(newLayer);
            onSliderChange(newLayer);
          }}
          className="flex-1 h-2 ml-2 mr-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        {/* Decrement */}
        <button
          onClick={increment}
          className="px-3 py-1 bg-gray-200 border-1 border-solid border-color-black rounded-full hover:bg-gray-300 active:scale-95 transition cursor-pointer"
        >
          <strong>+</strong>
        </button>
        <p>{maxSize}</p>
      </div>
    </>
  );
};

export default SliderComponent;
