import { expect, test } from "vitest";
import { Architecture, Mapping, Routing } from "../../types/MappingAndRouting";
import {
  Coordinates,
  findPathType,
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
    pathType: PathTypes.default,
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
    pathType: PathTypes.default,
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
  {
    // Test Control
    const testQubitLocation: number = testMapping["0"];
    // Path below the qubit
    const testControlLocation: number =
      testQubitLocation + testArchitecture.width;
    const resultType: PathTypes = findPathType(
      testControlLocation,
      [0],
      testArchitecture,
      testMapping
    );
    const targetType: PathTypes = PathTypes.control;
    expect(resultType).toEqual(targetType);
  }

  {
    // Test Target
    const testQubitLocation: number = testMapping["1"];
    // Path to the right of the qubit
    const testControlLocation: number = testQubitLocation + 1;
    const resultType: PathTypes = findPathType(
      testControlLocation,
      [1],
      testArchitecture,
      testMapping
    );
    const targetType: PathTypes = PathTypes.target;
    expect(resultType).toEqual(targetType);
  }

  {
    // Test Default
    const testQubitLocation: number = testMapping["0"];
    // Path on the qubit's bottom right corner
    const testControlLocation: number =
      testQubitLocation + testMapping.width + 1;
    const resultType: PathTypes = findPathType(
      testControlLocation,
      [1],
      testArchitecture,
      testMapping
    );
    const targetType: PathTypes = PathTypes.default;
    expect(resultType).toEqual(targetType);
  }
});
