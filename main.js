$('.align-right').tooltip({
    'trigger':'focus',
    'placement':'right'
});

$('#expiretime').tooltip({
    'trigger':'focus',
    'placement':'right'
})

$('#reset').on('click', function () {
    $('#mainForm')[0].reset();
});

$('#calculate').on('click', function() {
    validateInput(); // this function handles the rest, including calculation and displaying the result.
});

function validateInput () {
    var flavour;
    var type;

    var european = $('#european').prop('checked');
    var american = $('#american').prop('checked');
    var call = $('#call').prop('checked');
    var put = $('#put').prop('checked');
    var both = $('#both').prop('checked');

    var K = $('#strike').val();
    var S = $('#priceunderlying').val();
    var deltaT = $('#expiretime').val()/365;
    var sigma = $('#volatility').val()/100;
    var q = $('#dividend').val()/100;
    var r = $('#riskfree').val()/100;

    var result = calculateBlackScholes(K, S, deltaT, sigma, q, r); // result[0] is a call, result [1] is a put.
    result[0] = Math.round(result[0]*1000000)/1000000; // Rounds to the 6th decimal place
    result[1] = Math.round(result[1]*1000000)/1000000;

    if (european) {
        flavour = "european";
    } else if (american) {
        flavour = "american";
    } else {
        flavour = "Option Flavour Error";
    }

    if (call) {
        type = "call";
        displayResult(flavour, type, K, S, deltaT, sigma, q, r, result[0]);
    } else if (put) {
        type = "put";
        displayResult(flavour, type, K, S, deltaT, sigma, q, r, result[1]);
    } else if (both) {
        displayResult(flavour, "call", K, S, deltaT, sigma, q, r, result[0]);
        displayResult(flavour, "put", K, S, deltaT, sigma, q, r, result[1]);
    } else {
        type = "Option Type Error";
        alert("Hmm, something went wrong when trying to select between call or put options.");
    }
}

function displayResult (flavour, type, K, S, deltaT, sigma, q, r, result) {
    alert(type + "is : " + result);
}

function calculateBlackScholes (K, S, deltaT, sigma, q, r) {
    var d1 = (Math.log(S/K) + (r - q + (Math.pow(sigma,2) * 0.5))*(deltaT))/(sigma * Math.sqrt(deltaT));
    var d2 = d1 - (sigma * Math.sqrt(deltaT));

    var N_d1 = jstat.pnorm(d1,0,1);
    var N_d2 = jstat.pnorm(d2,0,1);
    var N_d1negative = jstat.pnorm(-d1,0,1);
    var N_d2negative = jstat.pnorm(-d2,0,1);

    if (european) {
        var CallPrice = S * Math.exp((-1) * q * (deltaT)) * N_d1 - K * Math.exp((-1) * r * deltaT) * N_d2;
        var PutPrice = K * Math.exp((-1) * r * deltaT) * N_d2negative - S * Math.exp((-1) * q * deltaT) * N_d1negative;
    } else if (american) {
        alert("Sorry, we're still working on the formula for calculating American options. Check back soon!");
    } else {
        alert("Hmm, something went wrong when trying to select between American or European options.")
    }

    return [CallPrice, PutPrice, d1, d2, N_d1, N_d2];
}