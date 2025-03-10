import { useEffect, useState } from 'react'
import './App.css'
import QubitGrid from './components/QubitGrid'
import { TileLayout } from './types/TileLayout'
import { tileLayoutFromRouting } from './utils/TileLayoutParser';
import { MappingAndRouting } from './types/MappingAndRouting';

function App() {

  // Handle the async json parsing
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // hold the routing variables
  const [mappingAndRouting, setMappingAndRouting] = useState<MappingAndRouting | null>(null);
  const [layout, setLayout] = useState<TileLayout>(
    mappingAndRouting != null
    ? tileLayoutFromRouting(mappingAndRouting.steps[0], mappingAndRouting.arch, mappingAndRouting.map)
    : new TileLayout(5, 5)
  );

  // resolve the mapping and routing promise
  useEffect(() => {
    fetch("src/assets/out.json")
      .then(response => response.json() as Promise<MappingAndRouting>)
      .then((result) => {
        setMappingAndRouting(result);
        setLayout(tileLayoutFromRouting(result.steps[0], result.arch, result.map))
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.log("no");
      })
  }, []);

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className='rows-3'>
        <div>
        {
          loading
          ? <p>Loading ...</p>
          : error
            ? <p>Error: {error.message} </p>
            : <QubitGrid layout={layout} />
        }
        </div>
      </div>
    </div>
    </>
  )
}

export default App
