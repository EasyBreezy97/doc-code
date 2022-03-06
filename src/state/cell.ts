export type CellTypes = "code" | "cell";

export interface Cell {
    id: string;
    type: CellTypes;
    content: string;
}
