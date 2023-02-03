export interface IASTTree {
  body: IASTTreeNode;
}

export interface IASTTreeNode {
  type: 'Markup' | 'TEXT' | 'EXPRESSION';
  tagName: string;
  properties?: IASTTreeProperty[];
  body?: IASTTreeNode[];
  value?: string;
}

export interface IASTTreeProperty {
  propertyName: string;
  isASTTreeNode?: boolean;
  value: string | IASTTreeNode;
}
