// API Configuration
const API_CONFIG = {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "google/gemini-2.0-flash-thinking-exp:free",
    headers: {
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thefreeheathen.github.io/maker-wheel",
        "X-Title": "What Should Maker Make?",
        "Authorization": "Bearer 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"
    }
};

export default API_CONFIG; 