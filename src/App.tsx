import { useEffect, useState } from "react";
import "./App.css";
import QubitGrid from "./components/QubitGrid";
import { TileLayout } from "./types/TileLayout";
import { tileLayoutFromRouting } from "./utils/TileLayoutParser";
import { MappingAndRouting } from "./types/MappingAndRouting";
import DropzoneComponent from "./components/DropzoneComponent";

function App() {
  // hold the slider state
  const [layer, setLayer] = useState<number>(0);
  const [layerMax, setLayerMax] = useState<number>(0);
  const increment = () => {
    const newLayer = Math.min(layer + 1, layerMax);
    setLayer(newLayer);
    mappingAndRouting != null
      ? setLayout(
          tileLayoutFromRouting(
            mappingAndRouting.steps[newLayer],
            mappingAndRouting.arch,
            mappingAndRouting.map
          )
        )
      : null;
  }; // Prevent going over max
  const decrement = () => {
    const newLayer = Math.max(layer - 1, 0);
    setLayer(newLayer);
    mappingAndRouting != null
      ? setLayout(
          tileLayoutFromRouting(
            mappingAndRouting.steps[newLayer],
            mappingAndRouting.arch,
            mappingAndRouting.map
          )
        )
      : null;
  }; // Prevent going below min

  // hold the async json parsing
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // hold the routing variables
  const [mappingAndRouting, setMappingAndRouting] =
    useState<MappingAndRouting | null>(null);
  const [layout, setLayout] = useState<TileLayout>(
    mappingAndRouting != null
      ? tileLayoutFromRouting(
          mappingAndRouting.steps[0],
          mappingAndRouting.arch,
          mappingAndRouting.map
        )
      : new TileLayout(5, 5)
  );

  // resolve the mapping and routing promise
  useEffect(() => {
    fetch("/QC-Vis/out.json")
      .then((response) => {
        console.log(response);
        return response;
      })
      .then((response) => response.json() as Promise<MappingAndRouting>)
      .then((result) => {
        handleMappingAndRoutingUpdate(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.log(err);
        console.log("no");
      });
  }, []);

  const handleMappingAndRoutingUpdate = (result: MappingAndRouting) => {
    setMappingAndRouting(result);
    setLayout(tileLayoutFromRouting(result.steps[0], result.arch, result.map));
    setLayerMax(result.steps.length - 1);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <div className="items-center rows-3">
          <DropzoneComponent onUpload={handleMappingAndRoutingUpdate} />
          <div>
            {loading ? (
              <p>Loading ...</p>
            ) : error ? (
              <p>Error: {error.message} </p>
            ) : (
              <QubitGrid layout={layout} />
            )}
          </div>
          <div className="flex items-center columns-3">
            {/* Increment */}
            <button
              onClick={decrement}
              className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 active:scale-95 transition"
            >
              -
            </button>
            {/* Slider */}
            <input
              type="range"
              min="0"
              max={layerMax}
              value={layer}
              onChange={(e) => {
                const newLayer = Number(e.target.value);
                setLayer(newLayer);
                mappingAndRouting != null
                  ? setLayout(
                      tileLayoutFromRouting(
                        mappingAndRouting.steps[newLayer],
                        mappingAndRouting.arch,
                        mappingAndRouting.map
                      )
                    )
                  : null;
              }}
              className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {/* Decrement */}
            <button
              onClick={increment}
              className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 active:scale-95 transition"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
