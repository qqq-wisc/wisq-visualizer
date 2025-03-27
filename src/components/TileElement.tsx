import React from "react";
import { PathTypes, Tile, TileTypes } from "../types/TileLayout";

interface TileProperties {
  tile: Tile;
  key: number;
}

function tileToColor(tile: Tile): string {
  switch (tile.tileType) {
    case TileTypes.Empty:
      return "bg-white";
    case TileTypes.Qubit:
      return "bg-blue-200";
    case TileTypes.Magic:
      return "bg-yellow-700";
    case TileTypes.CX:
      return "bg-green-500";
    case TileTypes.T:
      return "bg-yellow-500";
    case TileTypes.TDG:
      return "bg-yellow-200";
    default:
      return "bg-white";
  }
}

function tileToBorder(tile: Tile): string {
  // I unfortunately cannot store the colors in a variable because of tailwind's JIT compiler, apparently..
  let border = "border-black border-2 ";

  if (tile.topType === PathTypes.control)
    border += "border-t-blue-500 border-t-4";

  if (tile.bottomType === PathTypes.control)
    border += "border-b-blue-500 border-b-4 ";

  if (tile.leftType === PathTypes.target)
    border += "border-l-red-500 border-l-4 ";

  if (tile.rightType === PathTypes.target)
    border += "border-r-red-500 border-r-4 ";

  return border;
}

function tileToName(tile: Tile): React.JSX.Element {
  switch (tile.tileType) {
    case TileTypes.Empty:
      return <></>;
    case TileTypes.Qubit:
      return (
        <>
          Q<sub>{tile.id ?? ""}</sub>
        </>
      );
    case TileTypes.Magic:
      return (
        <>
          M<sub>{tile.id ?? ""}</sub>
        </>
      );
    case TileTypes.CX:
      return <>{tile.id}</>;
    case TileTypes.T:
      return <>{tile.id}</>;
    case TileTypes.TDG:
      return <>{tile.id}</>;
    default:
      return <></>;
  }
}

const TileElement: React.FC<TileProperties> = ({ tile, key }) => {
  return (
    <>
      <div
        key={key}
        className={`flex items-center justify-center w-full aspect-square 
                ${tileToColor(tile)} 
                text-black text-lg font-bold shadow-md ${tileToBorder(tile)}`}
      >
        {tileToName(tile)}
      </div>
    </>
  );
};

export default TileElement;
