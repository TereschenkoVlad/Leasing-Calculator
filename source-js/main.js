var button = document.querySelector('button');
var form = document.querySelector('form');
var resultBlock = document.querySelector('.result-block')
let popup = document.querySelector('.popup')
let jsonData = []

let arrowBack = document.createElement('I')

let pdfDwnld = document.querySelector('#pdf')
pdfDwnld.addEventListener('click', renderPDF)

button.addEventListener('click', function () {
    resultBlock.classList.add('active')
    pdfDwnld.style.visibility = 'visible'
    popup.classList.add('pop-active')

    arrowBack.setAttribute('class', 'arrow-back fas fa-arrow-right')
    popup.appendChild(arrowBack)

    jsonData = []
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
                numberOfMonth: (i + 1).toString(),
                laseObj: (+needToPay).toFixed(2).toString(),
                paymentMonth: (+payMonth).toFixed(2).toString(),
                taxClient: (+needToPay / 100 * taxMounthC).toFixed(2).toString(),
                taxOne: oneTax.toString(),
                finalMonthPay: payment(startPrise, firstPay, oneTax, taxMounthC, payMonth).toFixed(2).toString()
            }

            jsonData[i] = monthToPay
            console.log(jsonData);

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
})

arrowBack.addEventListener('click', function () {
    popup.classList.remove('pop-active')
})

function renderPDF () {
    return printJS({
        printable: jsonData,
        properties: [
            { field: 'numberOfMonth', displayName: 'Місяць'},
            { field: 'laseObj', displayName: 'Вартість об\'єкту'},
            { field: 'paymentMonth', displayName: 'Повернення вартості об\'єкту'},
            { field: 'taxClient', displayName: 'Винагорода лізингодавця'},
            { field: 'taxOne', displayName: 'Комісія'},
            { field: 'finalMonthPay', displayName: 'Виплати в місяць'}
        ],
        type: 'json'
    })
}



form.addEventListener('submit', function (event) {
    event.preventDefault()
});

var inputsContainer = document.querySelector('.inputs-container');

inputsContainer.addEventListener('click', function () {
    resultBlock.classList.remove('active');
});



