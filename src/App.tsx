import { useEffect, useState } from "react";
import "./App.css";
import QubitGrid from "./components/QubitGrid";
import { TileLayout } from "./types/TileLayout";
import { tileLayoutFromRouting } from "./utils/TileLayoutParser";
import { MappingAndRouting, MRFile } from "./types/MappingAndRouting";
import DropzoneComponent from "./components/DropzoneComponent";
import LayoutSelector from "./components/LayoutSelector";
import SliderComponent from "./components/SliderComponent";
import LayoutSelectionBar from "./components/LayoutSelectionBar";

function App() {
  // hold uploaded pathings
  const [uploadedFiles, setUploadedPaths] = useState<{ [key: string]: MRFile }>(
    {}
  );
  const handlePathUpload = (newFile: MRFile) => {
    setUploadedPaths((prev) => ({ ...prev, [newFile.name]: newFile }));
    handleMappingAndRoutingUpdate(newFile.mappingAndRouting);
  };

  // hold the slider state
  const [layerMax, setLayerMax] = useState<number>(0);

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

  // resol ve the mapping and routing promise
  useEffect(() => {
    fetch("/wisq-visualizer/out.json")
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

  const handleSliderUpdate = (newLayer: number) => {
    mappingAndRouting != null
      ? setLayout(
          tileLayoutFromRouting(
            mappingAndRouting.steps[newLayer],
            mappingAndRouting.arch,
            mappingAndRouting.map
          )
        )
      : null;
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-3/7 grid grid-cols-1 items-center">
          <LayoutSelectionBar
            onUpload={handleMappingAndRoutingUpdate}
            setError={setError}
            setLoading={setLoading}
          />
          <div className="">
            {loading ? (
              <p>Loading ...</p>
            ) : error ? (
              <p>Error: {error.message} </p>
            ) : (
              <QubitGrid layout={layout} />
            )}
          </div>
          <div className="mb-4">
            <SliderComponent
              onSliderChange={handleSliderUpdate}
              maxSize={layerMax}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
