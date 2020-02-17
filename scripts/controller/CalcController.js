class CalcController {
    constructor() {
        this._operation = []
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate
        this.initialize()
        this.initButtonsEvents();
    }

    initialize(){
        this.setDisplayDateTime()
        setInterval(()=>{
            this.setDisplayDateTime()
        }, 1000)
        this.setLastNumberToDisplay()
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace('btn-','')
                this.execBtn(textBtn)
            })
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = 'pointer'
            })
        })
    }

    addEventListenerAll(element, events, callback){
        events.split(' ').forEach(event => {
            element.addEventListener(event, callback, false)
        })
    }

    // OPERATIONS
    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll()
                break
            case 'ce':
                this.clearEntry()
                break
            case 'soma':
                this.addOperation('+')
                break
            case 'subtracao':
                this.addOperation('-')
                break
            case 'divisao':
                this.addOperation('/')
                break
            case 'multiplicacao':
                this.addOperation('*')
                break
            case 'porcento':
                this.addOperation('%')
                break
            case 'igual':
                this.doCalc()
                this.setLastNumberToDisplay()
                break
            case 'ponto':
                this.addOperation('.')
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break
            default:
                this.setError()
                break

        }
    }

    addOperation(operation){
        let lastOperation = this.getLastOperation()
        if(isNaN(lastOperation)){
            if(this.isOperator(lastOperation) && this.isOperator(operation)){
                //Troca Operador
                this.pushOperation(operation)
            } else if (!isNaN(operation)) {
                // Novo número
                this.pushOperationFull(lastOperation,operation)
                this.setLastNumberToDisplay()
            } else {
                //TODO: Ponto
            }
        } else {
            if(lastOperation !== null){
                if(this.isOperator(operation)){
                    //Operador
                    this.pushOperationFull(lastOperation,operation)
                    this.setLastNumberToDisplay()
                } else {
                    //Número
                    let newOperation = lastOperation.toString() + operation.toString()
                    this.pushOperation(parseInt(newOperation))
                    this.setLastNumberToDisplay()
                }
                
            } else {
                //Primeiro número da operação
                this.pushOperation(parseInt(operation))
                this.setLastNumberToDisplay()
            }
            
        }

        
        console.log(this._operation)
    }

    doCalc(){
        if(this._operation.length < 3) {
            this.getLastOperation()
        } else {
            let result = eval(this._operation.join(''))
            this._operation = [result]    
        }
        
    }

    pushOperation(operation){
        if(this._operation.length >= 3){
            this.doCalc()
        }
        this._operation.push(operation)
    }

    pushOperationFull(lastOperation, operation){
        this._operation.push(lastOperation)
        if(this._operation.length >= 3){
            this.doCalc()
        }

        if(operation == '%'){
            this._operation.push('/')
            this._operation.push(100)
            this.doCalc()
        } else {
            this._operation.push(operation)
        }
        
    }

    getLastOperation(){
        if(this._operation.length < 1){
            return null
        } else {
            return this._operation.pop()
        }
        
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1)
    }

    clearAll(){
        this._operation = []
        this.setLastNumberToDisplay()
    }

    clearEntry(){
        this._operation.pop()
        this.setLastNumberToDisplay()
    }

    setError(){
        this.displayCalc = 'ERROR'
    }
    setLastNumberToDisplay(){
        let lastNumber = 0
        for(let i = this._operation.length-1;i >= 0;i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i]
                break
            }
        }
        this.displayCalc = lastNumber
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString()
        this.displayTime = this.currentDate.toLocaleTimeString()
    }

    //GETTERS AND SETTERS
    get displayDate(){
        return this._dateEl.innerHTML
    }
    
    set displayDate(value){
        this._dateEl.innerHTML = value
    }

    get displayTime(){
        return this._timeEl.innerHTML
    }
    
    set displayTime(value){
        this._timeEl.innerHTML = value 
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value 
    }

    get currentDate(){
        return new Date()
    }

    set currentDate(value){
        this._currentDate = value
    }
}