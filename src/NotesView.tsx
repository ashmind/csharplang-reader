import { Empty, Spin } from "antd";
import React, { useMemo } from "react";
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

  return <div className="notesView" dangerouslySetInnerHTML={htmlObject!} />;
};