export const NODE_KEY_TOP_LDM = 'ldm';
export const NODE_KEY_TOP_WGS = 'wgs';

export type MeetingNodeData = Readonly<{
  path: string;
  title: string;
  type: 'meeting';
}>;

export type GroupNodeData = Readonly<{
  key: string;
  title: string;
  type: 'group';
  subtype: 'top-group' | 'sub-group';
  children: readonly NodeData[];
}>;

export type NodeData = MeetingNodeData | GroupNodeData;