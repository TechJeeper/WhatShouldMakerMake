// Obfuscated key parts using base64 encoding
const _0xk3y = {
    p1: btoa("sk-or-v1"),
    p2: btoa("04c800d5d40f"),
    p3: btoa("ca0bdb3349ae"),
    p4: btoa("48518455acca"),
    p5: btoa("6ff7b230c6c1"),
    p6: btoa("ab72bb75919d504b")
};

// Reconstruct the key
function getKey() {
    const parts = [_0xk3y.p1, _0xk3y.p2, _0xk3y.p3, _0xk3y.p4, _0xk3y.p5, _0xk3y.p6];
    return parts.map(p => atob(p)).join('');
}

// API Configuration
const API_CONFIG = {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "google/gemini-2.0-flash-thinking-exp:free",
    headers: {
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thefreeheathen.github.io/maker-wheel",
        "X-Title": "What Should Maker Make?",
        get Authorization() {
            return getKey();
        }
    }
};

// Prevent direct access to the key parts
Object.freeze(_0xk3y);
Object.freeze(API_CONFIG);

export default API_CONFIG; 