class Price {

    static allPrices = []
    static balance = 0

    constructor(price) {
        this.description = price.description
        this.price = parseInt(price.price, 10)
        this.id = price.id
        this.actions = price.actions.map(action => new Action(action))
        Price.allPrices.push(this)
        Price.balance += this.price * this.actions.length
    }
  
    static displayBalance() {
      const balanceDiv = document.getElementById("balanceDiv")
      balanceDiv.innerHTML = "" // delete all child element
      balanceDiv.appendChild(createHeartsElement(Price.balance))
    }

    renderPrice() {
      let container = document.getElementById('priceContainer')

      let div = document.createElement("div")
      div.id = "div_" + this.id;
      container.appendChild(div);

      let row = document.createElement("span")
      row.className = "priceRow"
      row.id = "row_" + this.id
      row.innerHTML = this.description + "  ";
      div.appendChild(row);

      div.appendChild(createHeartsElement(this.price))
      
      let deleteCell = document.createElement("span")
      deleteCell.id = "delete_" + this.id
      deleteCell.className = "delete"
      deleteCell.innerText = "  (Delete)"
      deleteCell.addEventListener('click', this.deletePrice.bind(this))
      div.appendChild(deleteCell)

      let addActionCell = document.createElement("span")
      addActionCell.id = "addAction_" + this.id      
      addActionCell.innerText = "  (+)"
      addActionCell.addEventListener('click', this.submitAction.bind(this))
      div.appendChild(addActionCell)
      
      const ul = document.createElement("ul")
      ul.id = "ul_" + this.id
      div.appendChild(ul)

      for (let action of this.actions) {
        ul.appendChild(action.createElement())
      }      
    }
  
    async deletePrice(event) {
        // Delete from the backend
        event.preventDefault()
        let options = {
          method: "DELETE",
          headers: {"Content-Type": "application/json", "Accept": "application/json"},
        }

        try {
          await fetch("http://localhost:3000/prices/" + this.id, options)
          
          // Remove from the DOM
          const rowToDelete = document.getElementById("div_" + this.id);
          rowToDelete.remove();

          // Update the balance
          Price.balance -= this.price * this.actions.length
          Price.displayBalance();

        } catch(err) {
          alert(err)
        }        
    }

    async submitAction(){
      event.preventDefault()
      let timestamp = new Date().toISOString()
      let price_id = this.id
      let action = {new_action: {timestamp, price_id}}
      let options = {
        method: "POST",
        headers: {"Content-Type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(action)
      }

      try {
        let response = await fetch("http://localhost:3000/actions", options)
        await response.json()

        const ul = document.getElementById("ul_" + this.id);
        ul.appendChild(new Action(action.new_action).createElement())

        // Update balance
        Price.balance += this.price;
        Price.displayBalance();
      } catch(err) {
        alert(err)
      }
  
    }
  
    static async removeAction(priceId, actionId) {
      // Remove from the backend
      event.preventDefault()
      let options = {
        method: "DELETE",
        headers: {"Content-Type": "application/json", "Accept": "application/json"},
      }

      try {
        await fetch("http://localhost:3000/actions/" + actionId, options)
        
        // Remove the item from allPrices
        const price = Price.allPrices.find(p => p.id === priceId);
        price.actions = price.actions.filter(a => a.id !== actionId);

        // Remove the item from the DOM
        document.getElementById("li_" + actionId).remove();
        
        // Update the balance
        Price.balance -= price.price;
        Price.displayBalance();
      } catch(err) {
        alert(err)
      }        
    }

    static renderPrices() {
      for (let price of this.allPrices) {
          price.renderPrice()
      }
      Price.displayBalance();
    }
  
    static fetchPrices() {
      fetch("http://localhost:3000/prices")
      .then(r => r.json())
      .then(prices => {
        if (!!prices) {
          for (let price of prices) {
            let newPrice = new Price(price)
          }
          this.renderPrices()
        } else {
          throw new Error(prices)
        }
  
      }).catch(err => alert(err))
    }
  
    static createPrice() {
      event.preventDefault()
      const description = document.getElementById('priceDescription').value
      const price = document.getElementById('pricePrice').value
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({price: {description, price}})
      }
  
      document.getElementById('priceDescription').value = ""
  
      fetch("http://localhost:3000/prices", options)
      .then(r => r.json())
      .then(priceObj => {
        if (!!priceObj) {
          let newPrice = new Price(priceObj)
          newPrice.renderPrice()
        } else {
          throw new Error(priceObj.message)
        }
  
      }).catch((err) => alert(err))
    }
  }