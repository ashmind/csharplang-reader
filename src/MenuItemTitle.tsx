import type React from 'react';
import { CommentOutlined, TeamOutlined } from '@ant-design/icons';
import { GroupNodeData, NodeData, NODE_KEY_TOP_LDM, NODE_KEY_TOP_WGS } from './shared/NodeData';

type MenuItemTitleProps = {
  data: NodeData;
  isUnread: boolean;
};

export const MenuItemTitle: React.FC<MenuItemTitleProps> = ({ data, isUnread }) => {
  const getTopLevelIcon = (data: GroupNodeData) => {
    if (data.key === NODE_KEY_TOP_LDM)
      return <CommentOutlined className='menuItemTitle-topLevelIcon' />;
    if (data.key === NODE_KEY_TOP_WGS)
      return <TeamOutlined className='menuItemTitle-topLevelIcon' />;
  };

  return <span className={'menuItemTitle' + (isUnread ? ' menuItemTitle--unread' : '')}>
    {data.type === 'group' && getTopLevelIcon(data)}
    {data.title}
    {isUnread && <span className='menuItemTitle-unreadMarker' />}
  </span>;
};