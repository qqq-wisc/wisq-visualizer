import React, { useEffect, useRef, useState } from "react";
import { TileLayout } from "../types/TileLayout";
import TileElement from "./TileElement";

interface QubitGridProperties {
  layout: TileLayout;
  sizePercentage: number;
}

const QubitGrid: React.FC<QubitGridProperties> = ({
  layout,
  sizePercentage,
}) => {
  // thanks chat
  const gridRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const getColorName = (index: number | null) => {
    const colors = [
      "bg-[#332288]",
      "bg-[#117733]",
      "bg-[#44AA99]",
      "bg-[#88CCEE]",
      "bg-[#DDCC77]",
      "bg-[#CC6677]",
      "bg-[#AA4499]",
      "bg-[#882255]",
    ];
    if (index == null) return colors[0];
    return colors[index % 8];
  };

  // thanks chat
  useEffect(() => {
    const updateSize = () => {
      if (gridRef.current) {
        const containerWidth = gridRef.current.clientWidth * sizePercentage;
        const containerHeight = gridRef.current.clientHeight * sizePercentage;

        // Calculate maximum possible tile size that fits both dimensions
        const widthBasedSize = containerWidth / layout.width;
        const heightBasedSize = containerHeight / layout.height;

        const newTileSize = Math.min(widthBasedSize, heightBasedSize) * 0.95; // 5% padding

        setTileSize(newTileSize);
        setContainerSize({
          width: layout.width * newTileSize,
          height: layout.height * newTileSize,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [layout.width, layout.height]);

  return (
    <div
      ref={gridRef}
      className="w-full h-full flex items-center justify-center"
    >
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${layout.width}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${layout.height}, ${tileSize}px)`,
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
      >
        {layout.matrix.map((row, rowIndex) => {
          return (
            <React.Fragment key={rowIndex}>
              {row.map((tile, tileIndex) => (
                <TileElement
                  tile={tile}
                  key={tileIndex}
                  color={getColorName(tile.id)}
                />
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default QubitGrid;
