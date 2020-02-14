class CalcController {
    constructor() {
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
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                console.log(btn.className.baseVal.replace('btn-',''))
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