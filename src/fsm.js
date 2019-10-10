class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.state = config.initial;
        this.next = [];
        this.prev = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;                                                      //возвращаем нынешнее состояние
    }
    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state]) {                                        //если состояние существует и его можно заменить, то меняем
            this.prev.push(this.state);
            this.state = state;
            this.next = [];
        } else {
            throw new Error();                                                  //если не существует нужного состояния - ошибка
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (this.config.states[this.state].transitions[event]) {                //если существует в определённом состоянии нужный нам transitions, то меняем его
            this.prev.push(this.state);
            this.state = this.config.states[this.state].transitions[event];
            this.next = [];
        } else {
            throw new Error();                                                  //если не существует нужного состояния или transitions - ошибка
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;                                       //возвращаем стартовую конфогурацию
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const states = Object.keys(this.config.states);                         //получаем все названия в states (только их ключи, без значений)
        if (event) {                                                            //если есть event
            let eventContainer = [];
            for (let state of states) {                                         //цикл прохода всех состояний (states)
                if (this.config.states[state].transitions[event]) {             //если есть нужный event
                    eventContainer.push(state);                                 //помещаем в контейнер state с нужным event
                }
            }
            return eventContainer;                                              //вовращаем нужный state
        } else {
            return states;                                                      //если нет event, возвращаем все states
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this.prev.length) {                                                //если нет предыдущего значения возвращаем false
            return false;
        }
        this.next.push(this.state);                                             //если есть, кладём в след состояние нынешнее
        this.state = this.prev.pop();                                           //нынешнее состояние заменяем предыдущим
        return true;                                                            //возвращаем true
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.next.length) {                                                //если нет след значения возвращаем false
            return false;
        }
        this.prev.push(this.state);                                             //если есть, кладём в предыдущее состояние нынешнее
        this.state = this.next.pop();                                           //нынешнее состояние заменяем след
        return true;                                                            //возвращаем true
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.prev = [];                                                          //удаляем все предыдущие состояния
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
