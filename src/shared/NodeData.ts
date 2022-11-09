export type MeetingNodeData = Readonly<{
  path: string;
  title: string;
  type: 'meeting';
}>

export type GroupNodeData = Readonly<{
  key: string;
  title: string;
  type: 'group';
  children: readonly NodeData[];
}>

export type NodeData = MeetingNodeData | GroupNodeData;