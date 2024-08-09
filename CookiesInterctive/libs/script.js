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
        <div id="chocolateRow">
            <div class="instruction">Chocolate Chip Cookies:</div>
            <div id="chocolateCookies" class="cookie-container"></div>
            <span id="chocolateLeft" class="error"></span>
        </div>
        <div id="oatmealRow">
            <div class="instruction">Oatmeal Raisin Cookies:</div>
            <div id="oatmealCookies" class="cookie-container"></div>
            <span id="oatmealLeft" class="error"></span>
        </div>
        <br>
        <div id="message" class="error"></div>
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

    function calculateCookieSize(containerWidth, cookiesPerRow) {
        var maxSize = 30;
        var minSize = 0;
        var size = Math.floor(containerWidth / cookiesPerRow) - 2; // 2px for margins
        return Math.max(Math.min(size, maxSize), minSize);
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
            chocolateDiv.innerHTML = "";
            oatmealDiv.innerHTML = "";
            chocolateLeftSpan.innerHTML = "";
            oatmealLeftSpan.innerHTML = "";
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
        var cookieSize = calculateCookieSize(containerWidth, x);

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
            chocolateLeftSpan.innerHTML = "<br>Oops! The last row does not have the same number of cookies as the rest. <br>" + x + " is not a factor of " + chocolateCount + ". Try another number.";
        }

        if (oatmealLeft !== 0) {
            oatmealLeftSpan.innerHTML = "<br>Oops! The last row does not have the same number of cookies as the rest. <br>" + x + " is not a factor of " + oatmealCount + ". Try another number.";
        }

        legend.style.display = "block"; // Always show the legend
    };

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
});
