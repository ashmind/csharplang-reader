import type { MeetingNode } from "./MeetingNode";

const getMeetingNode = (path: string): MeetingNode => {
  const title = path
    .match(/[^\/]+$/)![0]
    .replace(/\.md$/, '');

  return { key: path, title, path, type: 'meeting', isLeaf: true };
};

const extractMatch = (pattern: RegExp) => (path: string) => {
  const match = path.match(pattern);
  return match ? [[path, match[1]]] as const : [];
};

export const groupMeetingsToTree = (allPaths: readonly string[]) => {
  const getChildNodes = (parent: string) => allPaths
      .filter(m => m.startsWith(parent + '/'))
      .map(getMeetingNode);

  const ldmYearNodes = allPaths
    .flatMap(extractMatch(/^meetings\/(\d{4})$/))
    .map(([path, year]) => ({
      key: `ldm-${year}`,
      title: year,
      children: getChildNodes(path)
    }));

  const workingGroupNodes = allPaths
    .flatMap(extractMatch(/^meetings\/working-groups\/([^/]+)$/))
    .map(([path, key]) => ({
      key: `wg-${key}`,
      title: key,
      children: getChildNodes(path)
    }))


  return [
    { key: "ldm", title: "LDM", children: ldmYearNodes },
    { key: "wgs", title: "Working Groups", children: workingGroupNodes }
  ];
};