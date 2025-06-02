import React, { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  Node,
  useReactFlow,
  useViewport,
  FitViewOptions,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { GateDAG, NodeType } from "../types/DagLayout";
import GateGraphNode from "./GateGraphNode";
import { TileLayout } from "../types/TileLayout";

interface GateGraphProperties {
  gateDag: GateDAG;
  layout: TileLayout;
}

const GateGraphInner: React.FC<GateGraphProperties> = ({ gateDag, layout }) => {
  const [nodes, setNodes] = useNodesState(gateDag.nodes);
  const [previousNodes, setPreviousNodes] = useState<Set<String>>(new Set());
  const { fitView, } =
    useReactFlow();
  const { zoom } = useViewport();

  useEffect(() => {
    const layoutIds = new Set(layout.ids.map(String));
    let addNodes: Node[] = [];
    setNodes(() => {
      return gateDag.nodes.map((node) => {
        if (previousNodes.has(node.id) || layoutIds.has(node.id)) {
          let type: NodeType = NodeType.UNEXECUTABLE;
          if (node.data["type"] == NodeType.QUBITSTART) {
            type = NodeType.QUBITSTART;
          } else if (layoutIds.has(node.id)) {
            type = NodeType.EXECUTABLE;
          }
          if (type == NodeType.EXECUTABLE) {
            addNodes.push(node);
          }
          return {
            ...node,
            data: { ...node.data, type: type },
          };
        }
        return node;
      });
    });
    setPreviousNodes(layoutIds);

    setTimeout(() => {
      fitView({
        nodes: addNodes,
        padding: 0.5,
        duration: 200,
        minZoom: zoom,
        maxZoom: zoom,
      } as FitViewOptions);
    }, 0);
  }, [layout]);

  const nodeTypes = useMemo(
    () => ({
      gateGraphNode: GateGraphNode,
    }),
    []
  );

  return (
    <div className="absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={gateDag.edges}
        style={{ width: "100%", height: "100%" }}
        minZoom={0.001}
        nodeTypes={nodeTypes}
      />
    </div>
  );
};

const GateGraph: React.FC<GateGraphProperties> = (props) => {
  return (
    <ReactFlowProvider>
      <GateGraphInner {...props} />
    </ReactFlowProvider>
  );
};

export default GateGraph;
