import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MappingAndRouting } from "../types/MappingAndRouting";

interface DropzoneProperties {
  onUpload: (mappingAndRouting: MappingAndRouting) => void;
}

// This hook is almost all AI, I just wanted an out of the box solution
const DropzoneComponent: React.FC<DropzoneProperties> = ({ onUpload }) => {
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

          onUpload(jsonData);
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
      style={{
        border: "2px dashed #007bff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input {...getInputProps()} />
      <p>Drag 'n' drop a JSON file here, or click to select one</p>
    </div>
  );
};

export default DropzoneComponent;
