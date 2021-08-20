
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
function operate (a, b, operator) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case 'x':
            return multiply(a, b);
        case '/':
            return divide(a, b);
    }
}

const calcDisplay = {
    isOn: false,
    display: document.getElementById('current-number'),
    signDisplay: document.getElementById('sign-indicator'),
    toggleSign() {
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
        if(!this.getDisplay.includes('.') && !this.displayIsFull()) {
            this.setDisplay(currentDisplay + '.');
        }
    }
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
};

window.addEventListener('load', () => {
    for(let i=0; i <= 9; i++){
        document.getElementById(`button-${i}`).addEventListener('click', ()=>{
            calcDisplay.inputDigit(i);
        });
    }
    document.getElementById('button-plus-minus').addEventListener('click',()=>{
        calcDisplay.toggleSign();
    });
    document.getElementById('button-on-clr').addEventListener('click',()=>{
        if(!calcDisplay.isOn){
            calcDisplay.turnOn();
        } else {
            calcDisplay.setDisplayToNumber(0)
        } 
    });
    document.getElementById('button-decimal').addEventListener('click',()=>{
        calcDisplay.inputDecimal();
    });
});