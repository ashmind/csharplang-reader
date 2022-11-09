import type { GroupNodeData, MeetingNodeData } from "./NodeData";

const getMeetingNode = (path: string): MeetingNodeData => {
  const title = path
    .match(/[^\/]+$/)![0]
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
      type: 'group'
    } as GroupNodeData));

  const workingGroupNodes = allPaths
    .flatMap(extractMatch(/^meetings\/working-groups\/([^/]+)$/))
    .map(([path, key]) => ({
      key: `wg-${key}`,
      title: key,
      children: getChildNodes(path),
      type: 'group'
    } as GroupNodeData))


  return [
    { key: "ldm", title: "LDM", children: ldmYearNodes, type: 'group' },
    { key: "wgs", title: "Working Groups", children: workingGroupNodes, type: 'group' }
  ];
};