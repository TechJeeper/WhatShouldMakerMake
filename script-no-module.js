// Project options based on Maker's content
const originalActivities = [...activities]; 
let allProjects = [...activities]; // Will include custom items
let projects = allProjects.slice(0, 12);

// Try to load saved custom activities and wheel selections from localStorage
try {
    // Load custom activities first
    const savedActivities = localStorage.getItem('allActivities');
    if (savedActivities) {
        const parsedActivities = JSON.parse(savedActivities);
        if (Array.isArray(parsedActivities) && parsedActivities.length > 0) {
            allProjects = parsedActivities;
        }
    }
    
    // Then load wheel selections
    const savedSelections = localStorage.getItem('wheelSelections');
    if (savedSelections) {
        const loadedProjects = JSON.parse(savedSelections);
        // Ensure we have at least 3 items for the wheel
        if (loadedProjects && loadedProjects.length >= 3) {
            projects = loadedProjects;
        } else {
            console.warn('Not enough saved activities, using default selection');
        }
    }
} catch (e) {
    console.error('Error loading saved data:', e);
}

// Password for admin access - "maker"
const ADMIN_PASSWORD = "maker";

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

        // Add wobble effect when slowing down
        if (wheelConfig.spinSpeed < 0.05) {
            wheelConfig.rotation += Math.sin(wheelConfig.rotation * 10) * 0.002;
        }

        if (wheelConfig.spinSpeed < 0.001) {
            wheelConfig.spinning = false;
            document.querySelector('.wheel-pointer').classList.remove('spinning');
            showResult();
        }

        drawWheel();
        requestAnimationFrame(animate);
    }
}

// Show the selected result
function showResult() {
    // COMPLETELY NEW APPROACH:
    // Instead of trying to calculate the exact position using formulas,
    // we'll use the same drawing logic as the wheel to determine which slice is at the top
    
    const sliceAngle = (2 * Math.PI) / projects.length;
    
    // Normalize rotation between 0 and 2π
    let rotation = wheelConfig.rotation % (2 * Math.PI);
    if (rotation < 0) rotation += 2 * Math.PI;
    
    console.log("Final rotation:", rotation);
    
    // The top position is at 270 degrees (3π/2) in standard math coordinates
    // but we need to convert to the wheel's coordinate system
    const topPosition = -Math.PI/2; // 12 o'clock position
    
    // We need to find which slice is at the top position when wheel stops
    let selectedIndex = 0;
    
    // Calculate the actual wheel slices the same way they're drawn
    for (let i = 0; i < projects.length; i++) {
        // Each slice start angle as defined in drawWheel function
        const startAngle = i * sliceAngle + rotation;
        const endAngle = startAngle + sliceAngle;
        
        // Check if top position is in this slice
        // We need to normalize angles to handle wrapping around 2π
        const normalizedTop = ((topPosition % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const normalizedStart = ((startAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const normalizedEnd = ((endAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        
        // Handle the case where the slice crosses the 0/2π boundary
        if (normalizedStart > normalizedEnd) {
            // Slice wraps around from 2π to 0
            if (normalizedTop >= normalizedStart || normalizedTop < normalizedEnd) {
                selectedIndex = i;
                break;
            }
        } else {
            // Normal case
            if (normalizedTop >= normalizedStart && normalizedTop < normalizedEnd) {
                selectedIndex = i;
                break;
            }
        }
    }
    
    // Ensure we have a valid index (should always be the case)
    selectedIndex = selectedIndex % projects.length;
    
    console.log("Selected index:", selectedIndex, "Item:", projects[selectedIndex]);
    
    // Display the result
    const resultContainer = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    
    // Set text content
    resultText.textContent = projects[selectedIndex];
    
    // Get the wheel container position
    const wheelContainer = document.querySelector('.wheel-container');
    const wheelRect = wheelContainer.getBoundingClientRect();
    const wheelCenterX = wheelRect.left + (wheelRect.width / 2);
    const wheelCenterY = wheelRect.top + (wheelRect.height / 2);

    // Position the result container exactly at the wheel's center
    resultContainer.style.left = `${wheelCenterX}px`;
    resultContainer.style.top = `${wheelCenterY}px`;
    
    // Create close button if it doesn't exist
    if (!resultContainer.querySelector('.close-result')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-result';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', () => {
            resultContainer.classList.remove('visible');
        });
        resultContainer.appendChild(closeButton);
    }
    
    resultContainer.classList.add('visible');
    
    // Add celebration effects
    createConfetti();
    createSparkles();
}

// Create sparkle effect
function createSparkles() {
    const colors = ['#ffffff', '#9b4dca', '#b366e6'];
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'confetti sparkle';
        sparkle.style.left = `50%`;
        sparkle.style.top = '50%';
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.5 + 0.5})`;
        sparkle.style.animation = `sparkle ${Math.random() * 1 + 0.5}s linear forwards`;
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }
}

// Create confetti effect
function createConfetti() {
    const colors = ['#9b4dca', '#b366e6', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        confetti.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`;
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
        document.querySelector('.wheel-pointer').classList.add('spinning');
        animate();
    }
});

// Also hide result when randomizing or generating new ideas
function hideResult() {
    document.getElementById('result').classList.remove('visible');
}

document.getElementById('randomizeButton').addEventListener('click', () => {
    hideResult();
    randomizeActivities();
});

document.getElementById('generateButton').addEventListener('click', () => {
    hideResult();
    generateNewIdeas();
});

// Settings modal functionality
const settingsIcon = document.getElementById('settingsIcon');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.querySelector('.close-modal');
const passwordSection = document.getElementById('passwordSection');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');
const settingsContent = document.getElementById('settingsContent');
const itemsContainer = document.getElementById('itemsContainer');
const newItemInput = document.getElementById('newItemInput');
const addItemButton = document.getElementById('addItemButton');

// Open settings modal
settingsIcon.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    passwordInput.value = '';
    passwordSection.style.display = 'flex';
    settingsContent.style.display = 'none';
});

