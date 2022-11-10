import { Menu, MenuProps, Spin } from 'antd';
import React, { useMemo } from 'react';
import { groupMeetingsIntoTree } from './shared/groupMeetingsIntoTree';
import type { NodeData } from './shared/NodeData';
import { REPO } from './shared/repo';
import { useOctokit } from './shared/useOctokit';
import { useIsUnread } from './shared/readContext';
import { MenuItemTitle } from './MenuItemTitle';

type MainMenuProps = {
  onMeetingSelected: (path: string) => void;
};

type MenuItem = Required<MenuProps>['items'][number];

type MenuItemWithUnreadState = MenuItem & {
  isUnread: boolean;
};

export const MainMenu: React.FC<MainMenuProps> = ({ onMeetingSelected }) => {
  const [data, error, isLoading] = useOctokit(['tree'], o => o.rest.git.getTree({
    ...REPO,
    tree_sha: 'main',
    recursive: 'true',
  }));

  const getIsUnread = useIsUnread();

  const treeData = useMemo(() => {
    if (!data)
      return [];

    const { tree } = data.data;
    const meetingPaths = tree
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(n => n.path!)
      .filter(p => p.includes('meetings/'));

    return groupMeetingsIntoTree(meetingPaths);
  }, [data]);

  const [menuItems, meetingKeys] = useMemo(() => {
    const meetingKeys = new Set<string>;

    const mapItem = (data: NodeData): MenuItemWithUnreadState => {
      if (data.type === 'group') {
        const children = mapItems(data.children);
        const hasUnreadChild = children.some(c => c.isUnread);
        return {
          key: data.key,
          type: data.subtype === 'top-group' ? 'group' : undefined,
          label: <MenuItemTitle data={data} isUnread={hasUnreadChild} />,
          children,
          isUnread: hasUnreadChild
        };
      }

      const isUnread = getIsUnread(data.path);
      meetingKeys.add(data.path);

      return {
        key: data.path,
        label: <MenuItemTitle data={data} isUnread={isUnread} />,
        isUnread
      };
    };

    const mapItems = (data: readonly NodeData[]) => data.map(mapItem);

    return [mapItems(treeData), meetingKeys];
  }, [treeData, getIsUnread]);

  if (isLoading)
    return <Spin />;

  return <Menu
    items={menuItems}
    mode="inline"
    theme="dark"
    onSelect={item => {
      if (!meetingKeys.has(item.key))
        return;

      onMeetingSelected(item.key);
    }}
  />;
};