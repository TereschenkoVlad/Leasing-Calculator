$(document).ready(function () {
    var button = document.querySelector('button');
    var form = document.querySelector('form');
    var resultBlock = document.querySelector('.result-block')
    let popup = document.querySelector('.popup')
    let jsonData = []

    let isOpen = false

    let count = 0

    let detailsCont = document.createElement('DIV')
    detailsCont.classList.add('details-container')

    popup.appendChild(detailsCont)

    let titleDetails = document.createElement('SPAN')
    titleDetails.classList.add('title-details')
    titleDetails.classList.add('plus')
    titleDetails.innerHTML = 'Отримати більше інформації'
    detailsCont.appendChild(titleDetails)

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

    let getExtraInfo
    var payMonth

    button.addEventListener('click', function () {
        count = 0

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
        let fastAmortization = document.getElementById('fast-amortization')
        if (fastAmortization.checked) {
            termLeasing = termLeasing - (+termLeasing / 100 * 20).toFixed(0)
        }

        function leasingCalculate(startPrise, termLeasing, tax, firstPrice, armMonth, onceTax) {

            var taxMounthC = tax / 12;
            var oneTax = (startPrise / 100 * onceTax);
            var firstPay = startPrise / 100 * firstPrice;
            payMonth = (startPrise - firstPay) / +termLeasing
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


         getExtraInfo  = (jsonDataExtraObj) => {
            let extraInfoTitles = ['Щомісячна сума виплат:', 'Кінцева сума виплат:', 'Повна винагорода лізингодавця:', 'Комісія']
             function getNewExtraInfo () {
                 let extraInfoValue = [payMonth.toFixed(2), jsonDataExtraObj.finalMonthPay, jsonDataExtraObj.taxClient, jsonDataExtraObj.taxOne]
                 return extraInfoValue
             }
             getNewExtraInfo()

            titleDetails.style.borderBottomWidth = '0'
            let detailsContent = document.createElement('UL')
            detailsContent.classList.add('details-content')

            for (let i=0; i<4; i++) {
                let li = document.createElement('LI')
                let spanLeft = document.createElement('SPAN')
                spanLeft.innerText = extraInfoTitles[i]
                spanLeft.classList.add('span-left')
                let spanRight = document.createElement('SPAN')
                spanRight.innerText = getNewExtraInfo()[i]
                spanRight.classList.add('span-right')
                li.appendChild(spanLeft)
                li.appendChild(spanRight)
                detailsContent.appendChild(li)

                detailsContent.style.opacity = '1'
            }

            return detailsContent
         }

    })

    arrowBack.addEventListener('click', function () {

       if (isOpen) {
           if (titleDetails.classList.contains('minus')) {
               titleDetails.classList.remove('minus')
           }
           titleDetails.classList.add('plus')
           let extrContent = document.querySelector('.details-content')
           extrContent.classList.remove('extra-info-active')
           titleDetails.style.borderBottomWidth = '1.5px'

           if (count === 0) {
               detailsCont.removeChild(extrContent)
           }
           isOpen = !isOpen
       }

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



    titleDetails.addEventListener('click', () => {
        if (isOpen === false) {
            if (titleDetails.classList.contains('plus')) {
                titleDetails.classList.remove('plus')
            }
            titleDetails.classList.add('minus')
            if (count === 0) {
                detailsCont.appendChild(getExtraInfo(jsonData[jsonData.length-1]))
                let extrContent = document.querySelector('.details-content')
                extrContent.classList.add('extra-info-active')
                count++
            } else {
                let extrContent = document.querySelector('.details-content')
                extrContent.classList.add('extra-info-active')
            }

            titleDetails.style.borderBottomWidth = '0'
        } else  {
            if (titleDetails.classList.contains('minus')) {
                titleDetails.classList.remove('minus')
            }
            titleDetails.classList.add('plus')
            let extrContent = document.querySelector('.details-content')
            extrContent.classList.remove('extra-info-active')
            titleDetails.style.borderBottomWidth = '1.5px'

            if (count === 0) {
                detailsCont.removeChild(extrContent)
            }
        }

        isOpen = !isOpen
    })

    // var userScroll = $(document).scrollTop();
    //
    // $(window).on('scroll', function() {
    //     var newScroll = $(document).scrollTop();
    //     if(userScroll - newScroll > 1 || newScroll - userScroll > 1){
    //         $('#moreInfo')[0].style.opacity = '1'
    //     } else {
    //         $('#moreInfo')[0].style.opacity = '0'
    //     }
    // })

    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            $('#moreInfo i')[0].classList.add('fa-arrow-circle-up')
            $('#moreInfo i')[0].classList.remove('fa-arrow-circle-down')
        }
        if (($(window).scrollTop() + $(window).height() + 250) < $(document).height()) {
            $('#moreInfo i')[0].classList.add('fa-arrow-circle-down')
            $('#moreInfo i')[0].classList.remove('fa-arrow-circle-up')
        }
    })


    $('#moreInfo').click(function () {

        let scrollArrow = $('#moreInfo i')[0]
        console.log(scrollArrow);

        console.log(scrollArrow.classList.contains('fa-arrow-circle-down'));
        if (scrollArrow.classList.contains('fa-arrow-circle-down')) {
           scrollArrow.classList.remove('fa-arrow-circle-down')
           scrollArrow.classList.add('fa-arrow-circle-up')
            $([document.documentElement, document.body]).animate({
                scrollTop: $('.title-details').offset().top - 210
            }, 1000)
        } else {
           scrollArrow.classList.remove('fa-arrow-circle-up')
           scrollArrow.classList.add('fa-arrow-circle-down')
            $([document.documentElement, document.body]).animate({
                scrollTop: 0
            }, 1000)
       }


    })

    form.addEventListener('submit', function (event) {
        event.preventDefault()
    });

    var inputsContainer = document.querySelector('.inputs-container');

    inputsContainer.addEventListener('click', function () {
        resultBlock.classList.remove('active');
    });
})

