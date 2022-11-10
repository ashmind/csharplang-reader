import React, { useState } from 'react';
import { Alert, Layout } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainMenu } from './MainMenu';
import { NotesView } from './NotesView';
import { RecoilRoot } from 'recoil';
const { Sider } = Layout;

const queryClient = new QueryClient();

export const App: React.FC = () => {
  const [selectedMeetingPath, setSelectedMeetingPath] = useState<string | null>(null);

  return <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <Layout className="app-layout">
        <Sider className="app-sider" breakpoint="lg" collapsedWidth="0" width={300}>
          <Alert.ErrorBoundary>
            <MainMenu onMeetingSelected={setSelectedMeetingPath} />
          </Alert.ErrorBoundary>
        </Sider>
        <div className="app-content ant-layout-content">
          <Alert.ErrorBoundary>
            <NotesView meetingPath={selectedMeetingPath} />
          </Alert.ErrorBoundary>
        </div>
      </Layout>
    </RecoilRoot>
  </QueryClientProvider>;
};