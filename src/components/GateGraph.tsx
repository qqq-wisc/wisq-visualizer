import React, { useEffect, useMemo } from "react";
import {
  Handle,
  ReactFlow,
  Position,
  ReactFlowProvider,
  useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { GateDAG, NodeType } from "../types/DagLayout";
import GateGraphNode from "./GateGraphNode";
import { TileLayout } from "../types/TileLayout";

interface GateGraphProperties {
  gateDag: GateDAG;
  layout: TileLayout;
}

const GateGraph: React.FC<GateGraphProperties> = ({ gateDag, layout }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(gateDag.nodes);

  useEffect(() => {
    setNodes((nds) =>
      gateDag.nodes.map((node) => {
        let type: NodeType = NodeType.UNEXECUTABLE;
        if (node.data["type"] == NodeType.QUBITSTART) {
          type = NodeType.QUBITSTART;
        } else if (layout.ids.includes(parseInt(node.id))) {
          type = NodeType.EXECUTABLE;
        }
        return {
          ...node,
          data: { ...node.data, type: type },
        };
      })
    );
  }, [layout]);

  const nodeTypes = useMemo(
    () => ({
      gateGraphNode: GateGraphNode,
    }),
    []
  );

  return (
    <>
      <div className="absolute inset-0">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={gateDag.edges}
            style={{ width: "100%", height: "100%" }}
            minZoom={0.001}
            nodeTypes={nodeTypes}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default GateGraph;
