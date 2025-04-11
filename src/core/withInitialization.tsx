import React from 'react';
import { useInit } from './InitializationContext';
import { LoadingScreen } from '@components/LoadingScreen';

export function withInitialization<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithInitializationComponent(props: P) {
    const { status } = useInit();

    if (!status.isInitialized) {
      return <LoadingScreen error={status.error} />;
    }

    return <WrappedComponent {...props} />;
  };
}