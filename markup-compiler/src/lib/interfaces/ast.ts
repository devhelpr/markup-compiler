export interface IASTNode {
  type: string;
  tagName: string;
  properties?: IPropertyValue[];
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
  properties?: IPropertyValue[];
  body: IASTNode[] | IASTTree | false;
}

export interface IPropertyValue {
  propertyName: string;
  value: string;
}
