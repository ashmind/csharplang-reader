import { Empty, Spin } from "antd";
import React, { useMemo } from "react";
import { NotesActions } from "./NotesActions";
import { useGetContentAsHtml } from "./shared/useGetContentAsHtml";

type NotesViewProps = {
  meetingPath: string | null;
};

export const NotesView: React.FC<NotesViewProps> = ({ meetingPath }) => {
  const [html, error, isLoading] = useGetContentAsHtml(meetingPath);
  const htmlObject = useMemo(() => html ? ({ __html: html } as const) : null, [html]);

  if (!meetingPath)
    return <Empty />;

  if (isLoading)
    return <Spin />;

  return <div className="notesView">
    <NotesActions meetingKey={meetingPath} />
    <div className="notesView-content" dangerouslySetInnerHTML={htmlObject!} />
  </div> ;
};