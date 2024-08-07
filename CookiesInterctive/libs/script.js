// ?numbers=60|40&objects%20=%20cookies|chocolate,%20oatmeal&showAnswer=1&answer=20


document.addEventListener("DOMContentLoaded", function () {
    document.body.innerHTML = `
    <div class="container">
        <div class="instructionBox">
            <div class="instruction">Guess the number of cookies in each row at the bakery.</div>
            <div class="instruction"><i>Press the "Check" button.</i></div>
        </div>
        <input type="number" id="inputNumber" placeholder="Enter a number">
        <button id="checkButton" onclick="checkGuess()">Check</button>
        <div id="chocolateRow">
            <div class="instruction">Chocolate Chip Cookies:</div>
            <div id="chocolateCookies"></div>
            <span id="chocolateLeft" class="error"></span>
        </div>
        <div id="oatmealRow">
            <div class="instruction">Oatmeal Raisin Cookies:</div>
            <div id="oatmealCookies"></div>
            <span id="oatmealLeft" class="error"></span>
        </div>
        <br>
        <div id="message" class="error"></div>
    </div>
    `;

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Extract numbers from URL parameter
    var numbersParam = getUrlParameter('numbers');
    var numbers = numbersParam.split('|').map(Number);
    var chocolateCount = numbers[0];
    var oatmealCount = numbers[1];
    var showAnswer = getUrlParameter('showAnswer');
    var answer = getUrlParameter('answer') ? getUrlParameter('answer') : 0;

    window.checkGuess = function () {
        var x = parseInt(document.getElementById("inputNumber").value);
        var chocolateDiv = document.getElementById("chocolateCookies");
        var oatmealDiv = document.getElementById("oatmealCookies");
        var chocolateLeftSpan = document.getElementById("chocolateLeft");
        var oatmealLeftSpan = document.getElementById("oatmealLeft");
        var messageDiv = document.getElementById("message");

        if (isNaN(x) || x <= 0) {
            messageDiv.innerHTML = "<div class='error'>Please enter a valid positive number.</div>";
            chocolateDiv.innerHTML = "";
            oatmealDiv.innerHTML = "";
            chocolateLeftSpan.innerHTML = "";
            oatmealLeftSpan.innerHTML = "";
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
            messageDiv.innerHTML = "<div class='error'>The number you entered does not allow arranging cookies in rows. Try making another guess.</div>";
            return;
        }
        if (oatmealLeft === 0 && chocolateLeft === 0) {
            messageDiv.innerHTML = "<div class='success'>Bingo! Is there also another way of doing the same and hence more than 1 answer? Try!</div>";
        }

        for (var i = 0; i < chocolateRows; i++) {
            var row = "";
            for (var j = 0; j < x; j++) {
                row += "<div class='cookie chocolate'>C</div>";
            }
            chocolateDiv.innerHTML += row + "<br>";
        }
        var extraChocolate = chocolateCount % x; // Calculate the number of additional chocolate cookies
        for (var i = 0; i < extraChocolate; i++) { // Add extra chocolate cookies to the chocolateDiv
            chocolateDiv.innerHTML += "<div class='cookie chocolate flash leftover'>C</div>";
        }

        for (var i = 0; i < oatmealRows; i++) {
            var row = "";
            for (var j = 0; j < x; j++) {
                row += "<div class='cookie oatmeal'>O</div>";
            }
            oatmealDiv.innerHTML += row + "<br>";
        }

        var extraOatmeal = oatmealCount % x; // Calculate the number of additional oatmeal cookies
        for (var i = 0; i < extraOatmeal; i++) { // Add extra oatmeal cookies to the oatmealDiv
            oatmealDiv.innerHTML += "<div class='cookie oatmeal flash leftover'>O</div>";
        }

        if (chocolateLeft !== 0) {
            chocolateLeftSpan.innerHTML = "Oops! The last row does not have same number of cookies as the rest. <br>" + x + " is not a factor of " + chocolateCount + ". Try another number.";
        }

        if (oatmealLeft !== 0) {
            oatmealLeftSpan.innerHTML = "Oops! The last row does not have same number of cookies as the rest. <br>" + x + " is not a factor of " + oatmealCount + ". Try another number.";
        }
    };

    if (showAnswer == 1) {
        document.getElementById("inputNumber").value = answer;
        checkGuess();
    }
});
