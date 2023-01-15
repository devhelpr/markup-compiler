export interface IASTNode {
  type: string;
}

export interface IASTIdentifierNode extends IASTNode {
  name: string;
}

export interface IASTTextNode extends IASTNode {
  value: string;
}

export interface IASTTree {
  type: string;
  body: IASTTree | IASTTextNode | false;
}
