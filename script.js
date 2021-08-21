
function add (a, b) {
    return a + b;
}
function subtract (a, b) {
    return a - b;
}
function multiply (a, b) {
    return a * b;
}
function divide (a, b) {
    return a / b;
}
function operate (a, b, operation) {
    switch (operation) {
        case 'plus':
            return add(a, b);
        case 'minus':
            return subtract(a, b);
        case 'times':
            return multiply(a, b);
        case 'divide':
            return divide(a, b);
    }
}

const calcDisplay = {
    isOn: false,
    display: document.getElementById('current-number'),
    signDisplay: document.getElementById('sign-indicator'),
    operatorPressed: false,
    inOverflow: false,
    toggleSign() {
        if(this.inOverflow) {
            calculator.clear();
        }
        if(this.signDisplay.textContent === '') {
            this.signDisplay.textContent = '-';
        } else {
            this.signDisplay.textContent = '';
        }
    },
    getDisplay() {
        return this.display.textContent;
    },
    getDisplayAsNumber() {
        let displayNumber = Number(this.display.textContent);
        if(this.signDisplay.textContent === '-'){
            displayNumber *= -1;
        }
        return displayNumber;
    },
    setDisplay(s) {
        this.display.textContent = s;
    },
    setDisplayToNumber (num) {
        if(Math.abs(num) >= 10**12) {
            this.setDisplay('ERR-Overflow');   
            this.inOverflow = true;
            this.signDisplay.textContent = '';
        } else {
            const numAsString = String(Math.abs(num));
            if(numAsString.includes('.')) {
                this.setDisplay(numAsString.slice(0,13));
            } else {
                this.setDisplay(numAsString.slice(0,12));
            }
            if(num < 0) {
                this.signDisplay.textContent = '-';
            } else {
                this.signDisplay.textContent = '';
            }
        }
    },
    displayIsFull() {
        const currentDisplay = this.getDisplay();
        const maxDisplayLength = currentDisplay.includes('.') ? 13: 12;
        if(currentDisplay.length >= maxDisplayLength) {
            return true;
        } else {
            return false;
        }
    },
    inputDigit(num) {
        if(this.operatorPressedLast) {
            this.setDisplayToNumber(0);
            this.operatorPressedLast = false;
        } else if (this.inOverflow) {
            calculator.clear();
        }
        if(!this.displayIsFull()) {
            const currentDisplay = this.getDisplay();
            if(currentDisplay !== '0') {
                this.setDisplay(currentDisplay + num);
            } else {
                this.setDisplay(num);
            }
        }
    },
    inputDecimal() {
        if(this.operatorPressedLast) {
            this.setDisplayToNumber(0);
            this.operatorPressedLast = false;
        } else if (this.inOverflow) {
            calculator.clear();
        }
        if(!this.getDisplay().includes('.') && !this.displayIsFull()) {
            this.setDisplay(this.getDisplay() + '.');
        }
    },
    turnOn(){
        if(!this.isOn) {
            this.setDisplay(-888888888888)
            document.getElementById('number-display').style.animationPlayState = 'running';
            setTimeout(()=>{
                this.setDisplay('0');
                this.signDisplay.innerText='';
                this.isOn = true;
            }, 4000);
        }
    },
    del() {
        if (this.inOverflow) {
            calculator.clear();
        }
        this.setDisplay(this.getDisplay().slice(0, -1));
        if(this.getDisplay() === '') {
            this.setDisplayToNumber(0);
        }
    },

};

const calculator = {
    previousNumber: 0,
    currentOperator: '',
    repeatNumber: 0,
    consecutiveEquals: false,
    equals() {
        if (calcDisplay.inOverflow) {
            this.clear();
        }
        if(this.currentOperator !== '') {
            const currentNumber = calcDisplay.getDisplayAsNumber();
            let result;
            if(this.consecutiveEquals) {
                result = operate(currentNumber, this.repeatNumber, this.currentOperator);
            } else {
                result = operate(this.previousNumber, currentNumber, this.currentOperator);
                this.repeatNumber = currentNumber;
            }
            calcDisplay.setDisplayToNumber(result);
            this.consecutiveEquals = true;
            calcDisplay.operatorPressedLast = true;
        }
    },  
    pressOperator(operator){
        if (calcDisplay.inOverflow) {
            calculator.clear();
        }
        if(!this.consecutiveEquals && this.currentOperator !== '') {
            this.equals();
            this.consecutiveEquals = false;
        }
        this.currentOperator = operator;
        this.previousNumber = calcDisplay.getDisplayAsNumber();
        calcDisplay.operatorPressedLast = true;
        this.consecutiveEquals = false;
    },
    clear() {
        calcDisplay.setDisplayToNumber(0)
        calcDisplay.operatorPressedLast = false;
        calcDisplay.inOverflow = false;
        this.previousNumber = 0;
        this.currentOperator = '';
        this.repeatNumber = 0;
        this.consecutiveEquals = false;
    }
}

window.addEventListener('load', () => {
    for(let i=0; i <= 9; i++){
        document.getElementById(`button-${i}`).addEventListener('click', ()=>{
            if(calcDisplay.isOn) {
                calcDisplay.inputDigit(i);
            }
        });
    }
    for(const operator of ['plus', 'minus', 'times', 'divide']) {
        document.getElementById('button-'+operator).addEventListener('click',()=>{
            if(calcDisplay.isOn) {
                calculator.pressOperator(operator);
            }
        });
    }
    document.getElementById('button-plus-minus').addEventListener('click',()=>{
        if(calcDisplay.isOn) {
            calcDisplay.toggleSign();
        }
    });
    document.getElementById('button-on-clr').addEventListener('click',()=>{
        if(!calcDisplay.isOn){
            calcDisplay.turnOn();
        } else {
            calculator.clear();
        } 
    });
    document.getElementById('button-decimal').addEventListener('click',()=>{
        if(calcDisplay.isOn) {
            calcDisplay.inputDecimal();
        }
    });
    document.getElementById('button-del').addEventListener('click',()=>{
        if(calcDisplay.isOn) {
            calcDisplay.del();
        }
    });
    document.getElementById('button-equals').addEventListener('click',()=>{
        if(calcDisplay.isOn) {
            calculator.equals();
        }
    });
});