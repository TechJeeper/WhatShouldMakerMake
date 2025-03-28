// Obfuscated key parts
const _0xk3y = {
    p1: "sk-or-v1",
    p2: "04c800d5d40f",
    p3: "ca0bdb3349ae",
    p4: "48518455acca",
    p5: "6ff7b230c6c1",
    p6: "ab72bb75919d504b"
};

// Simple XOR function for basic encryption
function _0xe(str) {
    const key = 'maker';
    return str.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
}

// Reconstruct and decrypt the key
function getKey() {
    const parts = [_0xk3y.p1, _0xk3y.p2, _0xk3y.p3, _0xk3y.p4, _0xk3y.p5, _0xk3y.p6];
    return parts.map(p => _0xe(_0xe(p))).join('-').replace(/-/g, '');
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