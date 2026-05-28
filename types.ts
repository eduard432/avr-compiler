export type Field =
  | { type: "const"; value: number; size: number }
  | { type: "operand"; name: string; size: number }
  | { type: "computed"; name: string; size: number; map: (args: any) => number };

export type InstructionDef = {
  name: string;
  operands: {
    name: string;
    parse: (token: string) => any;
  }[];
  fields: Field[];
  validate?: (args: any) => void;

};

export type Symbols = {
    defs: Record<string, number>;
    equs: Record<string, number>;
}

export type Labels = Record<string, number>

export type Context = {
  symbols: {
    defs: Record<string, number>
    equs: Record<string, number>
  }
  labels: Record<string, number>
  address: number
}