import { activities } from './activities.js';

// Project options based on Maker's content
const allProjects = [...activities];
let projects = allProjects.slice(0, 12);

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

    // Add outer glow effect
    const gradient = ctx.createRadialGradient(
        centerX, centerY, radius - 10,
        centerX, centerY, radius + 10
    );
    gradient.addColorStop(0, 'rgba(155, 77, 202, 0.3)');
    gradient.addColorStop(1, 'rgba(155, 77, 202, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fill();

    // Draw slices with enhanced effects
    projects.forEach((project, index) => {
        const startAngle = index * sliceAngle + wheelConfig.rotation;
        const endAngle = startAngle + sliceAngle;

        // Draw slice with gradient
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Create gradient for slice
        const sliceGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        const baseColor = index % 2 === 0 ? '#9b4dca' : '#b366e6';
        sliceGradient.addColorStop(0, '#ffffff');
        sliceGradient.addColorStop(0.2, baseColor);
        sliceGradient.addColorStop(1, baseColor);
        
        ctx.fillStyle = sliceGradient;
        ctx.fill();

        // Add shine effect
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        const shine = ctx.createLinearGradient(
            centerX - radius, centerY - radius,
            centerX + radius, centerY + radius
        );
        shine.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        shine.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        shine.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        ctx.fillStyle = shine;
        ctx.fill();

        // Add slice border with glow
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add text with enhanced styling
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.font = 'bold 18px Arial';
        
        // Word wrap the text
        const words = project.split(' ');
        let line = '';
        let y = 0;
        const lineHeight = 20;
        const maxWidth = radius - 80;

        words.forEach((word, i) => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, radius - 40, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        });
        ctx.fillText(line, radius - 40, y);
        
        ctx.restore();
    });

    // Draw center circle with enhanced effects
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    
    // Create gradient for center circle
    const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 60
    );
    centerGradient.addColorStop(0, '#1a1a1a');
    centerGradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = centerGradient;
    ctx.fill();

    // Add glow effect to center circle
    ctx.shadowColor = '#b366e6';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#b366e6';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
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

// Generate new project ideas
function generateNewIdeas() {
    const loadingContainer = document.getElementById('loading');
    loadingContainer.classList.add('visible');

    try {
        // Shuffle all projects and take 12
        const shuffled = [...allProjects].sort(() => 0.5 - Math.random());
        projects = shuffled.slice(0, 12);
        
        // Reset and redraw the wheel
        wheelConfig.rotation = 0;
        drawWheel();
        document.getElementById('result').classList.remove('visible');
    } catch (error) {
        console.error('Error generating new ideas:', error);
        alert('Failed to generate new ideas. Using default project list.');
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