export interface MappingAndRouting {
  map: Mapping;
  steps: Routing[][];
  arch: Architecture;
}

export interface Mapping {
  [key: string]: number;
}

export interface Routing {
  id: number;
  op: string;
  qubits: number[];
  path: number[];
}

export interface Architecture {
  height: number;
  width: number;
  alg_qubits: number[];
  magic_states: number[];
}

// Used to save uploaded files
export interface MRFile {
  mappingAndRouting: MappingAndRouting;
  name: string;
}
