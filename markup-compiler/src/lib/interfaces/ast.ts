export interface IASTNode {
  type: string;
}

export interface IASTIdentifierNode extends IASTNode {
  name: string;
}

export interface IASTTree {
  type: string;
  body: IASTTree | IASTNode | false;
}
