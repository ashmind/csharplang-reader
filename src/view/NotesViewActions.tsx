import type React from 'react';
import { Button } from 'antd';
import { ReadOutlined, ReadFilled, BulbOutlined, BulbFilled, GithubOutlined } from '@ant-design/icons';
import { useIsUnread, useMarkAsRead, useMarkAsUnread } from '../shared/readState';
import { useTheme, useToggleTheme } from '../shared/themeState';

type NotesViewActionsProps = {
  meetingPath: string | null;
};

export const NotesViewActions: React.FC<NotesViewActionsProps> = ({ meetingPath }) => {
  const isUnread = useIsUnread();
  const markAsRead = useMarkAsRead();
  const markAsUnread = useMarkAsUnread();

  const theme = useTheme();
  const toggleTheme = useToggleTheme();

  const markButton = meetingPath && (isUnread(meetingPath)
    ? <Button type="text" onClick={() => markAsRead(meetingPath)}><ReadOutlined /> Mark as read</Button>
    : <Button type="text" onClick={() => markAsUnread(meetingPath)}><ReadFilled /> Mark as unread</Button>);

  return <div className="notesViewActions">
    {markButton}
    <Button type="text" target='_blank' href={`https://github.com/dotnet/csharplang/blob/main/${meetingPath}`}>
      <GithubOutlined /> Open in GitHub
    </Button>
    <Button type="text" onClick={() => toggleTheme()}>
      {theme === 'dark' ? <><BulbOutlined /> Light mode</> : <><BulbFilled /> Dark mode</>}
    </Button>
  </div>;
};