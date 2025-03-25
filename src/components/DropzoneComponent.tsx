import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MappingAndRouting, MRFile } from "../types/MappingAndRouting";

interface DropzoneProperties {
  onUpload: (newFile: MRFile) => void;
  onLayoutNameChange: (newName: string) => void;
}

// This hook is almost all AI, I just wanted an out of the box solution
const DropzoneComponent: React.FC<DropzoneProperties> = ({
  onUpload,
  onLayoutNameChange,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Process the uploaded file
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("File reading was aborted");
      reader.onerror = () => console.log("File reading failed");

      reader.onload = () => {
        // Parse the file content as JSON
        const fileContent = reader.result as string;
        try {
          const jsonData: MappingAndRouting = JSON.parse(fileContent);
          const newFile: MRFile = {
            mappingAndRouting: jsonData,
            name: file.name,
          } as MRFile;
          onUpload(newFile);
          onLayoutNameChange(newFile.name);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      // Read the file as text
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"], // Only accept JSON files
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-color-black p-5 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      <p>Drop your own file here</p>
    </div>
  );
};

export default DropzoneComponent;
