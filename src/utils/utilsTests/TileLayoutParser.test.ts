import { expect, test } from "vitest";
import { Architecture, Mapping, Routing } from "../../types/MappingAndRouting";
import {
  Coordinates,
  setPathTypes,
  locaitonToCoordinate,
  tileLayoutFromRouting,
} from "../TileLayoutParser";
import { PathTypes, Tile, TileLayout, TileTypes } from "../../types/TileLayout";

// Mapping, routing, and architecture to be used by tests
const testRouting: Routing[] = [
  {
    id: 1,
    op: "t",
    qubits: [0],
    path: [6, 5, 10],
  } as Routing,
  {
    id: 2,
    op: "tdg",
    qubits: [1],
    path: [8, 7, 12],
  } as Routing,
];
const testMapping: Mapping = {
  "0": 1,
  "1": 3,
} as Mapping;
const testArchitecture: Architecture = {
  height: 5,
  width: 5,
  alg_qubits: [1, 3],
  magic_states: [11, 13],
} as Architecture;

test("Tile layout from routing test", () => {
  const resultTileLayout: TileLayout = tileLayoutFromRouting(
    testRouting,
    testArchitecture,
    testMapping
  );

  // Construct target tile layout
  const targetWidth = 5;
  const targetHeight = 5;
  const targetTileLayout: TileLayout = new TileLayout(
    targetWidth,
    targetHeight
  );

  // Test that the height and width of result and target are the same
  expect(resultTileLayout.height).toEqual(targetTileLayout.height);
  expect(resultTileLayout.width).toEqual(targetTileLayout.width);

  // Populate a qubit to the target
  const targetQubitCoordinates: Coordinates = {
    x: 1,
    y: 0,
  } as Coordinates;
  const targetQubitTile: Tile = {
    tileType: TileTypes.Qubit,
    topType: PathTypes.default,
    bottomType: PathTypes.default,
    leftType: PathTypes.default,
    rightType: PathTypes.default,
    id: 1,
  } as Tile;
  targetTileLayout.setTile(
    targetQubitCoordinates.x,
    targetQubitCoordinates.y,
    targetQubitTile
  );

  // Test that the test and result have the same qubit in the same spot
  expect(
    resultTileLayout.matrix[targetQubitCoordinates.y][targetQubitCoordinates.x]
  ).toEqual(
    resultTileLayout.matrix[targetQubitCoordinates.y][targetQubitCoordinates.x]
  );

  // Populate a path to the target
  const targetPathCoordinates: Coordinates = {
    x: 0,
    y: 1,
  } as Coordinates;
  const targetPathTile: Tile = {
    tileType: TileTypes.T,
    topType: PathTypes.default,
    bottomType: PathTypes.default,
    leftType: PathTypes.default,
    rightType: PathTypes.default,
    id: 1,
  };
  targetTileLayout.setTile(
    targetPathCoordinates.x,
    targetPathCoordinates.y,
    targetPathTile
  );

  // Test that the test and result have the same qubit in the same spot
  expect(
    resultTileLayout.matrix[targetPathCoordinates.y][targetPathCoordinates.x]
  ).toEqual(
    resultTileLayout.matrix[targetPathCoordinates.y][targetPathCoordinates.x]
  );
});

test("Location to Coordinate Test", () => {
  {
    // Test the 0 location
    const testLocation = 0;
    const targetCoordinate: Coordinates = {
      x: 0,
      y: 0,
    } as Coordinates;
    const resultCoordinate: Coordinates = locaitonToCoordinate(
      testLocation,
      testArchitecture
    );
    expect(resultCoordinate).toEqual(targetCoordinate);
  }

  {
    // Test the end location
    const testLocation = testArchitecture.width * testArchitecture.height - 1;
    const targetCoordinate: Coordinates = {
      x: testArchitecture.width - 1,
      y: testArchitecture.height - 1,
    } as Coordinates;
    const resultCoordinate: Coordinates = locaitonToCoordinate(
      testLocation,
      testArchitecture
    );
    expect(resultCoordinate).toEqual(targetCoordinate);
  }
});

