import { Spin, Tree, TreeDataNode } from "antd";
import React, { useMemo } from "react";
import { groupMeetingsIntoTree } from "./shared/groupMeetingsIntoTree";
import type { NodeData } from "./shared/NodeData";
import { REPO } from "./shared/repo";
import { useOctokit } from "./shared/useOctokit";
import { useIsUnread, useMarkAsRead } from "./shared/readContext";

type NotesTreeProps = {
  onMeetingSelected: (path: string) => void;
};

type Node = TreeDataNode & {
  data: NodeData;
  isUnread: boolean;
}

export const NotesTree: React.FC<NotesTreeProps> = ({ onMeetingSelected }) => {
  const [data, error, isLoading] = useOctokit(['tree'], o => o.rest.git.getTree({
    ...REPO,
    tree_sha: 'main',
    recursive: 'true',
  }));

  const isUnread = useIsUnread();
  const markAsRead = useMarkAsRead();

  const treeData = useMemo(() => {
    if (!data)
      return [];

    const { tree } = data.data;
    const meetingPaths = tree
      .map(n => n.path!)
      .filter(p => p.includes('meetings/'));

    return groupMeetingsIntoTree(meetingPaths);
  }, [data]);

  const treeNodes = useMemo(() => {
    const mapToNode = (data: NodeData): Node => {
      const children = data.type === 'group' ? mapToNodes(data.children) : [];
      const isUnreadNode = data.type === 'meeting'
        ? isUnread(data.path)
        : children.some(c => c.isUnread);

      return ({
        key: data.type === 'meeting' ? data.path : data.key,
        title: <span className={isUnreadNode ? 'notesTree-node--unread' : ''}>{data.title}</span>,
        isLeaf: data.type === 'meeting',
        selectable: data.type === 'meeting',
        children,
        data,
        isUnread: isUnreadNode
      });
    };

    const mapToNodes = (data: readonly NodeData[]) => data.map(mapToNode);

    return mapToNodes(treeData);
  }, [treeData, isUnread]);

  if (isLoading)
    return <Spin />;

  return <Tree.DirectoryTree<Node>
    className="notesTree"
    treeData={treeNodes}
    onSelect={(_, { node }) => {
      if (node.data.type !== 'meeting')
        return;

      onMeetingSelected(node.data.path);
      markAsRead(node.data.path);
    }} />;
};