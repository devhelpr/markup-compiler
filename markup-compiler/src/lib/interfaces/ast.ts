export interface IASTNode {
  type: string;
  tagName: string;
}

export interface IASTIdentifierNode extends IASTNode {
  name: string;
}

export interface IASTTextNode extends IASTNode {
  value: string;
}

export interface IASTTree {
  type: string;
  tagName: string;
  body: IASTNode[] | IASTTree | false;
}
