import React from "react";
import { Tile, TileLayout, TileTypes } from "../types/TileLayout";
import TileElement from "./TileElement";

interface QubitGridProperties {
  layout: TileLayout;
}

const QubitGrid: React.FC<QubitGridProperties> = ({ layout }) => {
  return (
    <>
      <div
        className="grid gap-1 p-4"
        style={{ gridTemplateColumns: `repeat(${layout.width}, 1fr)` }}
      >
        {layout.matrix.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((tile, tileIndex) => (
              <TileElement tile={tile} key={tileIndex} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default QubitGrid;