test("Find path type test", () => {
  const testQubitLoc: number = 6;
  const testMapping: Mapping = {
    "0": 6,
  } as Mapping;
  const testQubitIdentifiers: number[] = [0];
  const testLayout: TileLayout = new TileLayout(5, 5);
  const { x: qubit_x, y: qubit_y } = locaitonToCoordinate(
    testQubitLoc,
    testArchitecture
  );
  const testQubit: Tile = {
    tileType: TileTypes.Qubit,
    topType: PathTypes.default,
    bottomType: PathTypes.default,
    leftType: PathTypes.default,
    rightType: PathTypes.default,
    id: 0,
  } as Tile;
  testLayout.setTile(qubit_x, qubit_y, testQubit);

  const testControlBottom: Tile = {
    tileType: TileTypes.CX,
    topType: PathTypes.default,
    bottomType: PathTypes.default,
    leftType: PathTypes.default,
    rightType: PathTypes.default,
    id: 1,
  } as Tile;
  testLayout.setTile(qubit_x, qubit_y + 1, testControlBottom);
  setPathTypes(
    testQubitIdentifiers,
    testQubitLoc + 5, // down a row
    testLayout,
    testArchitecture,
    testMapping
  );
  // Check all sides of the path qubit below the qubit
  expect(testLayout.getTile(qubit_x, qubit_y + 1).topType).toBe(
    PathTypes.control
  );
  expect(testLayout.getTile(qubit_x, qubit_y + 1).bottomType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x, qubit_y + 1).rightType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x, qubit_y + 1).leftType).toBe(
    PathTypes.default
  );

  const testControlTop: Tile = {
    tileType: TileTypes.CX,
    topType: PathTypes.default,
    bottomType: PathTypes.default,
    leftType: PathTypes.default,
    rightType: PathTypes.default,
    id: 2,
  } as Tile;

  testLayout.setTile(qubit_x, qubit_y - 1, testControlTop);
  setPathTypes(
    testQubitIdentifiers,
    testQubitLoc - 5, // up a row
    testLayout,
    testArchitecture,
    testMapping
  );
  // Check all sides of the path qubit above the qubit
  expect(testLayout.getTile(qubit_x, qubit_y - 1).topType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x, qubit_y - 1).bottomType).toBe(
    PathTypes.control
  );
  expect(testLayout.getTile(qubit_x, qubit_y - 1).rightType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x, qubit_y - 1).leftType).toBe(
    PathTypes.default
  );

  const testTargetLeft: Tile = {
    tileType: TileTypes.CX,
    topType: PathTypes.default,
    bottomType: PathTypes.default,
    leftType: PathTypes.default,
    rightType: PathTypes.default,
    id: 3,
  } as Tile;
  testLayout.setTile(qubit_x - 1, qubit_y, testTargetLeft);
  setPathTypes(
    testQubitIdentifiers,
    testQubitLoc - 1, // to the left
    testLayout,
    testArchitecture,
    testMapping
  );
  // Check all sides of the path qubit to the left of the qubit
  expect(testLayout.getTile(qubit_x - 1, qubit_y).topType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x - 1, qubit_y).bottomType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x - 1, qubit_y).rightType).toBe(
    PathTypes.target
  );
  expect(testLayout.getTile(qubit_x - 1, qubit_y).leftType).toBe(
    PathTypes.default
  );

  const testTargetRight: Tile = {
    tileType: TileTypes.CX,
    topType: PathTypes.default,
    bottomType: PathTypes.default,
    leftType: PathTypes.default,
    rightType: PathTypes.default,
    id: 4,
  } as Tile;
  testLayout.setTile(qubit_x + 1, qubit_y, testTargetRight);
  setPathTypes(
    testQubitIdentifiers,
    testQubitLoc + 1, // to the right
    testLayout,
    testArchitecture,
    testMapping
  );
  // Check all sides of the path qubit to the right of the qubit
  expect(testLayout.getTile(qubit_x + 1, qubit_y).topType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x + 1, qubit_y).bottomType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x + 1, qubit_y).rightType).toBe(
    PathTypes.default
  );
  expect(testLayout.getTile(qubit_x + 1, qubit_y).leftType).toBe(
    PathTypes.target
  );

  // finally check control qubit
  expect(testLayout.getTile(qubit_x, qubit_y).bottomType).toBe(
    PathTypes.control
  );
  expect(testLayout.getTile(qubit_x, qubit_y).bottomType).toBe(
    PathTypes.control
  );
  expect(testLayout.getTile(qubit_x, qubit_y).leftType).toBe(PathTypes.target);
  expect(testLayout.getTile(qubit_x, qubit_y).rightType).toBe(PathTypes.target);
});
