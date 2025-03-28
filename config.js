// Obfuscated API key using a simple XOR encryption
const API_KEY = atob('c2stb3ItdjEtMDRjODAwZDVkNDBmY2EwYmRkMzM0OWFlNDg1MTg0NTVhY2NhNmZmN2IyMzBjNmMxYWI3MmJiNzU5MTlkNTA0Yg==');

// API Configuration
const API_CONFIG = {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "google/gemini-2.0-flash-thinking-exp:free",
    headers: {
        "HTTP-Referer": "https://thefreeheathen.github.io/maker-wheel",
        "X-Title": "What Should Maker Make?",
        "Authorization": `Bearer ${API_KEY}`
    }
};

export default API_CONFIG; 