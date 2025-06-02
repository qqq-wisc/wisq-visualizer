import { useEffect, useState } from "react";
import "./App.css";
import QubitGrid from "./components/QubitGrid";
import { TileLayout } from "./types/TileLayout";
import { tileLayoutFromRouting } from "./utils/TileLayoutParser";
import { MappingAndRouting } from "./types/MappingAndRouting";
import SliderComponent from "./components/SliderComponent";
import LayoutSelectionBar from "./components/LayoutSelectionBar";
import GateGraph from "./components/GateGraph";
import { GateDAG } from "./types/DagLayout";
import { generateGateDag } from "./utils/GateDagGenerator";

function App() {
  // set the view type
  const [viewType, setViewType] = useState<number>(0);
  const changeView = () => setViewType((viewType + 1) % 3);

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
  const [dag, setDag] = useState<GateDAG>(
    mappingAndRouting != null
      ? generateGateDag(mappingAndRouting.gates, mappingAndRouting.map)
      : new GateDAG()
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
    setDag(generateGateDag(result.gates, result.map));
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
      <div className="flex flex-col justify-center h-screen w-screen bg-gray-100 overflow-hidden">
        <div className=" w-[60%] mx-auto">
          <LayoutSelectionBar
            onUpload={handleMappingAndRoutingUpdate}
            setError={setError}
            setLoading={setLoading}
            changeView={changeView}
          />
        </div>
        <div className="flex-1 min-h-0 relative w-full">
          {loading ? (
            <p>Loading ...</p>
          ) : error ? (
            <p>Error: {error.message} </p>
          ) : viewType == 0 ? (
            <QubitGrid layout={layout} sizePercentage={0.9} />
          ) : viewType == 1 ? (
            <GateGraph gateDag={dag} layout={layout} />
          ) : (
            <div className="flex h-full">
              <div className="w-1/2 relative">
                <QubitGrid layout={layout} sizePercentage={0.9} />
              </div>
              <div className="w-1/2 relative">
                <GateGraph gateDag={dag} layout={layout} />
              </div>
            </div>
          )}
        </div>
        <div className="p-3 w-[60%] mx-auto">
          <SliderComponent
            onSliderChange={handleSliderUpdate}
            maxSize={layerMax}
          />
        </div>
      </div>
    </>
  );
}

export default App;
