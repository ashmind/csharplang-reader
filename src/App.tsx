import React, { useState } from 'react';
import { Alert } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotesTree } from './NotesTree';
import { NotesView } from './NotesView';

const queryClient = new QueryClient();

export const App: React.FC<{}> = () => {
  const [selectedMeetingPath, setSelectedMeetingPath] = useState<string | null>(null);

  return <QueryClientProvider client={queryClient}>
    <NotesTree onMeetingSelected={setSelectedMeetingPath} />
    <Alert.ErrorBoundary>
      <NotesView meetingPath={selectedMeetingPath} />
    </Alert.ErrorBoundary>
  </QueryClientProvider>;
}