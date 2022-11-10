import ReactDOM from 'react-dom/client';
import { App } from './App';

ReactDOM
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .createRoot(document.querySelector('main')!)
  .render(<App />);