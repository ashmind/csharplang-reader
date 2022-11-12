import { Menu, MenuProps, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { groupMeetingsIntoTree } from './groupMeetingsIntoTree';
import type { NodeData } from './NodeData';
import { REPO } from '../shared/repo';
import { useOctokit } from '../shared/useOctokit';
import { useIsUnread } from '../shared/readState';
import { MenuItemTitle } from './MenuItemTitle';
import { MainMenuActions } from './MainMenuActions';
import type { MenuItemFilter } from './MenuItemFilter';

const FILTER_STORAGE_KEY = 'app.filter';
const initialFilter = (localStorage.getItem(FILTER_STORAGE_KEY) as MenuItemFilter | null) ?? 'all';

type MainMenuProps = {
  selectedMeetingPath: string | null;
  onMeetingSelect: (path: string) => void;
};

type MenuItem = Required<MenuProps>['items'][number];

type MenuItemWithUnreadState = MenuItem & {
  isUnread: boolean;
};

export const MainMenu: React.FC<MainMenuProps> = ({ selectedMeetingPath, onMeetingSelect }) => {
  const [data, isLoading] = useOctokit(['tree'], o => o.rest.git.getTree({
    ...REPO,
    tree_sha: 'main',
    recursive: 'true',
  }));

  const [filter, setFilter] = useState<MenuItemFilter>(initialFilter);
  useEffect(() => localStorage.setItem(FILTER_STORAGE_KEY, filter), [filter]);

  const getIsUnread = useIsUnread();

  const filteredItems = useMemo(() => {
    if (!data)
      return [];

    return data.data.tree
      .filter(t => t.path?.includes('meetings/') && (t.type === 'tree' || t.path?.endsWith('.md')));
  }, [data]);

  const treeData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return groupMeetingsIntoTree(filteredItems.map(i => i.path!));
  }, [filteredItems]);

  const allMeetingPaths = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return filteredItems.filter(i => i.type !== 'tree').map(i => i.path!);
  }, [filteredItems]);

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

    const mapItems = (data: readonly NodeData[]) => data
      .map(mapItem)
      .filter(i => filter === 'all' || i.isUnread || i.key === selectedMeetingPath);

    return [mapItems(treeData), meetingKeys];
  }, [treeData, getIsUnread, filter, selectedMeetingPath]);

  if (isLoading)
    return <Spin />;

  return <div className="mainMenu">
    <MainMenuActions
      allMeetingPaths={allMeetingPaths}
      filter={filter}
      onFilterToggle={() => setFilter(f => f === 'all' ? 'unread' : 'all')} />
    <Menu
      className="mainMenu-menu"
      items={menuItems}
      mode="inline"
      theme="dark"
      onSelect={item => {
        if (!meetingKeys.has(item.key))
          return;

        onMeetingSelect(item.key);
      }}
    />
  </div>;
};