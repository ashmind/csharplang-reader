import { GroupNodeData, MeetingNodeData, NODE_KEY_TOP_LDM, NODE_KEY_TOP_WGS } from './NodeData';

const formatWorkingGroupTitle = (key: string) => {
  return key
    .replace(/(?:^|-)([a-z])/g, m => m.toUpperCase())
    .replace(/-/g, ' ');
};

const getMeetingNode = (path: string): MeetingNodeData => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const title = path
    .match(/[^/]+$/)![0]
    .replace(/\.md$/, '');

  return { path, title, type: 'meeting' };
};

const extractMatch = (pattern: RegExp) => (path: string) => {
  const match = path.match(pattern);
  return match ? [[path, match[1]]] as const : [];
};

export const groupMeetingsIntoTree = (allPaths: readonly string[]): readonly GroupNodeData[] => {
  const getChildNodes = (parent: string): readonly MeetingNodeData[] => allPaths
      .filter(m => m.startsWith(parent + '/'))
      .map(getMeetingNode);

  const ldmYearNodes = allPaths
    .flatMap(extractMatch(/^meetings\/(\d{4})$/))
    .map(([path, year]) => ({
      key: `ldm-${year}`,
      title: year,
      children: getChildNodes(path),
      type: 'group',
      subtype: 'sub-group'
    } as GroupNodeData));

  const workingGroupNodes = allPaths
    .flatMap(extractMatch(/^meetings\/working-groups\/([^/]+)$/))
    .map(([path, key]) => ({
      key: `wg-${key}`,
      title: formatWorkingGroupTitle(key),
      children: getChildNodes(path),
      type: 'group',
      subtype: 'sub-group'
    } as GroupNodeData));


  return [
    { key: NODE_KEY_TOP_LDM, title: 'LDM', children: ldmYearNodes, type: 'group', subtype: 'top-group' },
    { key: NODE_KEY_TOP_WGS, title: 'Working Groups', children: workingGroupNodes, type: 'group', subtype: 'top-group' }
  ];
};