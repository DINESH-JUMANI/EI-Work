const numberOfCards = 3;
const valueOfCards = [7, 4, 2];
const questions = [
    { type: "text", question: "What is the largest number of all?" },
    { type: "text", question: "What is the smallest number of all?" },
    { type: "checkbox", question: "Select all numbers greater than 400" }
];

let currentNumber = '';
let usedCombinations = new Set();
const totalPossibleCombinations = factorial(numberOfCards);
let userAnswers = [];
let currentQuestionIndex = 0;

function factorial(n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

function initializeButtons() {
    const buttonContainer = document.getElementById('buttonContainer');
    valueOfCards.forEach(value => {
        const button = document.createElement('button');
        button.textContent = value;
        button.classList.add('number-button');
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
        if (currentNumber.length === numberOfCards) {
            setTimeout(() => {
                checkCombination();
            }, 100);
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

    for (let i = 0; i < currentNumber.length; i++) {
        const numberBox = document.createElement('div');
        numberBox.classList.add('number-box');
        numberBox.textContent = currentNumber[i];
        combinationElement.appendChild(numberBox);
    }

    numberList.appendChild(combinationElement);
}

function resetSelection() {
    currentNumber = '';
    updateCurrentNumber();
    document.querySelectorAll('.number-button').forEach(button => {
        button.disabled = false;
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
        questionElement.innerHTML = `<p>${questions[currentQuestionIndex].question}</p>`;
        questionContainer.appendChild(questionElement);

        const numberList = document.getElementById('numberList');
        const allNumbers = Array.from(usedCombinations).map(String);
        numberList.innerHTML = ''; // Clear previous inputs

        if (questions[currentQuestionIndex].type === "text") {
            allNumbers.forEach(number => {
                const combinationElement = document.createElement('div');
                combinationElement.classList.add('number-combination');

                // Create radio button
                const radioContainer = document.createElement('div');
                radioContainer.className = 'radio-container';
                const radioButton = document.createElement('input');
                radioButton.type = 'radio';
                radioButton.name = 'answer';
                radioButton.value = number;
                radioContainer.appendChild(radioButton);

                // Create number boxes
                for (let i = 0; i < number.length; i++) {
                    const numberBox = document.createElement('div');
                    numberBox.classList.add('number-box');
                    numberBox.textContent = number[i];
                    combinationElement.appendChild(numberBox);
                }

                combinationElement.prepend(radioContainer);
                numberList.appendChild(combinationElement);
            });
        } else if (questions[currentQuestionIndex].type === "checkbox") {
            allNumbers.forEach(number => {
                const combinationElement = document.createElement('div');
                combinationElement.classList.add('number-combination');

                // Create checkbox
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'checkbox-container';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = number;
                checkboxContainer.appendChild(checkbox);

                // Create number boxes
                for (let i = 0; i < number.length; i++) {
                    const numberBox = document.createElement('div');
                    numberBox.classList.add('number-box');
                    numberBox.textContent = number[i];
                    combinationElement.appendChild(numberBox);
                }

                combinationElement.prepend(checkboxContainer);
                numberList.appendChild(combinationElement);
            });
        }

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Answer';
        submitButton.id = 'submitAnswer';
        submitButton.style.width = '50%';
        submitButton.style.margin = '10px 0 0 0';
        submitButton.addEventListener('click', checkAnswer);
        numberList.appendChild(submitButton);
    } else {
        showFinalScore();
    }
}

function checkAnswer() {
    let answer;
    if (questions[currentQuestionIndex].type === "text") {
        const selectedRadio = document.querySelector('input[name="answer"]:checked');
        answer = selectedRadio ? parseInt(selectedRadio.value) : null;
    } else if (questions[currentQuestionIndex].type === "checkbox") {
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
        allNumbers.filter(num => num > 400)
    ];

    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (questions[index].type === "text") {
            if (answer === correctAnswers[index]) score++;
        } else if (questions[index].type === "checkbox") {
            if (JSON.stringify(answer.sort()) === JSON.stringify(correctAnswers[index].sort())) score++;
        }
    });

    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>You scored ${score} out of ${questions.length}!</p>
    `;
}

initializeButtons();
