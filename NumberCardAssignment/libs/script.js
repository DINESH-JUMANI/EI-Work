const numberOfCards = 3;
const valueOfCards = [7, 4, 2];
const dynamicNumbers = [generateDynamicNumber(), generateDynamicNumber()];
const questions = [
    { type: "single", question: "What is the largest number of all?" },
    { type: "single", question: "What is the smallest number of all?" },
    { type: "multiple", question: `Select all numbers smaller than ${dynamicNumbers[0]}` },
    { type: "multiple", question: `Select all numbers greater than ${dynamicNumbers[1]}` },
];

let currentNumber = '';
let usedCombinations = new Set();
const totalPossibleCombinations = factorial(numberOfCards);
let userAnswers = [];
let currentQuestionIndex = 0;
let demoMode = false; // Flag to track demo mode

function factorial(n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}
function generateDynamicNumber() {
    const minValue = Math.min(...valueOfCards);
    const maxValue = Math.max(...valueOfCards);
    const randomSmallNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    return randomSmallNumber * Math.pow(10, numberOfCards - 1);
}

// Create the main structure of the page
function createPageStructure() {
    const container = document.createElement('div');
    container.classList.add('container');

    const leftPanel = document.createElement('div');
    leftPanel.classList.add('left-panel');

    const rightPanel = document.createElement('div');
    rightPanel.classList.add('right-panel');

    const leftPanelHeading = document.createElement('h2');
    leftPanelHeading.textContent = 'Shown below are few Number Cards';

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.id = 'buttonContainer';

    const currentNumberDiv = document.createElement('div');
    currentNumberDiv.id = 'currentNumber';

    const questionContainer = document.createElement('div');
    questionContainer.id = 'questionContainer';
    questionContainer.style.display = 'none';
    questionContainer.classList.add('question-container'); // Added class for styling

    const rightPanelHeading = document.createElement('h2');
    rightPanelHeading.textContent = 'Number List';

    const numberList = document.createElement('div');
    numberList.classList.add('number-list');
    numberList.id = 'numberList';

    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.id = 'popup';
    popup.innerHTML = '<p><b>This combination has already been used!</b></p>';

    leftPanel.append(leftPanelHeading, buttonContainer, currentNumberDiv, questionContainer);
    rightPanel.append(rightPanelHeading, numberList);
    container.append(leftPanel, rightPanel);
    document.body.append(container, popup);

    const demoPopup = document.createElement('div');
    demoPopup.id = 'demoPopup';
    demoPopup.classList.add('demo-popup');
    demoPopup.innerHTML = `
        <div class="demo-popup-content">
            <h3>Do you want a demo?</h3>
            <div class="demo-buttons">
                <button id="demoYes" class="demo-btn">Yes</button>
                <button id="demoNo" class="demo-btn">No</button>
            </div>
        </div>
    `;

    const demoArrow = document.createElement('div');
    demoArrow.id = 'demoArrow';
    demoArrow.classList.add('demo-arrow');
    demoArrow.innerHTML = `
        <div class="arrow-up"></div>
        <div class="click-here">Click here</div>
    `;

    document.body.append(demoPopup, demoArrow);
    initializeButtons();
    showDemoPopup();
}

function initializeButtons() {
    const buttonContainer = document.getElementById('buttonContainer');
    valueOfCards.forEach(value => {
        const button = document.createElement('button');
        button.textContent = value;
        button.classList.add('number-button');
        button.disabled = demoMode; // Disable all buttons initially if demo mode is on
        button.addEventListener('click', () => selectNumber(value, button));
        buttonContainer.appendChild(button);
    });
}

function selectNumber(value, button) {
    if (currentNumber.length < numberOfCards) {
        currentNumber += value;
        button.disabled = true;
        button.style.backgroundColor = '#f1c40f';
        updateCurrentNumber();
        document.getElementById('demoArrow').style.display = 'none';
        if (currentNumber.length === numberOfCards) {
            setTimeout(checkCombination, 100);
        }
    }
}

