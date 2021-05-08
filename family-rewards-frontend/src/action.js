class Action {

    constructor(action){
      this.timestamp = action.timestamp
      this.id = action.id
      this.priceId = action.price_id
    }
  
    actionHTML() {
      return `<li id="${this.id}">${new Date(this.timestamp).toLocaleString()} (Delete)</li>`
    }
  
  
  }