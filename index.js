const calculator = {
    displayNumber: '0',
    operator: null,
    firstNumber: null,
    isWaitForSecondNumber: false,
};

function updateDisplay() {
    document.querySelector('#displayNumber').innerText = calculator.displayNumber;
}

function clearCalculator() {
    calculator.displayNumber = '0';
    calculator.operator = null;
    calculator.firstNumber = null;
    calculator.isWaitForSecondNumber = false;
}

function inputDigit(digit) {
    if (calculator.displayNumber === '0') {
        calculator.displayNumber = digit;
    } else {
        calculator.displayNumber += digit;
    }
}

function backspace() {
    calculator.displayNumber = calculator.displayNumber.slice(0, -1);
    if (calculator.displayNumber === '') {
        calculator.displayNumber = '0';
    }
}

function handleOperator(operator) {
    if (!calculator.isWaitForSecondNumber) {
        calculator.operator = operator;
        calculator.isWaitForSecondNumber = true;
        calculator.firstNumber = calculator.displayNumber;
        calculator.displayNumber = '0';
    } else {
        alert("Anda belum menetapkan operator");
    }

}

let Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})



function performCalculation() {
    if (calculator.firstNumber == null || calculator.operator == null) {
        Toast.fire({
            icon: 'warning',
            title: 'Anda belum menetapkan operator',
            color: '#fff',
            background: '#ffa500',
        })
        return;
    }

    let firstNumber = parseFloat(calculator.firstNumber);
    let secondNumber = parseFloat(calculator.displayNumber);

    let result = 0;
    if (calculator.operator === '+') result = firstNumber + secondNumber
    if (calculator.operator === '-') result = firstNumber - secondNumber
    if (calculator.operator === 'x') result = firstNumber * secondNumber
    if (calculator.operator === '/') result = firstNumber / secondNumber

    calculator.result = firstNumber;
    calculator.isWaitForSecondNumber = false;

    // objek yang akan dikirimkan sebagai argumen fungsi putHistory()
    const history = {
        firstNumber: calculator.firstNumber,
        secondNumber: calculator.displayNumber,
        operator: calculator.operator,
        result: result
    }
    // console.log(history);
    putHistory(history);
    calculator.displayNumber = result;
    renderHistory();
}

const buttons = document.querySelectorAll('button');
for (const button of buttons) {
    button.addEventListener('click', function (event) {
        // mendapatkan objek elemen yang diklik
        const target = event.target;

        if (target.classList.contains('clear')) {
            clearCalculator();
            updateDisplay();
            return;
        }

        if (target.classList.contains('backspace')) {
            backspace();
            updateDisplay();
            return;
        }

        if (target.classList.contains('equal')) {
            performCalculation();
            updateDisplay();
            return;
        }

        if (target.classList.contains('operator')) {
            handleOperator(target.innerText);
            return;
        }

        inputDigit(target.innerText);
        updateDisplay();
    });
}

