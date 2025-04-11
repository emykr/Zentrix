import { setLang } from '@utils/LangLoader';

const loadConfig = async (): Promise<AppConfig> => {
  // 설정 파일 로드 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    version: '1.0.0',
    environment: process.env.NODE_ENV as 'development' | 'production',
    features: {
      enableAnimations: true,
      debugMode: process.env.NODE_ENV === 'development'
    }
  };
};

const initializeApp = async (): Promise<InitializationStatus> => {
  try {
    // 1. 설정 로드
    const config = await loadConfig();
    window.__APP_INITIALIZED__ = false;

    // 2. 언어 설정
    setLang('ko');

    // 3. 기타 초기화 작업
    console.log('App initialized with config:', config);
    
    // 4. 초기화 완료
    window.__APP_INITIALIZED__ = true;
    
    return { isInitialized: true };
  } catch (error) {
    console.error('Failed to initialize app:', error);
    return { 
      isInitialized: false, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
};

export { initializeApp };