class CalcController {
    constructor() {
        this._lastOperator = ''
        this._lastNumber = ''
        this._isAudioOn = false
        this._audio = new Audio('click.mp3')

        this._operation = []
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate
        this.initialize()
        this.initButtonsEvents()
        this.initKeyBoard()
    }

    copyToClipboard(){
        let input = document.createElement('input')
        input.value = this.displayCalc
        document.body.appendChild(input)
        input.select()
        document.execCommand('Copy')
        input.remove()
    }

    pasteFromClipboard(){
        document.addEventListener("paste", e=>{
            let text = e.clipboardData.getData('Text')
            this.pushOperation(parseFloat(text))
            this.setLastNumberToDisplay()
        })
    }

    initialize(){
        this.setDisplayDateTime()
        setInterval(()=>{
            this.setDisplayDateTime()
        }, 1000)
        this.setLastNumberToDisplay()
        this.pasteFromClipboard()

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio()
            })
        })
    }

    initKeyBoard(){
        document.addEventListener('keyup', e=>{
            this.playAudio()
            switch(e.key){
                case 'Escape':
                    this.clearAll()
                    break
                case 'Backspace':
                    this.clearEntry()
                    break
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key)
                    break
                case 'Enter':
                case '=':
                    this.doCalc(true)
                    this.setLastNumberToDisplay()
                    break
                case '.':
                case ',':
                    this.addDot()
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
                    this.addOperation(parseInt(e.key))
                    break
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard()
                    break
    
            }
        })
    }

    toggleAudio(){
        this._isAudioOn = !this._isAudioOn
    }

    playAudio(){
        if(this._isAudioOn){
            this._audio.currentTime = 0
            this._audio.play()
        }
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
        this.playAudio()
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
                this.doCalc(true)
                this.setLastNumberToDisplay()
                break
            case 'ponto':
                this.addDot()
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
                    this.pushOperation((newOperation))
                    this.setLastNumberToDisplay()
                }
                
            } else {
                //Primeiro número da operação
                if(!isNaN(operation)){
                    this.pushOperation(parseInt(operation))
                    this.setLastNumberToDisplay()
                }
            }
            
        }
        console.log(this._operation)
    }

    addDot(){
        let lastOperation = this.getLastOperation()

        // Evita a inserção de mais de um ponto.
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) {
            return this.pushOperation(lastOperation)
        }

        if(this.isOperator(lastOperation) || !lastOperation){
            //É indefinido ou uma operação
            if(lastOperation){
                this.pushOperationFull(lastOperation, '0.')
            } else {
                this.pushOperation('0.')
            }
        } else {
            //É um número
            this.pushOperation(lastOperation.toString() + '.')
        }
        this.setLastNumberToDisplay()
    }

    doCalc(isEqual = false){
        if(this._operation.length < 3) {
            if(isEqual){
                let firstItem
                if(this._operation[0]){
                    firstItem = this._operation[0]
                } else {
                    firstItem = 0
                }
                this._operation = [firstItem,this._lastOperator,this._lastNumber]
                let result = eval(this._operation.join(''))
                this._operation = [result]    
            } else {
                this.getLastOperation()
            }
        } else {
            this._lastOperator = this.getLastItem(true)
            this._lastNumber = this.getLastItem(false)
            let result = eval(this._operation.join(''))
            this._operation = [result]    
            if(!isEqual) this._lastNumber = this.getLastItem(false)
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
        this._lastNumber = ''
        this._lastOperator = ''
        this.setLastNumberToDisplay()
    }

    clearEntry(){
        this._operation.pop()
        this.setLastNumberToDisplay()
    }

    setError(){
        this.displayCalc = 'ERROR'
    }

    getLastItem(isOperator = true){
        let lastItem = 0
        for(let i = this._operation.length-1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i]
                break
            }
        }

        return lastItem
    }

    setLastNumberToDisplay(){

        this.displayCalc = this.getLastItem(false)
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