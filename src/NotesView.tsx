import { Empty, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { NotesActions } from './NotesActions';
import { useMarkAsRead } from './shared/readContext';
import { useGetContentAsHtml } from './shared/useGetContentAsHtml';

type NotesViewProps = {
  meetingPath: string | null;
};

export const NotesView: React.FC<NotesViewProps> = ({ meetingPath }) => {
  const [html, isLoading] = useGetContentAsHtml(meetingPath);
  const [lastMarkedAsRead, setLastMarkedAsRead] = useState<string | undefined>();
  const htmlObject = useMemo(() => html ? ({ __html: html } as const) : null, [html]);

  const markAsRead = useMarkAsRead();

  useEffect(() => {
    if (meetingPath && !isLoading && html && meetingPath !== lastMarkedAsRead) {
      setLastMarkedAsRead(meetingPath);
      markAsRead(meetingPath);
    }
  }, [meetingPath, isLoading, html, markAsRead, lastMarkedAsRead]);



  if (!meetingPath) {
    return <div className="notesView notesView--empty">
      Please select notes in the left-hand menu.
    </div>;
  }

  if (isLoading)
    return <div className="notesView notesView--loading">
      <Spin size='large' />;
    </div>;

  return <div className="notesView">
    <NotesActions meetingKey={meetingPath} />
    {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
    <div className="notesView-content" dangerouslySetInnerHTML={htmlObject!} />
  </div> ;
};