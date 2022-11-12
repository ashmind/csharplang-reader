import { Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { NotesViewActions } from './NotesViewActions';
import { useMarkAsRead } from '../shared/readState';
import { useTheme } from '../shared/themeState';
import { useGetContentAsHtml } from '../shared/useGetContentAsHtml';

type NotesViewProps = {
  meetingPath: string | null;
};

export const NotesView: React.FC<NotesViewProps> = ({ meetingPath }) => {
  const [html, isLoading] = useGetContentAsHtml(meetingPath);
  const [lastMarkedAsRead, setLastMarkedAsRead] = useState<string | undefined>();
  const htmlObject = useMemo(() => html ? ({ __html: html } as const) : null, [html]);

  const markAsRead = useMarkAsRead();
  const theme = useTheme();

  useEffect(() => {
    if (meetingPath && !isLoading && html && meetingPath !== lastMarkedAsRead) {
      setLastMarkedAsRead(meetingPath);
      markAsRead(meetingPath);
    }
  }, [meetingPath, isLoading, html, markAsRead, lastMarkedAsRead]);

  const [stateName, content] = (() => {
    if (!meetingPath)
      return ['empty', <span key="_" className="notesView-emptyText">Please select notes in the left-hand menu.</span>] as const;

    if (isLoading)
      return ['loading', <Spin key="_" size='large' />] as const;

    return ['loaded', <>
      <NotesViewActions meetingPath={meetingPath} />
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <div className="notesView-content" dangerouslySetInnerHTML={htmlObject!} />
    </>];
  })();

  return <div className={`notesView notesView--${theme} notesView--${stateName}`}>
    {content}
  </div>;
};