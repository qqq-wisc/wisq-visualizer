export enum TileTypes {
  Qubit,
  Magic,
  CX,
  T,
  Empty,
  TDG,
}

export interface Tile {
  type: TileTypes;
  id: number | null;
}

export class TileLayout {
  width: number;
  height: number;
  matrix: Array<Array<Tile>>;

  constructor(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be greater than 0");
    }

    this.width = width;
    this.height = height;
    this.matrix = Array.from({ length: height }, () =>
      Array(width).fill({ type: TileTypes.Empty, id: 0 })
    );
  }

  setTile(x: number, y: number, tile: Tile): void {
    this.matrix[y][x] = tile;
  }
}
