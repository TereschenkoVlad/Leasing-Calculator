var button = document.querySelector('button');
var form = document.querySelector('form');
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

form.addEventListener('submit', function (event) {
    event.preventDefault()
})

var inputsContainer = document.querySelector('.inputs-container')

inputsContainer.addEventListener('click', function () {
    resultBlock.classList.remove('active')
    console.log(2222)
})

