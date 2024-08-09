document.addEventListener("DOMContentLoaded", function () {
    document.body.innerHTML = `
    <div class="container">
        <div class="instructionBox">
            <div class="instruction">Guess the number of cookies in each row at the bakery.</div>
            <div class="instruction"><i>Press the "Check" button.</i></div>
        </div>
        <input type="number" id="inputNumber" placeholder="Enter a number">
        <button id="checkButton" onclick="checkGuess()">Check</button>
        <div class="legend" style="display: block; text-align: center; display: flex; justify-content: center;">
            <span><span class="dot chocolate-dot"></span> Chocolate Chip Cookie</span>
            <span style="margin-left: 10px;"><span class="dot oatmeal-dot"></span> Oatmeal Raisin Cookie</span>
        </div>
        <div id="message" class="error"></div> <!-- Moved success message above cookies -->
        <div id="chocolateRow">
            <div class="instruction"></div>
            <span id="chocolateLeft" class="error" style="display: block;"></span>
            <div id="chocolateCookies" class="cookie-container" style="overflow: hidden;"></div>
        </div>
        <div id="oatmealRow">
            <div class="instruction"></div>
            <span id="oatmealLeft" class="error" style="display: block;"></span>
            <div id="oatmealCookies" class="cookie-container" style="overflow: hidden;"></div>
        </div>
        <br>
    </div>
    `;

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    var numbersParam = getUrlParameter('numbers');
    var numbers = numbersParam.split('|').map(Number);
    var chocolateCount = numbers[0];
    var oatmealCount = numbers[1];
    var showAnswer = getUrlParameter('showAnswer');
    var answer = getUrlParameter('answer') ? getUrlParameter('answer') : 0;
    var mode = getUrlParameter('mode') || '';
    let factorsList = [1];

    function createCookie(type, isLeftover, size) {
        var cookie = document.createElement('div');
        cookie.className = `cookie ${type}`;
        cookie.style.width = `${size}px`;
        cookie.style.height = `${size}px`;
        cookie.style.fontSize = `${Math.max(size / 2, 8)}px`;
        if (isLeftover) {
            cookie.classList.add('flash', 'leftover');
        }
        return cookie;
    }

    function createCookieRow(count, type, isLeftover = false, size) {
        var row = document.createElement('div');
        row.className = 'cookie-row';
        for (var i = 0; i < count; i++) {
            row.appendChild(createCookie(type, isLeftover, size));
        }
        return row;
    }

    function calculateCookieSize(containerWidth, containerHeight, cookiesPerRow, totalRows) {
        var maxWidthSize = Math.floor(containerWidth / cookiesPerRow) - 2;
        var maxHeightSize = Math.floor(containerHeight / totalRows) - 15;
        return Math.max(Math.min(maxWidthSize, maxHeightSize), 6);
    }

    window.checkGuess = function () {
        var x = parseInt(document.getElementById("inputNumber").value);
        var chocolateDiv = document.getElementById("chocolateCookies");
        var oatmealDiv = document.getElementById("oatmealCookies");
        var chocolateLeftSpan = document.getElementById("chocolateLeft");
        var oatmealLeftSpan = document.getElementById("oatmealLeft");
        var messageDiv = document.getElementById("message");
        var legend = document.querySelector(".legend");

        if (isNaN(x) || x <= 0) {
            messageDiv.innerHTML = "<div class='error'>Please enter a valid positive number.</div>";
            legend.style.display = "none";
            return;
        }

        var chocolateRows = Math.floor(chocolateCount / x);
        var oatmealRows = Math.floor(oatmealCount / x);
        var chocolateLeft = chocolateCount % x;
        var oatmealLeft = oatmealCount % x;

        chocolateDiv.innerHTML = "";
        oatmealDiv.innerHTML = "";
        chocolateLeftSpan.innerHTML = "";
        oatmealLeftSpan.innerHTML = "";
        messageDiv.innerHTML = "";

        if (chocolateRows === 0 || oatmealRows === 0) {
            messageDiv.innerHTML = "<div class='errors'>The number you entered does not allow arranging cookies in rows. Try making another guess.</div>";
            legend.style.display = "none";
            return;
        }
        if (oatmealLeft === 0 && chocolateLeft === 0) {
            messageDiv.innerHTML = "<div class='success'>Bingo! Is there also another way of doing the same and hence more than 1 answer? Try!</div>";
        }

        var containerWidth = chocolateDiv.offsetWidth;
        var containerHeight = window.innerHeight - document.querySelector('.instructionBox').offsetHeight - 70; // Subtract fixed elements height and 
        var totalRows = chocolateRows + oatmealRows + (chocolateLeft > 0 ? 1 : 0) + (oatmealLeft > 0 ? 1 : 0);
        var cookieSize = calculateCookieSize(containerWidth, containerHeight, x, totalRows);

        for (var i = 0; i < chocolateRows; i++) {
            chocolateDiv.appendChild(createCookieRow(x, 'chocolate', false, cookieSize));
        }
        if (chocolateLeft > 0) {
            chocolateDiv.appendChild(createCookieRow(chocolateLeft, 'chocolate', true, cookieSize));
        }

        for (var i = 0; i < oatmealRows; i++) {
            oatmealDiv.appendChild(createCookieRow(x, 'oatmeal', false, cookieSize));
        }
        if (oatmealLeft > 0) {
            oatmealDiv.appendChild(createCookieRow(oatmealLeft, 'oatmeal', true, cookieSize));
        }

        if (chocolateLeft !== 0) {
            chocolateLeftSpan.innerHTML = "Oops! The last row does not have the same number of cookies as the rest. <br>" + x + " is not a factor of " + chocolateCount + ". Try another number.";
        }

        if (oatmealLeft !== 0) {
            oatmealLeftSpan.innerHTML = "Oops! The last row does not have the same number of cookies as the rest. <br>" + x + " is not a factor of " + oatmealCount + ". Try another number.";
        }

        legend.style.display = "block"; // Always show the legend

        // Additional functionality for commonFactors mode
        if (mode === "commonFactors" && numbers[0] % x === 0 && numbers[1] % x === 0) {
            if (!factorsList.includes(x)) {
                factorsList.push(x);
                document.getElementById("factorsList").innerText = factorsList.join(', ');
            }
        }
    };

    if (mode === "commonFactors") {
        document.querySelector('.instructionBox').innerHTML = `
            <div class="instruction">Find all common factors of ${numbers[0]} and ${numbers[1]}</div>
        `;
        document.querySelector('.instructionBox').style.backgroundColor = "#ffcc00"; // Yellow background
        const dividerSection = document.createElement('div');
        dividerSection.innerHTML = `
            <hr class="blue-divider">
            <div id="factorsList">1</div>
            <hr class="blue-divider">
        `;
        document.querySelector('.container').insertBefore(dividerSection, document.querySelector('.legend'));
        
        const completionSection = document.createElement('div');
        completionSection.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center;">
                <span style="margin-right: 10px;">Did you find all the factors?</span>
                <button id="allFactorsButton">Yes</button>
            </div>
        `;
        document.querySelector('.container').insertBefore(completionSection, document.querySelector('.legend'));
        
        document.getElementById('allFactorsButton').addEventListener('click', function() {
            const correctFactors = findCommonFactors(numbers[0], numbers[1]);
            if (arraysEqual(factorsList.sort((a, b) => a - b), correctFactors.sort((a, b) => a - b))) {
                alert("Hooray! You found them ALL!");
            } else {
                alert("Oops! Some common factors are missing.\nExplore and FIND them ALL!");
                document.getElementById('allFactorsButton').addEventListener('click', function() {
                    if (arraysEqual(factorsList.sort((a, b) => a - b), correctFactors.sort((a, b) => a - b))) {
                        alert("Hooray! You found them ALL!");
                    } else {
                        alert(`Nice try! But some factors are still missing.\nThe common factors of ${numbers[0]} and ${numbers[1]} are ${correctFactors.join(', ')}. Which ones did you miss?`);
                    }
                });
            }
        });
    }

    if (showAnswer == 1) {
        document.getElementById("inputNumber").value = answer;
        checkGuess();
    }

    window.addEventListener('resize', function () {
        if (document.getElementById("inputNumber").value) {
            checkGuess();
        }
    });

    console.log("Mode parameter value: ", mode);

    function findCommonFactors(a, b) {
        const min = Math.min(a, b);
        const factors = [];
        for (let i = 1; i <= min; i++) {
            if (a % i === 0 && b % i === 0) {
                factors.push(i);
            }
        }
        return factors;
    }

    function arraysEqual(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }
});
