import React, { useEffect, useState } from 'react';
import { Alert, Layout } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainMenu } from './menu/MainMenu';
import { NotesView } from './view/NotesView';
import { RecoilRoot } from 'recoil';
const { Sider } = Layout;

const queryClient = new QueryClient();

export const App: React.FC = () => {
  const [selectedMeetingPath, setSelectedMeetingPath] = useState<string | null>(null);
  const [sliderCanCollapse, setSliderCanCollapse] = useState<boolean>(false);
  const [sliderCollapsed, setSliderCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (selectedMeetingPath && sliderCanCollapse)
      setSliderCollapsed(true);
  }, [selectedMeetingPath, sliderCanCollapse]);

  return <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <div className="app-layout">
        <Sider className="app-sider"
               breakpoint="lg"
               width={300}
               collapsedWidth={0}
               collapsed={sliderCollapsed}
               onCollapse={collapsed => {
                  setSliderCanCollapse(true);
                  setSliderCollapsed(collapsed);
               }}>
          <div className="app-siderContent">
            <Alert.ErrorBoundary>
              <MainMenu onMeetingSelect={setSelectedMeetingPath} selectedMeetingPath={selectedMeetingPath} />
            </Alert.ErrorBoundary>
          </div>
        </Sider>
        <div className="app-content ant-layout-content">
          <Alert.ErrorBoundary>
            <NotesView meetingPath={selectedMeetingPath} />
          </Alert.ErrorBoundary>
        </div>
      </div>
    </RecoilRoot>
  </QueryClientProvider>;
};