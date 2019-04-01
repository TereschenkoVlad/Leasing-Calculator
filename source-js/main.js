$(document).ready(function () {
    var button = document.querySelector('button');
    var form = document.querySelector('form');
    var resultBlock = document.querySelector('.result-block')
    let popup = document.querySelector('.popup')
    let jsonData = []


    let selectObj = document.querySelector('select')

    selectObj.addEventListener('change', () => {
        let monthArmFild = document.getElementById('arm-month')
        switch (selectObj.value) {
            case 'Будівлі, споруди, земля' :
                monthArmFild.value = '0.7'
                break
            case 'автотранспорт, е/м прилади' :
                monthArmFild.value = '3.33'
                break
            case 'комп*ютери, телефони' :
                monthArmFild.value = '5'
                break
            default :
                monthArmFild.value = '2'
        }
    })

    let arrowBack = document.createElement('I')

    setTimeout(() => {
        arrowBack.setAttribute('class', 'arrow-back fas fa-arrow-right')
        popup.appendChild(arrowBack)
    }, 2000)

    let pdfDwnld = document.querySelector('#pdf')
    pdfDwnld.addEventListener('click', renderPDF)

    var loadingDiv = document.getElementById('loading');

    function hideSpinner() {
        loadingDiv.style.visibility = 'hidden';
    }

    let detailsCont = document.createElement('DIV')
    detailsCont.classList.add('details-container')

    button.addEventListener('click', function () {
        loadingDiv.style.visibility = 'visible';

        popup.classList.add('pop-active')
        resultBlock.classList.add('active')
        pdfDwnld.style.visibility = 'visible'

        jsonData = []

        let generalPayMonth = 0
        let generalTaxClient = 0
        let generalFinalPayMonth = 0

        let lastRowObj = {}
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
            var payMonth = (startPrise - firstPay) / +termLeasing
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
                    if (!i) {
                        paymentMonth = firstPay + oneTax + (needToPay / 100 * taxMounthC) + payMonth
                        needToPay = startPrise - payMonth - firstPay;
                        return paymentMonth;
                    }
                    paymentMonth = payMonth + (needToPay / 100 * taxMounthC)
                    needToPay -= payMonth
                    return paymentMonth
                }

                if (i) {
                    oneTax = 0
                }

                let monthToPay = {
                    numberOfMonth: (i + 1),
                    laseObj: (+needToPay).toFixed(2),
                    paymentMonth: (payMonth).toFixed(2),
                    taxClient: (needToPay / 100 * taxMounthC).toFixed(2),
                    taxOne: oneTax,
                    finalMonthPay: +payment(startPrise, firstPay, oneTax, taxMounthC, payMonth).toFixed(2)
                }

                jsonData[i] = monthToPay

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

                if (!i) {
                    generalPayMonth = generalPayMonth + payMonth + firstPay
                } else  {
                    generalPayMonth = generalPayMonth + payMonth
                }

                generalTaxClient = generalTaxClient + (needToPay / 100 * taxMounthC)

                generalFinalPayMonth += monthToPay.finalMonthPay
            }

            lastRowObj = {
                numberOfMonth: 'Сумма',
                laseObj: '',
                paymentMonth: +generalPayMonth.toFixed(2),
                taxClient: +generalTaxClient.toFixed(2),
                taxOne: (startPrise / 100 * onceTax).toFixed(2),
                finalMonthPay: +generalFinalPayMonth.toFixed(2)
            }

            jsonData[jsonData.length] = lastRowObj

            let lastTableRow = document.createElement('TR')
            table.appendChild(lastTableRow)
            for (j=0; j<6; j++) {
                let lastTd = document.createElement('TD')
                lastTd.innerHTML = lastRowObj[Object.keys(lastRowObj)[j]]
                lastTableRow.appendChild(lastTd)
            }
        }
        leasingCalculate(startPrice, termLeasing, tax, firstPrice, armMonth, onceTax)
        setTimeout(hideSpinner, 500)
    })

    arrowBack.addEventListener('click', function () {
        popup.classList.remove('pop-active')
        return setTimeout(() => {
            $("html, body").animate({ scrollTop: 0 }, 600)
        }, 500)
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
})



