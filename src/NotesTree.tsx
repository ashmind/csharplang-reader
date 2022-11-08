import { Spin, Tree, TreeDataNode } from "antd";
import React, { useMemo } from "react";
import { groupMeetingsToTree } from "./shared/groupMeetingsToTree";
import type { MeetingNode } from "./shared/MeetingNode";
import { REPO } from "./shared/repo";
import { useOctokit } from "./shared/useOctokit";

type NotesTreeProps = {
  onMeetingSelected: (path: string) => void;
};

type NotesNode = TreeDataNode & ({
  type?: undefined
} | MeetingNode);

export const NotesTree: React.FC<NotesTreeProps> = ({ onMeetingSelected }) => {
  const [data, error, isLoading] = useOctokit(['tree'], o => o.rest.git.getTree({
    ...REPO,
    tree_sha: 'main',
    recursive: 'true',
  }));

  const notes = useMemo(() => {
    if (!data)
      return [];

    const { tree } = data.data;
    const meetingPaths = tree
      .map(n => n.path!)
      .filter(p => p.includes('meetings/'));

    return groupMeetingsToTree(meetingPaths);
  }, [data])

  if (isLoading)
    return <Spin />;

  return <Tree.DirectoryTree<NotesNode>
    className="notesTree"
    treeData={notes}
    onSelect={(_, { node }) => {
      if (node.type !== 'meeting')
        return;

      onMeetingSelected(node.path);
    }} />;
};