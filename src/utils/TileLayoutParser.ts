import { Routing, Architecture, Mapping } from "../types/MappingAndRouting";
import { TileLayout, Tile, TileTypes } from "../types/TileLayout";

interface coordinates {
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
    for (const pathLoc of route.path) {
      const { x, y } = locaitonToCoordinate(pathLoc, arch);
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
      const pathTile: Tile = { type: tileType, id: route.id };
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
        const {x, y} = locaitonToCoordinate(qubitLoc, arch);
        const qubitTile: Tile = {type: TileTypes.Qubit, id: null}
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
    const qubitTile: Tile = { type: TileTypes.Qubit, id: Number(key) } as Tile;
    layout.setTile(x, y, qubitTile);
  }

  // Fill in magic states from architecture
  for (const magic_loc of arch.magic_states) {
    const { x, y } = locaitonToCoordinate(magic_loc, arch);
    const magicTile: Tile = { type: TileTypes.Magic, id: null };
    layout.setTile(x, y, magicTile);
  }
}

function locaitonToCoordinate(
  location: number,
  arch: Architecture
): coordinates {
  const x_cord: number = location % arch.width;
  const y_cord: number = Math.floor(location / arch.width);
  return { x: x_cord, y: y_cord } as coordinates;
}
