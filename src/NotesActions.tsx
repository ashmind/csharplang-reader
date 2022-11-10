import type React from 'react';
import { Button } from 'antd';
import { ReadOutlined, ReadFilled } from '@ant-design/icons';
import { useIsUnread, useMarkAsRead, useMarkAsUnread } from './shared/readContext';

type NotesActionsProps = {
  meetingKey: string | null;
};

export const NotesActions: React.FC<NotesActionsProps> = ({ meetingKey }) => {
  const isUnread = useIsUnread();
  const markAsRead = useMarkAsRead();
  const markAsUnread = useMarkAsUnread();

  const markButton = meetingKey && (isUnread(meetingKey)
    ? <Button type="text" onClick={() => markAsRead(meetingKey)}><ReadOutlined /> Mark as read</Button>
    : <Button type="text" onClick={() => markAsUnread(meetingKey)}><ReadFilled /> Mark as unread</Button>);

  return <div className="notesActions">
    {markButton}
  </div>;
};