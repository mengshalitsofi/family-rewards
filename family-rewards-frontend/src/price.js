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
        document.getElementById("balanceDiv").innerHTML = Price.balance;
    }

    renderPrice() {
      let table = document.getElementById('priceTable')
      let row = document.createElement("tr")
      row.id = "row_" + this.id
      let descriptionCell = document.createElement("td")
      descriptionCell.id = "desc_" + this.id
      descriptionCell.innerText = this.description
      row.appendChild(descriptionCell)
      let priceCell = document.createElement("td")
      priceCell.id = "price_" + this.id
      priceCell.innerText = this.price
      row.appendChild(priceCell)
      let deleteCell = document.createElement("td")
      deleteCell.id = "delete_" + this.id
      deleteCell.innerText = "Delete"
      deleteCell.addEventListener('click', this.deletePrice.bind(this))
      row.appendChild(deleteCell)
      let addActionCell = document.createElement("td")
      addActionCell.id = "addAction_" + this.id
      addActionCell.innerText = "+"
      addActionCell.addEventListener('click', this.submitAction.bind(this))
      row.appendChild(addActionCell)
      
      const ul = document.createElement("ul")
      ul.id = "ul_" + this.id;
      for (let action of this.actions) {
        ul.innerHTML += action.actionHTML()
      }      
      descriptionCell.appendChild(ul)

      table.appendChild(row)
    }
    
    showPrice() {
      let container = document.getElementById('container')
      let h3 = document.createElement('h3')
      let ul = document.createElement("ul")
      let form = document.createElement("form")
      let label = document.createElement("label")
      let input = document.createElement('input')
      let btn = document.createElement("input")
      btn.type = "submit"
      btn.innerText = "Submit"
      input.id = "timestamp"
      label.innerText = "Timestamp:"
      form.id = "actionForm"
      ul.id = "priceUl"
      form.append(label)
      form.append(input)
      form.append(btn)
      container.innerHTML = ""
      h3.innerText = this.name
      container.append(h3)
      container.append(ul)
      for (let action of this.actions) {
        ul.innerHTML += action.actionHTML()
      }
      container.append(form)
      form.addEventListener('submit', this.submitAction.bind(this))
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
          const rowToDelete = document.getElementById("row_" + this.id);
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
        ul.innerHTML += new Action(action.new_action).actionHTML()

        // Update balance
        Price.balance += this.price;
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