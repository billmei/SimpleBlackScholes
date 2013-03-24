$('#volatility').tooltip({
    'trigger':'focus',
    'placement':'right'
});

var k = $('#strike').val();
var s = $('#priceunderlying').val();
var T = $('#expiretime').val();
var sigma = $('#volatility').val();
var d = $('#dividend').val();
var r = $('#riskfree').val();

$('#reset').on('click', function () {
    $('#mainForm')[0].reset();
});

$('#calculate').on('click', function() {

});