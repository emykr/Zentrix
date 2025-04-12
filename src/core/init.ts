import { setLang } from '@utils/LangLoader';
import LoadingManager from '@handler/LoadingManager';

const loadConfig = async (): Promise<AppConfig> => {
  const loadingManager = LoadingManager.getInstance();
  loadingManager.updateProgress(10, '설정 파일 로드 중...');
  
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
  const loadingManager = LoadingManager.getInstance();
  loadingManager.startLoading('앱 초기화 중...');
  
  try {
    // 1. 설정 로드
    loadingManager.updateProgress(0, '초기화 시작...');
    const config = await loadConfig();
    window.__APP_INITIALIZED__ = false;

    // 2. 언어 설정
    loadingManager.updateProgress(40, '언어 설정 중...');
    setLang('ko');

    // 3. 기타 초기화 작업
    loadingManager.updateProgress(70, '기본 설정 적용 중...');
    console.log('App initialized with config:', config);
    
    // 4. 초기화 완료
    await new Promise(resolve => setTimeout(resolve, 500)); // 완료 표시를 위한 지연
    window.__APP_INITIALIZED__ = true;
    loadingManager.finishLoading();
    
    return { isInitialized: true };
  } catch (error) {
    console.error('Failed to initialize app:', error);
    loadingManager.updateProgress(100, '초기화 실패');
    return { 
      isInitialized: false, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
};

export { initializeApp };