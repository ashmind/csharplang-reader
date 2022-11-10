import { Empty, Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { NotesActions } from './NotesActions';
import { useMarkAsRead } from './shared/readContext';
import { useGetContentAsHtml } from './shared/useGetContentAsHtml';

type NotesViewProps = {
  meetingPath: string | null;
};

export const NotesView: React.FC<NotesViewProps> = ({ meetingPath }) => {
  const [html, error, isLoading] = useGetContentAsHtml(meetingPath);
  const htmlObject = useMemo(() => html ? ({ __html: html } as const) : null, [html]);

  const markAsRead = useMarkAsRead();

  useEffect(() => {
    if (meetingPath && !isLoading && html && !error)
      markAsRead(meetingPath);
  }, [meetingPath, isLoading, error, html, markAsRead]);

  if (!meetingPath)
    return <Empty />;

  if (isLoading)
    return <Spin size='large' />;

  return <div className="notesView">
    <NotesActions meetingKey={meetingPath} />
    <div className="notesView-content" dangerouslySetInnerHTML={htmlObject!} />
  </div> ;
};