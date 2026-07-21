import styles from './app.module.css';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@card-component-demo/shared-utils';

export function App() {
  return (
    <ThemeProvider>
      <div className={styles['app']}>
        <div className={styles['header']}>
          <h1>Card Component Demo</h1>
        </div>
        <div className={styles['content']}>
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
