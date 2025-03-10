import { expect, test } from 'vitest';
import { TileLayout, Tile, TileTypes } from '../TileLayout';

test('Test Constructor Blank Tile', () => {
    const height: number = 4;
    const width: number = 3;
    const ResultLayout: TileLayout = new TileLayout(width, height);
    const TargetTile: Tile = {
        type: TileTypes.Empty,
        id: 0,
    };

    // make sure that the layout contains the blank tile
    expect(ResultLayout.matrix[0][0]).toEqual(TargetTile);
});

test('Test Constructor Dimensions', () => {
    const height: number = 4;
    const width: number = 3;
    const ResultLayout: TileLayout = new TileLayout(width, height);

    // make sure that the dimensions are proper
    expect(ResultLayout.matrix[0].length).toBe(width);
    expect(ResultLayout.matrix.length).toBe(height);
});

test('Test Constructor Bounds Checking', () => {
    // make sure that bounds checking works
    expect(() => new TileLayout(-1, 1)).toThrow();
    expect(() => new TileLayout(1, -1)).toThrow();
    expect(() => new TileLayout(0, 0)).toThrow();
});