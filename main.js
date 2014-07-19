$(document).ready(function() {
    $('.align-right').tooltip({
        'trigger':'focus',
        'placement':'right'
    });

    $('#expiretime').tooltip({
        'trigger':'focus',
        'placement':'right'
    });

    var output = $('#output');

    $('#reset').on('click', function () {
        $('#mainForm')[0].reset();
        clearErrorMessages();
        output.animate({'opacity':0},150);
    });

    $('#calculate').on('click', function() {
        validateInput(); // this function handles the rest, including calculation and displaying the result.
    });

    var KContainer = $('#strike').parent().parent();
    var SContainer = $('#priceunderlying').parent().parent();
    var deltaTContainer = $('#expiretime').parent().parent();
    var sigmaContainer = $('#volatility').parent().parent();
    var qContainer = $('#dividend').parent().parent();
    var rContainer = $('#riskfree').parent().parent();

    var containers = [KContainer, SContainer, deltaTContainer, sigmaContainer , qContainer, rContainer];

    function clearErrorMessages () {
        // reset all previous error messages
        $.each(containers, function(index, value){
            $(this).removeClass('error');
            $(this).removeClass('warning');
            $(this).removeClass('info');
            $(this).popover('destroy');
        });
    }

    function validateInput () {
        //------- Variables ------//
        // assume we don't pass validation until we know that we did.
        var KValidated = false;
        var SValidated = false;
        var deltaTValidated = false;
        var sigmaValidated = false;
        var qValidated = false;
        var rValidated = false;

        var flavour;
        var type;

        var european = $('#european').prop('checked');
        var american = $('#american').prop('checked');
        var call = $('#call').prop('checked');
        var put = $('#put').prop('checked');
        // var both = $('#both').prop('checked'); // Not currently used.

        var K = $('#strike').val();
        var S = $('#priceunderlying').val();
        var deltaT = $('#expiretime').val()/365.0;
        var sigma = $('#volatility').val()/100.0;
        var q = $('#dividend').val()/100.0;
        var r = $('#riskfree').val()/100.0;

        var deltaTUnConverted = $('#expiretime').val();
        var sigmaUnConverted = $('#volatility').val();
        var qUnConverted = $('#dividend').val();
        var rUnConverted = $('#riskfree').val();

        //------- Validation ------//
        clearErrorMessages();

        if (K.length === 0 || typeof K.length === 'undefined'){
            KContainer.addClass('error');
            KContainer.popover({'content':'Please enter a strike price.','placement':'right','trigger':'manual'});
            KContainer.popover('show');
        } else if (K < 0) {
            KContainer.addClass('error');
            KContainer.popover({'content':'The strike price must be positive.','placement':'right','trigger':'manual'});
            KContainer.popover('show');
        } else if (K >= 0) {
            KValidated = true;
        } else {
            KContainer.addClass('error');
            KContainer.popover({'content':'The strike price must be a number.','placement':'right','trigger':'manual'});
            KContainer.popover('show');
        }

        if (S.length === 0 || typeof S.length === 'undefined'){
            SContainer.addClass('error');
            SContainer.popover({'content':'Please enter a stock price.','placement':'right','trigger':'manual'});
            SContainer.popover('show');
        } else if (S < 0) {
            SContainer.addClass('error');
            SContainer.popover({'content':'The stock price must be positive.','placement':'right','trigger':'manual'});
            SContainer.popover('show');
        } else if (S >= 0) {
            SValidated = true;
        } else {
            SContainer.addClass('error');
            SContainer.popover({'content':'The stock price must be a number.','placement':'right','trigger':'manual'});
            SContainer.popover('show');
        }

        if (deltaTUnConverted.length === 0 || typeof deltaTUnConverted.length === 'undefined'){
            deltaTContainer.addClass('error');
            deltaTContainer.popover({'content':'Please enter a time to expiration.','placement':'right','trigger':'manual'});
            deltaTContainer.popover('show');
        } else if (deltaT < 0) {
            deltaTContainer.addClass('error');
            deltaTContainer.popover({'content':'The time to expiration must be positive.','placement':'right','trigger':'manual'});
            deltaTContainer.popover('show');
        } else if (deltaT >= 0) {
            deltaTValidated = true;
        } else {
            deltaTContainer.addClass('error');
            deltaTContainer.popover({'content':'The time to expiration must be a number.','placement':'right','trigger':'manual'});
            deltaTContainer.popover('show');
        }

        if (sigmaUnConverted.length === 0 || typeof sigmaUnConverted.length === 'undefined'){
            sigmaContainer.addClass('error');
            sigmaContainer.popover({'content':'Please enter a volatility.','placement':'right','trigger':'manual'});
            sigmaContainer.popover('show');
        } else if (sigma < 0) {
            sigmaContainer.addClass('error');
            sigmaContainer.popover({'content':'The volatility must be positive.','placement':'right','trigger':'manual'});
            sigmaContainer.popover('show');
        } else if (sigma >= 0 && sigma < 1) {
            sigmaValidated = true;
        } else if (sigma >= 1) {
            sigmaContainer.addClass('warning');
            sigmaContainer.popover({'content':'Are you sure you want the volatility to be greater than 100%?','placement':'right','trigger':'manual'});
            sigmaContainer.popover('show');
            sigmaValidated = true;
        } else {
            sigmaContainer.addClass('error');
            sigmaContainer.popover({'content':'The volatility must be a number.','placement':'right','trigger':'manual'});
            sigmaContainer.popover('show');
        }

        if (qUnConverted.length === 0 || typeof qUnConverted.length === 'undefined') {
            qContainer.addClass('info');
            qContainer.popover({'content':'You didn\'t specify a dividend, so the default is 0 (no dividend).','placement':'right','trigger':'manual'});
            qContainer.popover('show');
            q = 0; // default dividend is zero (no dividend)
            qValidated = true;
        } else if (q < 0) {
            qContainer.addClass('error');
            qContainer.popover({'content':'The dividend yield be positive.','placement':'right','trigger':'manual'});
            qContainer.popover('show');
        } else if (q >= 0 && q < 1) {
            qValidated = true;
        } else if (q >= 1) {
            qContainer.addClass('warning');
            qContainer.popover({'content':'Are you sure you want a dividend yield greater than 100%?','placement':'right','trigger':'manual'});
            qContainer.popover('show');
            qValidated = true;
        } else {
            qContainer.addClass('error');
            qContainer.popover({'content':'The dividend yield must be a number.','placement':'right','trigger':'manual'});
            qContainer.popover('show');
        }

        if (rUnConverted.length === 0 || typeof rUnConverted.length === 'undefined'){
            rContainer.addClass('error');
            rContainer.popover({'content':'Please enter a risk-free interest rate.','placement':'right','trigger':'manual'});
            rContainer.popover('show');
        } else if (r < 0) {
            rContainer.addClass('error');
            rContainer.popover({'content':'The risk-free interest rate must be positive.','placement':'right','trigger':'manual'});
            rContainer.popover('show');
        } else if (r >= 0 && r < 1) {
            rValidated = true;
        } else if (r >= 1) {
            rContainer.addClass('warning');
            rContainer.popover({'content':'Are you sure you want a risk-free interest rate greater than 100%?','placement':'right','trigger':'manual'});
            rContainer.popover('show');
            rValidated = true;
        } else {
            rContainer.addClass('error');
            rContainer.popover({'content':'The risk-free interest rate must be a number.','placement':'right','trigger':'manual'});
            rContainer.popover('show');
        }

        if (KValidated && SValidated && deltaTValidated && sigmaValidated && qValidated && rValidated) {
            //------- Calculation ------//
            var result = calculateBlackScholes(K, S, deltaT, sigma, q, r); // result[0] is a call, result[1] is a put.

            if (european) {
                flavour = "european";
            } else if (american) {
                flavour = "american";
            } else {
                flavour = "Option Flavour Error";
            }

            //------- Display ------//
            if (call) {
                type = "call";
                displayResult(flavour, type, result[2], result[3], result[4], result[5], result[0]);
            } else if (put) {
                type = "put";
                displayResult(flavour, type, result[2], result[3], result[4], result[5], result[1]);
            } else {
                type = "Option Type Error";
                alert("Hmm, something went wrong when trying to select between call or put options.");
            }
        }
    }

    function displayResult (flavour, type, d1, d2, N_d1, N_d2, result) {
        var resultHead = (Math.floor(result*100)/100).toFixed(2); // first two decimal places after the period
        var resultTail = Math.floor(result*1000000) - Math.floor(result*100)*10000; // next four decimal places (6 decimal places total)
        output.animate({'opacity':0},150);
        output.html('<h3>' + flavour + ' ' + type + '</h3><div class="price">$' + resultHead + '<span class="more-digits">' + resultTail + '</span></div><table class="details"><tr><td>d<sub>1</sub></td><td>d<sub>2</sub></td><td>N(d<sub>1</sub>)</td><td>N(d<sub>2</sub>)</td></tr><tr><td>' + d1.toFixed(6) + '</td><td>' + d2.toFixed(6) + '</td><td>' + N_d1.toFixed(6) + '</td><td>' + N_d2.toFixed(6) + '</td></tr></table>');
        output.animate({'opacity':1},150);
        $('html,body').animate({
            scrollTop: $('#output').offset().top
        }, 150);
    }

    function calculateBlackScholes (K, S, deltaT, sigma, q, r) {
        var d1 = (Math.log(S/K) + (r - q + (Math.pow(sigma,2) * 0.5))*(deltaT))/(sigma * Math.sqrt(deltaT));
        var d2 = d1 - (sigma * Math.sqrt(deltaT));

        var CallPrice;
        var PutPrice;
        var N_d1 = jstat.pnorm(d1,0,1);
        var N_d2 = jstat.pnorm(d2,0,1);
        var N_d1negative = jstat.pnorm(-d1,0,1);
        var N_d2negative = jstat.pnorm(-d2,0,1);

        if (european) {
            CallPrice = S * Math.exp((-1) * q * (deltaT)) * N_d1 - K * Math.exp((-1) * r * deltaT) * N_d2;
            PutPrice = K * Math.exp((-1) * r * deltaT) * N_d2negative - S * Math.exp((-1) * q * deltaT) * N_d1negative;
        } else if (american) {
            alert("Sorry, we're still working on the formula for calculating American options. Check back soon!");
        } else {
            alert("Hmm, something went wrong when trying to select between American or European options.");
        }

        return [CallPrice, PutPrice, d1, d2, N_d1, N_d2];
    }
});
