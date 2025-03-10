import { useState } from 'react'
import './App.css'
import QubitGrid from './components/qubitGrid'
import { TileLayout } from './types/TileLayout'

function App() {
  const [layout, setLayout] = useState(new TileLayout(3, 4))

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <QubitGrid layout={layout} />
    </div>
    </>
  )
}

export default App
