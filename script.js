import API_CONFIG from './config.js';

// Project options based on Maker's content
const allProjects = [
    "3D Printing News",
    "Design a CNC Project",
    "Design a Functional Print",
    "Build a Pigeon Feeder",
    "Create a Custom Tool Holder",
    "Make a Woodworking Project",
    "Design a Custom Enclosure",
    "Create a Mechanical Puzzle",
    "Build a Custom Workbench",
    "Design a Custom Storage Solution",
    "Make a Custom Sign",
    "Create a Custom Fixture",
    "Build a Custom Jig",
    "Design a Custom Tool",
    "Create a Custom Stand",
    "Make a Custom Holder",
    "Design a Custom Box",
    "Create a Custom Organizer",
    "Build a Custom Rack",
    "Design a Custom Shelf"
];

let projects = [...allProjects].slice(0, 12);

// Wheel configuration
const wheelConfig = {
    canvas: document.getElementById('wheelCanvas'),
    ctx: null,
    centerX: 400,
    centerY: 400,
    radius: 360,
    rotation: 0,
    spinning: false,
    spinSpeed: 0,
    friction: 0.995
};

// Initialize the wheel
function initWheel() {
    wheelConfig.ctx = wheelConfig.canvas.getContext('2d');
    wheelConfig.canvas.width = 800;
    wheelConfig.canvas.height = 800;
    drawWheel();
}

// Draw the wheel
function drawWheel() {
    const ctx = wheelConfig.ctx;
    const centerX = wheelConfig.centerX;
    const centerY = wheelConfig.centerY;
    const radius = wheelConfig.radius;
    const sliceAngle = (2 * Math.PI) / projects.length;

    ctx.clearRect(0, 0, wheelConfig.canvas.width, wheelConfig.canvas.height);

    // Draw slices
    projects.forEach((project, index) => {
        const startAngle = index * sliceAngle + wheelConfig.rotation;
        const endAngle = startAngle + sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = index % 2 === 0 ? '#9b4dca' : '#b366e6';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Add text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(project, radius - 40, 8);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
    ctx.strokeStyle = '#b366e6';
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Animate the wheel
function animate() {
    if (wheelConfig.spinning) {
        wheelConfig.rotation += wheelConfig.spinSpeed;
        wheelConfig.spinSpeed *= wheelConfig.friction;

        if (wheelConfig.spinSpeed < 0.001) {
            wheelConfig.spinning = false;
            showResult();
        }

        drawWheel();
        requestAnimationFrame(animate);
    }
}

// Show the selected result
function showResult() {
    const sliceAngle = (2 * Math.PI) / projects.length;
    const normalizedRotation = wheelConfig.rotation % (2 * Math.PI);
    const selectedIndex = Math.floor((2 * Math.PI - normalizedRotation) / sliceAngle) % projects.length;
    
    const resultContainer = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    
    resultText.textContent = projects[selectedIndex];
    resultContainer.classList.add('visible');
    
    // Add celebration effect
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Generate new project ideas using OpenAI API
async function generateNewIdeas() {
    const loadingContainer = document.getElementById('loading');
    loadingContainer.classList.add('visible');

    try {
        // Prepare headers with proper authorization
        const headers = {
            ...API_CONFIG.headers,
            "Authorization": API_CONFIG.headers.Authorization
        };

        // Debug: Log partial key for verification
        console.log('Auth Header (first 20 chars):', headers.Authorization.substring(0, 20) + '...');

        const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    {
                        role: "user",
                        content: "Generate 20 creative project ideas for a maker who specializes in 3D printing, CNC machining, and woodworking. The projects should be practical, functional, and interesting. Include some pigeon-themed projects. Format the response as a JSON array of strings. Make sure the response is ONLY the JSON array, no other text."
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error:', errorData);
            console.error('Response Status:', response.status);
            console.error('Response Headers:', Object.fromEntries([...response.headers]));
            console.error('Request Headers:', {
                ...headers,
                Authorization: headers.Authorization.substring(0, 20) + '...'
            });
            throw new Error(`API request failed with status ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error('Invalid API response format');
        }

        let newProjects;
        try {
            // Try to extract JSON array from the response
            const content = data.choices[0].message.content.trim();
            console.log('Content:', content);
            const jsonStr = content.match(/\[.*\]/s)?.[0] || content;
            newProjects = JSON.parse(jsonStr);
            
            if (!Array.isArray(newProjects)) {
                throw new Error('Response is not an array');
            }
        } catch (e) {
            console.error('Failed to parse API response:', e);
            // Fallback to default projects if parsing fails
            newProjects = [
                "Design a Smart Pigeon Coop",
                "Create a CNC Bird Feeder",
                "3D Print Custom Tool Organizers",
                "Build a Modular Workshop Storage",
                "Make a Custom CNC Jig Set",
                "Design an Automated Feeder",
                "Create a Collapsible Workbench",
                "Build a Rotating Tool Cabinet",
                "Design a Smart Dust Collection",
                "Make a Custom LED Sign",
                "Create a Multi-Material Display",
                "Build a Mobile Storage Rack"
            ];
        }
        
        // Update the projects array
        allProjects.length = 0;
        allProjects.push(...newProjects);
        projects = [...allProjects].slice(0, 12);
        
        // Reset and redraw the wheel
        wheelConfig.rotation = 0;
        drawWheel();
        document.getElementById('result').classList.remove('visible');
    } catch (error) {
        console.error('Error generating new ideas:', error);
        alert('Failed to generate new ideas. Using default project list.');
        // Use the default projects if API call fails
        randomizeActivities();
    } finally {
        loadingContainer.classList.remove('visible');
    }
}

// Randomize activities
function randomizeActivities() {
    const shuffled = [...allProjects].sort(() => 0.5 - Math.random());
    projects = shuffled.slice(0, 12);
    wheelConfig.rotation = 0;
    drawWheel();
    document.getElementById('result').classList.remove('visible');
}

// Event listeners
document.getElementById('spinButton').addEventListener('click', () => {
    if (!wheelConfig.spinning) {
        wheelConfig.spinning = true;
        wheelConfig.spinSpeed = 0.2 + Math.random() * 0.1;
        document.getElementById('result').classList.remove('visible');
        animate();
    }
});

document.getElementById('randomizeButton').addEventListener('click', randomizeActivities);
document.getElementById('generateButton').addEventListener('click', generateNewIdeas);

// Initialize the wheel when the page loads
window.addEventListener('load', initWheel); 