function updateCurrentNumber() {
    const currentNumberBoxes = document.querySelectorAll('.current-number-box');
    currentNumberBoxes.forEach((box, index) => {
        box.textContent = currentNumber[index] || '';
    });
}

function checkCombination() {
    if (usedCombinations.has(currentNumber)) {
        showPopup();
    } else {
        usedCombinations.add(currentNumber);
        displayCombination();
        demoMode = false;
    }
    resetSelection();
    if (usedCombinations.size === totalPossibleCombinations) {
        showQuestions();
    }
}

function displayCombination() {
    const numberList = document.getElementById('numberList');
    const combinationElement = document.createElement('div');
    combinationElement.classList.add('number-combination');

    currentNumber.split('').forEach(num => {
        const numberBox = document.createElement('div');
        numberBox.classList.add('number-box');
        numberBox.textContent = num;
        combinationElement.appendChild(numberBox);
    });

    numberList.appendChild(combinationElement);

    if (demoMode) {
        setTimeout(showDemoOverPopup, 300); // Wait for the pop up duration to finish
    }
}

function resetSelection() {
    currentNumber = '';
    updateCurrentNumber();
    document.querySelectorAll('.number-button').forEach(button => {
        button.disabled = demoMode; // Disable all buttons if demo mode is active
        button.style.backgroundColor = '#3498db';
    });
}

function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

function showQuestions() {
    const currentNumberElement = document.getElementById('currentNumber');
    const questionContainer = document.getElementById('questionContainer');
    currentNumberElement.style.display = 'none';
    questionContainer.style.display = 'block';

    document.querySelectorAll('.number-button').forEach(button => {
        button.disabled = true;
        button.style.backgroundColor = '#f1c40f';
    });

    showNextQuestion();
}

function showNextQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `<p class="animated-question">${questions[currentQuestionIndex].question}</p>`; // Added class for animation
        questionContainer.appendChild(questionElement);

        const numberList = document.getElementById('numberList');
        const allNumbers = Array.from(usedCombinations).map(String);
        numberList.innerHTML = ''; // Clear previous inputs

        allNumbers.forEach(number => {
            const combinationElement = document.createElement('div');
            combinationElement.classList.add('number-combination');

            const inputContainer = document.createElement('div');
            inputContainer.className = questions[currentQuestionIndex].type === "single" ? 'radio-container' : 'checkbox-container';
            const input = document.createElement('input');
            input.type = questions[currentQuestionIndex].type === "single" ? 'radio' : 'checkbox';
            input.name = questions[currentQuestionIndex].type === "single" ? 'answer' : '';
            input.value = number;
            inputContainer.appendChild(input);

            number.split('').forEach(num => {
                const numberBox = document.createElement('div');
                numberBox.classList.add('number-box');
                numberBox.textContent = num;
                combinationElement.appendChild(numberBox);
            });

            combinationElement.prepend(inputContainer);
            numberList.appendChild(combinationElement);
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Answer';
        submitButton.id = 'submitAnswer';
        submitButton.addEventListener('click', checkAnswer);
        numberList.appendChild(submitButton);
    } else {
        showFinalScore();
    }
}

function checkAnswer() {
    let answer;
    if (questions[currentQuestionIndex].type === "single") {
        const selectedRadio = document.querySelector('input[name="answer"]:checked');
        answer = selectedRadio ? parseInt(selectedRadio.value) : null;
    } else {
        answer = Array.from(document.querySelectorAll('#numberList input:checked'))
            .map(checkbox => parseInt(checkbox.value));
    }
    userAnswers.push(answer);
    currentQuestionIndex++;
    showNextQuestion();
}

