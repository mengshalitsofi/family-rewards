class Action {

    constructor(action){
      this.timestamp = action.attributes.timestamp
      this.id = action.id
      this.priceId = action.attributes.price_id
    }
  
    actionHTML() {
      return `<li id="${this.id}">${this.timestamp}</li>`
    }
  
  
  }