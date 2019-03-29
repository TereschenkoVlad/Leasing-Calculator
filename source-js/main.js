var button = document.querySelector('button');
var form = document.querySelector('form');
var resultBlock = document.querySelector('.result-block')
button.addEventListener('click', function () {
    var startPrice = document.getElementById('how-much-cost').value;
    var termLeasing = document.getElementById('term-leasing').value;
    var tax = document.getElementById('leasing-procent').value;
    var firstPrice = document.getElementById('first-price').value;
    var armMonth = document.querySelector('#arm-month')
    var onceTax = document.querySelector('#once-tax').value

    function leasingCalculate(startPrise, termLeasing, tax, firstPrice, armMonth, onceTax) {

        var taxMounthC = tax / 12;
        var oneTax = (startPrise / 100 * onceTax);
        var firstPay = startPrise / 100 * firstPrice;
        var payMonth = (startPrise - firstPay) / termLeasing
        var needToPay = startPrise
        resultBlock.innerHTML = ''
        let table = document.createElement('TABLE')
        table.setAttribute('class', 'responstable')
        let firstTr = document.createElement('TR')
        resultBlock.appendChild(table)
        table.appendChild(firstTr)
        let tableNames = ['Місяць', "Вартість об'єкту", "Повернення вартості об'єкту", 'Винагорода лізингодавця', 'Комісія', 'Виплати в місяць']
        for (m=0; m<6; m++) {
            let th = document.createElement('TH')
            th.innerText = tableNames[m]
            firstTr.appendChild(th)
        }
        for (let i=0; i<termLeasing; i++) {
            function payment (startPrise, firstPay, oneTax, taxMounthC, payMonth) {
                var paymentMonth = 0;
                if (i === 0) {
                    paymentMonth = firstPay + oneTax + (needToPay / 100 * taxMounthC) + payMonth
                    needToPay = startPrise - paymentMonth;
                    return paymentMonth;
                } else  {
                    paymentMonth = payMonth + (needToPay / 100 * taxMounthC)
                    needToPay -= paymentMonth
                    return paymentMonth
                }
            }

            if (i) {
                oneTax = 0
            }

            let monthToPay = {
                numberOfMonth: i + 1,
                laseObj: (+needToPay).toFixed(2),
                paymentMonth: (+payMonth).toFixed(2),
                taxClient: (+needToPay / 100 * taxMounthC).toFixed(2),
                taxOne: oneTax,
                finalMonthPay: payment(startPrise, firstPay, oneTax, taxMounthC, payMonth).toFixed(2)
            }

            if (!i) {
                monthToPay.paymentMonth = (payMonth + firstPay).toFixed(2)
            }

            let tr = document.createElement('TR')
            table.appendChild(tr)
            for (j=0; j<6; j++) {
                let td = document.createElement('TD')
                td.innerHTML = monthToPay[Object.keys(monthToPay)[j]]
                tr.appendChild(td)
            }
        }
    }
    leasingCalculate(startPrice, termLeasing, tax, firstPrice, armMonth, onceTax)
    resultBlock.classList.add('active')
    $(document).ready(function(){
        $('.single-item-rtl').slick({
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: false
        });
    });
})


form.addEventListener('submit', function (event) {
    event.preventDefault()
});

var inputsContainer = document.querySelector('.inputs-container');

inputsContainer.addEventListener('click', function () {
    resultBlock.classList.remove('active');
    console.log(2222)
});



