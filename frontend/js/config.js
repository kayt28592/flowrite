// ============================================
// 🔧 API CONFIGURATION
// ============================================
const API_CONFIG = {
    BASE_URL: window.location.origin + '/api',
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GET_USER: '/auth/me',
        
        // Customers
        CUSTOMERS: '/customers',
        CUSTOMER_BY_ID: (id) => `/customers/${id}`,
        SEARCH_CUSTOMERS: '/customers/search',
        
        // Submissions
        SUBMISSIONS: '/submissions',
        SUBMISSION_BY_ID: (id) => `/submissions/${id}`,
        SUBMISSIONS_BY_CUSTOMER: (name) => `/submissions/customer/${encodeURIComponent(name)}`,
        SUBMISSIONS_BY_DATE: '/submissions/date-range',
        SUBMISSION_STATS: '/submissions/stats',
        
        // Health
        HEALTH: '/health'
    }
};

// Local storage keys
const STORAGE_KEYS = {
    TOKEN: 'flowrite_token',
    USER: 'flowrite_user'
};

// Export for use in other files
window.API_CONFIG = API_CONFIG;
window.STORAGE_KEYS = STORAGE_KEYS;
