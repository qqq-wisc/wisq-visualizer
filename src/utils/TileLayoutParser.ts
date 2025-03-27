import { Routing, Architecture, Mapping } from "../types/MappingAndRouting";
import { TileLayout, Tile, TileTypes, PathTypes } from "../types/TileLayout";

export interface Coordinates {
  x: number;
  y: number;
}

export function tileLayoutFromRouting(
  routing: Routing[],
  arch: Architecture,
  map: Mapping
): TileLayout {
  let layout: TileLayout = new TileLayout(arch.width, arch.height);

  // generates the base from the mapping and architecture
  generateBase(layout, arch, map);

  // generate routing
  for (const route of routing) {
    for (const qubitIdentifier of route.qubits) {
      const { x, y } = locaitonToCoordinate(map[String(qubitIdentifier)], arch);
      const qubitTile: Tile = {
        tileType: TileTypes.Qubit,
        id: qubitIdentifier,
      } as Tile;
      layout.setTile(x, y, qubitTile);
    }
    for (const pathLoc of route.path) {
      const { x, y } = locaitonToCoordinate(pathLoc, arch);

      // Get the tile type
      let tileType: TileTypes = TileTypes.Empty;
      switch (route.op) {
        case "cx":
          tileType = TileTypes.CX;
          break;
        case "t":
          tileType = TileTypes.T;
          break;
        case "tdg":
          tileType = TileTypes.TDG;
          break;
        default:
          break;
      }

      const pathTile: Tile = {
        tileType: tileType,
        topType: PathTypes.default,
        bottomType: PathTypes.default,
        leftType: PathTypes.default,
        rightType: PathTypes.default,
        id: route.id,
      } as Tile;

      layout.setTile(x, y, pathTile);
      // Set the path types
      setPathTypes(route.qubits, pathLoc, layout, arch, map);
    }
  }

  return layout;
}

function generateBase(
  layout: TileLayout,
  arch: Architecture,
  map: Mapping
): void {
  /*
  // Fill in qubits from architecture
  for (const qubitLoc of arch.alg_qubits) {
    const { x, y } = locaitonToCoordinate(qubitLoc, arch);
    const qubitTile: Tile = { tileType: TileTypes.Qubit, pathType: PathTypes.default, id: null } as Tile;
    layout.setTile(x, y, qubitTile);
  }
  */

  /*
    The problem is that the locations in architecture are the values of keys in the mapping
    We want to use the mapping keys for id's, which means that we cannot just fill it in before
    This rewrites qubits to ensure that the used qubits contain their id for subscripting
    */
  for (const key in map) {
    const { x, y } = locaitonToCoordinate(map[key], arch);
    const qubitTile: Tile = {
      tileType: TileTypes.Qubit,
      topType: PathTypes.default,
      bottomType: PathTypes.default,
      leftType: PathTypes.default,
      rightType: PathTypes.default,
      id: Number(key),
    } as Tile;
    layout.setTile(x, y, qubitTile);
  }

  // Fill in magic states from architecture
  for (const magic_loc of arch.magic_states) {
    const { x, y } = locaitonToCoordinate(magic_loc, arch);
    const magicTile: Tile = {
      tileType: TileTypes.Magic,
      topType: PathTypes.default,
      bottomType: PathTypes.default,
      leftType: PathTypes.default,
      rightType: PathTypes.default,
      id: null,
    } as Tile;
    layout.setTile(x, y, magicTile);
  }
}

export function locaitonToCoordinate(
  location: number,
  arch: Architecture
): Coordinates {
  const x_cord: number = location % arch.width;
  const y_cord: number = Math.floor(location / arch.width);
  return { x: x_cord, y: y_cord } as Coordinates;
}

export function setPathTypes(
  qubitIdentifiers: number[],
  tileLocation: number,
  tileLayout: TileLayout,
  arch: Architecture,
  map: Mapping
): void {
  const { x: path_x, y: path_y } = locaitonToCoordinate(tileLocation, arch);

  // Check only the qubits in the path
  for (const qubitIdentifier of qubitIdentifiers) {
    // find the coordinates of the qubit
    const qubitLocation: number = map[String(qubitIdentifier)];
    const { x: qubit_x, y: qubit_y } = locaitonToCoordinate(
      qubitLocation,
      arch
    );

    // Check if qubit is above the tile
    if (qubit_x === path_x && qubit_y === path_y - 1) {
      console.log("BOTTOM");
      // Change upper border of the path tile to control
      tileLayout.getTile(path_x, path_y).topType = PathTypes.control;
      // Change lower border of the qubit tile to control
      tileLayout.getTile(qubit_x, qubit_y).bottomType = PathTypes.control;
      continue;
    }

    // Check if qubit is below the tile
    if (qubit_x === path_x && qubit_y === path_y + 1) {
      console.log("TOP");
      // Change upper border of the path tile to control
      tileLayout.getTile(path_x, path_y).bottomType = PathTypes.control;
      // Change lower border of the qubit tile to control
      tileLayout.getTile(qubit_x, qubit_y).topType = PathTypes.control;
      continue;
    }

    // Check if qubit is to the left of the tile
    if (qubit_x === path_x - 1 && qubit_y === path_y) {
      // Change upper border of the path tile to control
      tileLayout.getTile(path_x, path_y).leftType = PathTypes.target;
      // Change lower border of the qubit tile to control
      tileLayout.getTile(qubit_x, qubit_y).rightType = PathTypes.target;
      continue;
    }

    // Check if qubit is to the right of the tile
    if (qubit_x === path_x + 1 && qubit_y === path_y) {
      // Change upper border of the path tile to control
      tileLayout.getTile(path_x, path_y).rightType = PathTypes.target;
      // Change lower border of the qubit tile to control
      tileLayout.getTile(qubit_x, qubit_y).leftType = PathTypes.target;
      continue;
    }
  }
}
