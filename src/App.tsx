import React, { useState } from 'react';
import { Alert } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotesTree } from './NotesTree';
import { NotesView } from './NotesView';
import { ReadContextProvider } from './shared/readContext';

const queryClient = new QueryClient();

export const App: React.FC<{}> = () => {
  const [selectedMeetingPath, setSelectedMeetingPath] = useState<string | null>(null);

  return <QueryClientProvider client={queryClient}>
    <ReadContextProvider>
      <NotesTree onMeetingSelected={setSelectedMeetingPath} />
      <Alert.ErrorBoundary>
        <NotesView meetingPath={selectedMeetingPath} />
      </Alert.ErrorBoundary>
    </ReadContextProvider>
  </QueryClientProvider>;
}