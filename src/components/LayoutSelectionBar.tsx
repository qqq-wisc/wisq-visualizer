import React, { useState } from "react";
import LayoutSelector from "./LayoutSelector";
import DropzoneComponent from "./DropzoneComponent";
import { MappingAndRouting, MRFile } from "../types/MappingAndRouting";

interface layoutSelectionBar {
  onUpload: (mappingAndRouting: MappingAndRouting) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  changeView: () => void;
}

const LayoutSelectionBar: React.FC<layoutSelectionBar> = ({
  onUpload,
  setLoading,
  setError,
  changeView,
}) => {
  // Handle uploaded files
  const [uploadedFiles, setUploadedPaths] = useState<{ [key: string]: MRFile }>(
    {}
  );
  const handleFileUpload = (newFile: MRFile) => {
    setUploadedPaths((prev) => ({ ...prev, [newFile.name]: newFile }));
    onUpload(newFile.mappingAndRouting);
  };

  // handle presets
  const presetLayoutNames: string[] = [
    "3_17_13",
    "continuous_3_17_13_compact",
    "qft_20_scmr",
  ];
  const [layoutName, setLayoutName] = useState<string>(presetLayoutNames[0]);
  const handleLayoutNameChange = (newName: string) => {
    setLayoutName(newName);
  };

  return (
    <>
      <div className="grid grid-cols-3 mt-4 items-center justify-center">
        <LayoutSelector
          onUpload={onUpload}
          setError={setError}
          setLoading={setLoading}
          uploadedFiles={uploadedFiles}
          layoutName={layoutName}
          onLayoutNameChange={handleLayoutNameChange}
        />
        <div className="flex items-center justify-center">
          <button
            onClick={changeView}
            className="w-4/5 py-2 border-2 border-gray-500 text-gray-500 bg-gray-200
                rounded-lg active:bg-gray-500 active:border-gray-200 active:text-gray-200"
          >
            Change View
          </button>
        </div>
        <DropzoneComponent
          onUpload={handleFileUpload}
          onLayoutNameChange={handleLayoutNameChange}
        />
      </div>
    </>
  );
};

export default LayoutSelectionBar;
