import React from "react";
import { Handle, Position } from "@xyflow/react";
import { NodeData, NodeType } from "../types/DagLayout";

interface GateGraphNodeProperties {
  data: NodeData;
}

const tileToColor = (data: NodeData) => {
  switch (data.type) {
    case NodeType.EXECUTED:
      return "bg-gray-300";
    case NodeType.UNEXECUTABLE:
      return "bg-white";
    case NodeType.EXECUTABLE:
      // return "bg-red-300";
      return getColorName(parseInt(data.label));
    case NodeType.QUBITSTART:
      return "bg-blue-200";
    default:
      return "bg-white";
  }
};

const getColorName = (index: number | null) => {
  const colors = [
    "bg-[#332288]",
    "bg-[#117733]",
    "bg-[#44AA99]",
    "bg-[#88CCEE]",
    "bg-[#DDCC77]",
    "bg-[#CC6677]",
    "bg-[#AA4499]",
    "bg-[#882255]",
  ];
  if (index == null) return colors[0];
  return colors[index % 8];
};

const GateGraphNode: React.FC<GateGraphNodeProperties> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className={`w-16 h-16 rounded-full border-2 border-gray-500 ${tileToColor(
          data
        )} flex items-center justify-center`}
      >
        <p>{data.label}</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default GateGraphNode;
