import axios from 'axios';

// Updated to user-provided ngrok URL
const DEFAULT_URL = 'https://unreverent-jonelle-unvehemently.ngrok-free.dev';

const apiClient = axios.create({
    baseURL: DEFAULT_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Debug Logging Interceptors
apiClient.interceptors.request.use(request => {
    console.log('📡 API Request:', request.method?.toUpperCase(), request.url);
    console.log('📤 Payload:', JSON.stringify(request.data, null, 2));
    return request;
});

apiClient.interceptors.response.use(
    response => {
        console.log('✅ API Response:', response.status, response.config.url);
        console.log('📥 Data:', JSON.stringify(response.data, null, 2));
        return response;
    },
    error => {
        if (error.response) {
            console.error('❌ API Error Response:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('❌ API No Response:', error.request);
        } else {
            console.error('❌ API Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const setApiBaseUrl = (url: string) => {
    apiClient.defaults.baseURL = url;
    console.log(`API base URL set to: ${apiClient.defaults.baseURL}`);
};

// API Methods
export const apiService = {
    checkHealth: () => apiClient.get('/health'),
    analyzeIssue: (payload: any) => apiClient.post('/analyze-complete', payload),
    analyzeBudget: (payload: any) => apiClient.post('/analyze-budget', payload),
    optimizeBudget: (payload: any) => apiClient.post('/optimize-budget', payload),
    estimateDamage: (payload: any) => apiClient.post('/estimate-damage', payload),
    validateReports: (payload: any) => apiClient.post('/validate-reports', payload),
    getReports: () => apiClient.get('/data'),
    getAllData: () => apiClient.get('/data/all'),
};

export default apiClient;