function showFinalScore() {
    const allNumbers = Array.from(usedCombinations).map(Number);
    const correctAnswers = [
        Math.max(...allNumbers),
        Math.min(...allNumbers),
        allNumbers.filter(num => num < dynamicNumbers[0]),
        allNumbers.filter(num => num > dynamicNumbers[1]),
    ];

    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (questions[index].type === "single") {
            if (answer === correctAnswers[index]) score++;
        } else if (JSON.stringify(answer.sort()) === JSON.stringify(correctAnswers[index].sort())) score++;
    });

    const finalScorePopup = document.createElement('div');
    finalScorePopup.id = 'finalScorePopup';
    finalScorePopup.classList.add('popup');
    finalScorePopup.innerHTML = `
        <p><b>Quiz Completed! You scored ${score} out of ${questions.length}!</b></p>
        <button onclick="window.location.reload();" class="demo-btn">OK</button>
    `;
    document.body.appendChild(finalScorePopup);
    finalScorePopup.style.display = 'block';

    // Dim the background
    document.body.style.backgroundColor = 'rgba(0,0,0,0.5)';

    // Disable all other elements
    document.querySelectorAll('*').forEach(el => {
        if (!el.classList.contains('popup')) {
            el.style.pointerEvents = 'none';
        }
    });

    // Enable popup and its elements
    finalScorePopup.style.pointerEvents = 'auto';
    finalScorePopup.querySelectorAll('*').forEach(el => {
        el.style.pointerEvents = 'auto';
    });
}

function showDemoPopup() {
    const demoPopup = document.getElementById('demoPopup');
    demoPopup.style.display = 'flex';

    document.getElementById('demoYes').addEventListener('click', startDemo);
    document.getElementById('demoNo').addEventListener('click', () => {
        demoPopup.style.display = 'none';
    });
}

function startDemo() {
    demoMode = true; // Set demo mode flag to true
    document.getElementById('demoPopup').style.display = 'none';
    showDemoArrow(0);
}

function showDemoArrow(index) {
    if (index >= valueOfCards.length) {
        document.getElementById('demoArrow').style.display = 'none';
        return;
    }

    const buttons = document.querySelectorAll('.number-button');
    buttons.forEach((button, idx) => {
        button.disabled = idx !== index; // Enable only the button at the current index
        button.style.backgroundColor = idx === index ? '#3498db' : '#f1c40f'; // Highlight the active button
    });
    const button = buttons[index];
    const arrow = document.getElementById('demoArrow');

    const buttonRect = button.getBoundingClientRect();
    arrow.style.left = `${buttonRect.left + buttonRect.width / 2 - 30}px`; // Center the arrow
    arrow.style.top = `${buttonRect.bottom + 10}px`; // Position below the button
    arrow.style.display = 'block';

    button.addEventListener('click', () => showDemoArrow(index + 1), { once: true });
}

// Add this function to show the demo over popup
function showDemoOverPopup() {
    const demoOverPopup = document.createElement('div');
    demoOverPopup.id = 'demoOverPopup';
    demoOverPopup.classList.add('demo-popup');
    demoOverPopup.innerHTML = `
        <div class="demo-popup-content">
            <h4>Your Number is Generated</h4>
            <h3>Do you want to see it again?</h3>
            <div class="demo-buttons">
                <button id="demoOverYes" class="demo-btn">Yes</button>
                <button id="demoOverNo" class="demo-btn">No</button>
            </div>
        </div>
    `;
    document.body.appendChild(demoOverPopup);

    function resetAndClear() {
        // Reset the current number
        currentNumber = '';
        updateCurrentNumber();

        // Clear the number list
        document.getElementById('numberList').innerHTML = "";

        // Clear used combinations
        usedCombinations.clear();

        // Reset all buttons
        document.querySelectorAll('.number-button').forEach(button => {
            button.disabled = false;
            button.style.backgroundColor = '#3498db';
        });
    }

    document.getElementById('demoOverYes').addEventListener('click', () => {
        document.body.removeChild(demoOverPopup);
        resetAndClear();
        startDemo();
    });

    document.getElementById('demoOverNo').addEventListener('click', () => {
        document.body.removeChild(demoOverPopup);
        demoMode = false;
    });
}

createPageStructure();
