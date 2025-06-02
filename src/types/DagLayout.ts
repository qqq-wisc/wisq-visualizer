import { type Edge, type Node } from "@xyflow/react";
import { Gate } from "./MappingAndRouting";

export class GateNode {
  parents: GateNode[];
  children: GateNode[];
  gate: Gate;
  id: number;
  depth: number;

  constructor(gate: Gate, id: number) {
    this.parents = [];
    this.children = [];
    this.gate = gate;
    this.id = id;
    this.depth = 1;
  }

  updateParents(parent: GateNode, dag: GateDAG) {
    this.parents.push(parent);
    if (parent.depth + 1 > this.depth) {
      this.depth = parent.depth + 1;
      if (this.depth > dag.totalDepth) {
        dag.totalDepth = this.depth;
      }
    }
  }

  updateChildren(child: GateNode) {
    this.children.push(child);
  }
}

export class GateDAG {
  roots: GateNode[];
  nodes: Node[];
  edges: Edge[];
  totalDepth: number;

  constructor() {
    this.roots = [];
    this.nodes = [];
    this.edges = [];
    this.totalDepth = 0;
  }

  updateRoots(newRoot: GateNode) {
    this.roots.push(newRoot);
  }

  getExecutableSubset(): GateNode[] {
    return this.roots;
  }
}

export enum NodeType {
  EXECUTED,
  EXECUTABLE,
  UNEXECUTABLE,
  QUBITSTART,
}

export type NodeData = { label: string; type: NodeType };
