import type React from 'react';
import type { NodeData } from './shared/NodeData';

type MenuItemTitleProps = {
  data: NodeData;
  isUnread: boolean;
};

export const MenuItemTitle: React.FC<MenuItemTitleProps> = ({ data, isUnread }) => {
  return <span className={'menuItemTitle' + (isUnread ? ' menuItemTitle--unread' : '')}>
    {data.title}
    {isUnread && <span className='menuItemTitle-unreadMarker' />}
  </span>;
};