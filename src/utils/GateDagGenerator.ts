import { GateDAG, GateNode, NodeData, NodeType } from "../types/DagLayout";
import {
  Mapping,
  Gate,
} from "../types/MappingAndRouting";
import { type Edge, type Node } from "@xyflow/react";

export const positionMultiplier: number = 100;

function createQubitNodes(mapping: Mapping): Node[] {
  let nodes: Node[] = [];
  Object.keys(mapping).forEach((value) => {
    nodes.push({
      id: `Q${value}`,
      type: "gateGraphNode",
      data: {
        label: `Q${value}`,
        type: NodeType.QUBITSTART,
      } as NodeData,
      position: {
        x: parseInt(value) * positionMultiplier,
        y: 0,
      },
    } as Node);
  });
  return nodes;
}

function gateNodeToNode(node: GateNode): Node {
  return {
    id: `${node.id}`,
    type: "gateGraphNode",
    data: {
      label: `${node.id}`,
      type:
        // node.parents.length == 0 ? NodeType.EXECUTABLE : NodeType.UNEXECUTABLE,
        NodeType.UNEXECUTABLE,
    } as NodeData,
    position: {
      x: node.gate[0] * positionMultiplier,
      y: node.depth * positionMultiplier,
    },
  } as Node;
}

function createEdge(
  parentId: string,
  childId: string,
  qubit: number,
  edgeCounter: number[]
): Edge {
  edgeCounter[qubit] += 1;
  return {
    id: `Q${qubit}-${edgeCounter[qubit]}`,
    source: parentId,
    target: childId,
  } as Edge;
}

export function generateGateDag(gates: Gate[], mapping: Mapping): GateDAG {
  let qubitTable: (GateNode | null)[] = new Array(
    Object.keys(mapping).length
  ).fill(null);
  let dag: GateDAG = new GateDAG();
  dag.qubits = Object.keys(mapping).length;
  let edgeCounter: number[] = new Array(dag.qubits).fill(0);
  dag.nodes.push(...createQubitNodes(mapping));

  gates.forEach((gate, i) => {
    let currentNode: GateNode = new GateNode(gate, i);

    // Check if the qubit is a root
    if (gate.every((qubit) => qubitTable[qubit] === null)) {
      dag.updateRoots(currentNode);
      gate.forEach((qubit) => {
        qubitTable[qubit] = currentNode;
        dag.edges.push(
          createEdge(`Q${qubit}`, currentNode.id.toString(), qubit, edgeCounter)
        );
      });
      dag.nodes.push(gateNodeToNode(currentNode));
      return;
    }
    // console.log(gate.every((qubit) => qubitTable[qubit] === null));

    // Adjust qubit table for each qubit
    gate.forEach((qubit) => {
      // Check if the qubit has been used yet
      if (qubitTable[qubit] === null) {
        qubitTable[qubit] = currentNode;
        dag.edges.push(
          createEdge(`Q${qubit}`, currentNode.id.toString(), qubit, edgeCounter)
        );
        dag.nodes.push(gateNodeToNode(currentNode));
        return;
      }
      // If the qubit has been used, update it and create parent-child relationship
      // with old node
      let previousNode: GateNode = qubitTable[qubit];
      previousNode.updateChildren(currentNode);
      currentNode.updateParents(previousNode, dag);
      qubitTable[qubit] = currentNode;
      dag.nodes.push(gateNodeToNode(currentNode));
      dag.edges.push(
        createEdge(
          previousNode.id.toString(),
          currentNode.id.toString(),
          qubit,
          edgeCounter
        )
      );
    });
  });

  return dag;
}

export function updateExecutableSet(
  currentExecutable: GateNode[],
  executingNode: GateNode,
  executed: Set<GateNode>
): GateNode[] {
  let newExecutable: GateNode[] = currentExecutable.filter(
    (node) => node !== executingNode
  );

  executingNode.children.forEach((child) => {
    // a child node is executable if every one of it's parents have been executed
    const validParents: boolean = child.parents.every((parent) =>
      executed.has(parent)
    );

    if (validParents) newExecutable.push(child);
  });

  return newExecutable;
}
