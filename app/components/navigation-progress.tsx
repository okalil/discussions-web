import { useNavigation } from '@remix-run/react';
import React from 'react';

export function NavigationProgress() {
  const [progress, setProgress] = React.useState(0);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (navigation.state === 'loading') {
      const timer = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + Math.floor(Math.random() * 11);
          if (newProgress >= 100) {
            clearInterval(timer);
          }
          return newProgress;
        });
      }, 200);
      return () => clearTimeout(timer);
    }
    if (navigation.state === 'idle' && progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  if (!progress) return null;

  return (
    <div className="h-1 fixed z-30 top-0 left-0 right-0">
      <div
        className="bg-blue-500 h-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
