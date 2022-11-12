import type React from 'react';
import { Button } from 'antd';
import { useIsUnread, useMarkAllAsRead } from '../shared/readState';
import { EyeOutlined, ReadOutlined } from '@ant-design/icons';
import type { MenuItemFilter } from './MenuItemFilter';

type MainMenuActionsProps = {
  allMeetingPaths: readonly string[];
  filter: MenuItemFilter;
  onFilterToggle: () => void;
};

export const MainMenuActions: React.FC<MainMenuActionsProps> = ({ allMeetingPaths, filter, onFilterToggle }) => {
  const isUnread = useIsUnread();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = allMeetingPaths.filter(isUnread).length;

  return <div className="mainMenuActions">
    <Button type="text" onClick={() => onFilterToggle()}>
      <EyeOutlined />
      {filter === 'all' ? 'Filter: All' : 'Filter: Unread' }
    </Button>
    {unreadCount >= 3 && <Button type="text" onClick={() => markAllAsRead(allMeetingPaths)}>
      <ReadOutlined /> Mark all as read
    </Button>}
  </div>;
};