// Close settings modal
closeModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Password verification
submitPassword.addEventListener('click', () => {
    const password = passwordInput.value;
    
    if (password === ADMIN_PASSWORD) {
        passwordSection.style.display = 'none';
        settingsContent.style.display = 'block';
        displayActivitySettings();
    } else {
        alert('Incorrect password!');
        passwordInput.value = '';
    }
});

// Handle Enter key in password input
passwordInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        submitPassword.click();
    }
});

// Display available and selected activities
function displayActivitySettings() {
    // Update the settings modal content to include three sections with tabs
    settingsContent.innerHTML = `
        <div class="settings-tabs">
            <button id="wheelTab" class="tab-button active">Wheel Items</button>
            <button id="activityTab" class="tab-button">Available Activities</button>
            <button id="customTab" class="tab-button">Add Custom Items</button>
        </div>
        <div id="wheelTabContent" class="tab-content active">
            <div class="settings-section">
                <h3>Current Wheel Items</h3>
                <div id="selectedItemsContainer" class="items-container"></div>
            </div>
        </div>
        <div id="activityTabContent" class="tab-content">
            <div class="settings-section">
                <h3>Available Activities</h3>
                <div class="search-container">
                    <input type="text" id="activitySearch" placeholder="Search activities...">
                </div>
                <div id="availableItemsContainer" class="items-container"></div>
            </div>
        </div>
        <div id="customTabContent" class="tab-content">
            <div class="settings-section">
                <h3>Manage Custom Items</h3>
                <div class="add-item-form">
                    <input type="text" id="newItemInput" placeholder="Add new custom item">
                    <button id="addCustomItemButton" class="glow-button small-button">Add</button>
                </div>
                <div id="customItemsContainer" class="items-container"></div>
            </div>
        </div>
        <div class="settings-footer">
            <button id="saveSelectionsButton" class="glow-button">Save Selections</button>
        </div>
    `;

    // Get all the elements
    const wheelTab = document.getElementById('wheelTab');
    const activityTab = document.getElementById('activityTab');
    const customTab = document.getElementById('customTab');
    const wheelTabContent = document.getElementById('wheelTabContent');
    const activityTabContent = document.getElementById('activityTabContent');
    const customTabContent = document.getElementById('customTabContent');
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');
    const availableItemsContainer = document.getElementById('availableItemsContainer');
    const customItemsContainer = document.getElementById('customItemsContainer');
    const activitySearch = document.getElementById('activitySearch');
    const newItemInput = document.getElementById('newItemInput');
    const addCustomItemButton = document.getElementById('addCustomItemButton');
    const saveSelectionsButton = document.getElementById('saveSelectionsButton');

    // Add tab functionality
    wheelTab.addEventListener('click', () => {
        setActiveTab(wheelTab, wheelTabContent);
    });

    activityTab.addEventListener('click', () => {
        setActiveTab(activityTab, activityTabContent);
    });

    customTab.addEventListener('click', () => {
        setActiveTab(customTab, customTabContent);
    });

    function setActiveTab(tab, content) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        tab.classList.add('active');
        content.classList.add('active');
    }

    // Display currently selected items
    displaySelectedItems();

    // Display all available activities
    displayAvailableItems();

    // Display custom items (if any)
    displayCustomItems();

    // Add search functionality
    activitySearch.addEventListener('input', () => {
        const searchTerm = activitySearch.value.toLowerCase();
        displayAvailableItems(searchTerm);
    });

    // Add custom item functionality
    addCustomItemButton.addEventListener('click', () => {
        addCustomItem();
    });

    newItemInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addCustomItem();
        }
    });

    function addCustomItem() {
        const newItem = newItemInput.value.trim();
        if (newItem) {
            // Check if item already exists in the allProjects array
            if (!allProjects.includes(newItem)) {
                allProjects.push(newItem);
                
                // Store updated allProjects to localStorage
                try {
                    localStorage.setItem('allActivities', JSON.stringify(allProjects));
                } catch (e) {
                    console.error('Error saving custom items:', e);
                }
                
                // Clear input and refresh the displays
                newItemInput.value = '';
                displayCustomItems();
                displayAvailableItems();
            } else {
                alert('This item already exists in the activities list!');
            }
        }
    }

    // Save selections
    saveSelectionsButton.addEventListener('click', () => {
        try {
            // Check if there are enough items selected for the wheel
            if (projects.length < 3) {
                alert('Please select at least 3 items for the wheel.');
                return;
            }
            
            localStorage.setItem('wheelSelections', JSON.stringify(projects));
            localStorage.setItem('allActivities', JSON.stringify(allProjects));
            drawWheel();
            alert('Settings saved!');
            settingsModal.style.display = 'none';
        } catch (e) {
            console.error('Error saving selections:', e);
            alert('Error saving selections. Please try again.');
        }
    });

    // Function to display selected items
    function displaySelectedItems() {
        selectedItemsContainer.innerHTML = '';
        
        if (projects.length === 0) {
            selectedItemsContainer.innerHTML = '<p class="empty-message">No items selected for the wheel.</p>';
            return;
        }

        projects.forEach((item, index) => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row selected-item';
            
            const itemText = document.createElement('span');
            itemText.textContent = item;
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-item';
            deleteButton.textContent = '×';
            deleteButton.addEventListener('click', () => {
                projects.splice(index, 1);
                displaySelectedItems();
                // Update available items list
                if (activitySearch.value) {
                    displayAvailableItems(activitySearch.value.toLowerCase());
                } else {
                    displayAvailableItems();
                }
            });
            
            itemRow.appendChild(itemText);
            itemRow.appendChild(deleteButton);
            selectedItemsContainer.appendChild(itemRow);
        });
    }

    // Function to display custom items
    function displayCustomItems() {
        customItemsContainer.innerHTML = '';
        
        // Find custom items (those that are not in the original activities array)
        const customItems = allProjects.filter(item => !originalActivities.includes(item));
        
        if (customItems.length === 0) {
            customItemsContainer.innerHTML = '<p class="empty-message">No custom items added yet.</p>';
            return;
        }

        customItems.forEach((item) => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row custom-item';
            
            const itemText = document.createElement('span');
            itemText.textContent = item;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'item-actions';
            
            // Add to wheel button
            const addToWheelButton = document.createElement('button');
            addToWheelButton.className = 'add-item';
            addToWheelButton.title = 'Add to wheel';
            addToWheelButton.textContent = '+';
            addToWheelButton.addEventListener('click', () => {
                if (!projects.includes(item)) {
                    projects.push(item);
                    displaySelectedItems();
                }
            });
            
            // Delete from activities button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-item';
            deleteButton.title = 'Delete custom item';
            deleteButton.textContent = '×';
            deleteButton.addEventListener('click', () => {
                // Remove from allProjects
                const itemIndex = allProjects.indexOf(item);
                if (itemIndex !== -1) {
                    allProjects.splice(itemIndex, 1);
                }
                
                // Also remove from projects if it's there
                const wheelIndex = projects.indexOf(item);
                if (wheelIndex !== -1) {
                    projects.splice(wheelIndex, 1);
                    displaySelectedItems();
                }
                
                // Refresh displays
                displayCustomItems();
                displayAvailableItems();
            });
            
            // Add buttons to the actions div
            actionsDiv.appendChild(addToWheelButton);
            actionsDiv.appendChild(deleteButton);
            
            itemRow.appendChild(itemText);
            itemRow.appendChild(actionsDiv);
            customItemsContainer.appendChild(itemRow);
        });
    }

    // Function to display available items
    function displayAvailableItems(searchTerm = '') {
        availableItemsContainer.innerHTML = '';
        
        // Filter activities
        const filteredActivities = allProjects.filter(activity => 
            !projects.includes(activity) && 
            activity.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filteredActivities.length === 0) {
            availableItemsContainer.innerHTML = '<p class="empty-message">No matching activities found.</p>';
            return;
        }

        // Sort alphabetically
        const sortedActivities = filteredActivities.sort((a, b) => a.localeCompare(b));

        // Group by categories if not searching
        if (!searchTerm) {
            const activityGroups = groupActivitiesByCategory(sortedActivities);
            
            for (const category in activityGroups) {
                // Create category heading
                const categoryHeading = document.createElement('div');
                categoryHeading.className = 'category-heading';
                categoryHeading.textContent = category;
                availableItemsContainer.appendChild(categoryHeading);
                
                // Create items for this category
                activityGroups[category].forEach(activity => {
                    createActivityItem(activity);
                });
            }
        } else {
            // Just list all matching items without categories
            sortedActivities.forEach(activity => {
                createActivityItem(activity);
            });
        }
        
        // Helper function to create an activity item
        function createActivityItem(activity) {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row available-item';
            
            const itemText = document.createElement('span');
            itemText.textContent = activity;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'item-actions';
            
            // Add to wheel button
            const addButton = document.createElement('button');
            addButton.className = 'add-item';
            addButton.title = 'Add to wheel';
            addButton.textContent = '+';
            addButton.addEventListener('click', () => {
                if (!projects.includes(activity)) {
                    projects.push(activity);
                    displaySelectedItems();
                    displayAvailableItems(searchTerm);
                }
            });
            
            // Add first button to actions
            actionsDiv.appendChild(addButton);
            
            // Add remove button for all items (both original and custom)
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-item';
            deleteButton.title = 'Remove from available activities';
            deleteButton.textContent = '×';
            
            // For original items, show confirmation warning that this is a built-in item
            if (originalActivities.includes(activity)) {
                deleteButton.style.opacity = '0.5'; // Make it visually different
                deleteButton.addEventListener('click', () => {
                    if (confirm(`"${activity}" is a built-in activity. Are you REALLY sure you want to remove it from the available activities? This cannot be undone unless you reset the application.`)) {
                        const index = allProjects.indexOf(activity);
                        if (index !== -1) {
                            allProjects.splice(index, 1);
                            displayAvailableItems(searchTerm);
                            
                            // Save changes immediately
                            try {
                                localStorage.setItem('allActivities', JSON.stringify(allProjects));
                            } catch (e) {
                                console.error('Error saving activities:', e);
                            }
                        }
                    }
                });
            } else {
                // For custom items, standard confirmation
                deleteButton.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to remove "${activity}" from the available activities?`)) {
                        const index = allProjects.indexOf(activity);
                        if (index !== -1) {
                            allProjects.splice(index, 1);
                            displayAvailableItems(searchTerm);
                            
                            // Save changes immediately
                            try {
                                localStorage.setItem('allActivities', JSON.stringify(allProjects));
                            } catch (e) {
                                console.error('Error saving activities:', e);
                            }
                        }
                    }
                });
            }
            
            // Add delete button for all items (with different behavior based on item type)
            actionsDiv.appendChild(deleteButton);
            
            // Assemble the row
            itemRow.appendChild(itemText);
            itemRow.appendChild(actionsDiv);
            availableItemsContainer.appendChild(itemRow);
        }
    }

    // Helper function to group activities by category
    function groupActivitiesByCategory(activities) {
        const groups = {};
        
        activities.forEach(activity => {
            // Check for known categories
            let category = "Other";
            
            if (activity.includes("Darkstar Chronicles")) {
                category = "Darkstar Chronicles";
            } else if (activity.includes("3D printed") || activity.includes("3D printing")) {
                category = "3D Printing";
            } else if (activity.includes("CNC")) {
                category = "CNC Projects";
            } else if (activity.includes("Custom tool") || activity.includes("Workshop")) {
                category = "Workshop & Tools";
            } else if (activity.includes("game") || activity.includes("Gaming")) {
                category = "Gaming & Entertainment";
            } else if (activity.includes("art") || activity.includes("Art") || activity.includes("Decorative")) {
                category = "Art & Decoration";
            } else if (activity.includes("Educational") || activity.includes("teaching")) {
                category = "Educational & Functional";
            }
            
            if (!groups[category]) {
                groups[category] = [];
            }
            
            groups[category].push(activity);
        });
        
        return groups;
    }
}

// Initialize the wheel when the page loads
window.addEventListener('load', initWheel); 