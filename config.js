// API Configuration with obfuscated key
const _0x = ['sk', 'or', 'v1', '04c800d5d40f', 'ca0bdb3349ae', '48518455acca', '6ff7b230c6c1', 'ab72bb75919d504b'];

function _0xk() {
    return [_0x[0], _0x[1], _0x[2]].join('-') + '-' + 
           [_0x[3], _0x[4], _0x[5], _0x[6], _0x[7]].join('');
}

const API_CONFIG = {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "google/gemini-2.0-flash-thinking-exp:free",
    headers: {
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thefreeheathen.github.io/maker-wheel",
        "X-Title": "What Should Maker Make?",
        get Authorization() {
            return _0xk();
        }
    }
};

// Prevent direct access to the configuration
Object.freeze(API_CONFIG);
Object.freeze(API_CONFIG.headers);

export default API_CONFIG; 