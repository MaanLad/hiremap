import { AppProvider, ThemeProvider } from './provider/index';
import { HiringMapCanvas } from './component/layout/index';

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <div className="h-screen w-screen">
          <HiringMapCanvas />
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}