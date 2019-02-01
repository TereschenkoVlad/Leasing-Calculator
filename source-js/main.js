var button = document.querySelector('button');
var resultBlock = document.querySelector('.result-block')
button.addEventListener('click', function () {
    var startPrice = document.getElementById('how-much-cost').value;
    var termLeasing = document.getElementById('term-leasing').value;
    var tax = document.getElementById('leasing-procent').value;
    var extraPrice = document.getElementById('last-price').value;
    var showResult = document.querySelector('.result')
    var result = 0;
    function leasingCalculate(prise, lastPrice, term, tax) {
        result = (prise - lastPrice * (1/(Math.pow(1 + tax, term)))) * (tax/(1 -(Math.pow(1 + tax, -term))));
        return parseFloat(result.toFixed(2));
    }
    showResult.innerText = leasingCalculate(+startPrice, +extraPrice , +termLeasing, +tax / 12 / 100);
    resultBlock.classList.add('active')

});
