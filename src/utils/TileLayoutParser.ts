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

      // get the path type
      const pathType: PathTypes = findPathType(
        pathLoc,
        route.qubits,
        arch,
        map
      );

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
        pathType: pathType,
        id: route.id,
      } as Tile;
      layout.setTile(x, y, pathTile);
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
      pathType: PathTypes.default,
      id: Number(key),
    } as Tile;
    layout.setTile(x, y, qubitTile);
  }

  // Fill in magic states from architecture
  for (const magic_loc of arch.magic_states) {
    const { x, y } = locaitonToCoordinate(magic_loc, arch);
    const magicTile: Tile = {
      tileType: TileTypes.Magic,
      pathType: PathTypes.default,
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

export function findPathType(
  pathLoc: number,
  qubitIdentifiers: number[],
  arch: Architecture,
  map: Mapping
): PathTypes {
  const { x: path_x, y: path_y } = locaitonToCoordinate(pathLoc, arch);
  for (const qubitIdentifier of qubitIdentifiers) {
    // find the coordinates of the qubit
    const qubitLocation: number = map[String(qubitIdentifier)];
    const { x: qubit_x, y: qubit_y } = locaitonToCoordinate(
      qubitLocation,
      arch
    );

    // make sure it is on the same x and their y is within 1 tile
    const vertical_close: boolean = Math.abs(qubit_y - path_y) === 1;
    if (path_x === qubit_x && vertical_close) {
      return PathTypes.control;
    }

    // make sure it is on the same y and their x is within 1 tile
    const horizontal_close: boolean = Math.abs(qubit_x - path_x) === 1;
    if (path_y === qubit_y && horizontal_close) {
      return PathTypes.target;
    }
  }
  return PathTypes.default;
}
