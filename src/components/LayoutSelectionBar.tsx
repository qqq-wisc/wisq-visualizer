import React, { useState } from "react";
import LayoutSelector from "./LayoutSelector";
import DropzoneComponent from "./DropzoneComponent";
import { MappingAndRouting, MRFile } from "../types/MappingAndRouting";

interface layoutSelectionBar {
  onUpload: (mappingAndRouting: MappingAndRouting) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

const LayoutSelectionBar: React.FC<layoutSelectionBar> = ({
  onUpload,
  setLoading,
  setError,
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
        <div></div>
        <DropzoneComponent
          onUpload={handleFileUpload}
          onLayoutNameChange={handleLayoutNameChange}
        />
      </div>
    </>
  );
};

export default LayoutSelectionBar;
