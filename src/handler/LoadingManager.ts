type LoadingState = {
  isLoading: boolean;
  progress: number;
  message: string;
};

class LoadingManager {
  private static instance: LoadingManager;
  private state: LoadingState;
  private listeners: ((state: LoadingState) => void)[] = [];

  private constructor() {
    this.state = {
      isLoading: true,
      progress: 0,
      message: 'Starting...'
    };
  }

  static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  subscribe(listener: (state: LoadingState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  updateProgress(progress: number, message: string) {
    this.state = {
      ...this.state,
      progress: Math.min(100, Math.max(0, progress)),
      message
    };
    this.notify();
  }

  startLoading(message: string = 'Loading...') {
    this.state = {
      isLoading: true,
      progress: 0,
      message
    };
    this.notify();
  }

  finishLoading() {
    this.state = {
      isLoading: false,
      progress: 100,
      message: 'Complete'
    };
    this.notify();
  }

  getState(): LoadingState {
    return { ...this.state };
  }
}

export default LoadingManager;