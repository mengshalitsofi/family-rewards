class Price {

    static allPrices = []
    static balance = 0
    
  
    // creates a new price object, adds it to the list of allPrices, and updates the balance
    constructor(price) {
        this.description = price.description
        this.price = parseInt(price.price, 10)
        this.id = price.id
        this.actions = price.actions.map(action => new Action(action)) // deserialize Action, add to list
        Price.allPrices.push(this) // add to the static list of all prices
        if (!isNaN(this.price) && !isNaN(this.actions.length)) { // update the balance only if we have a price and actions
          Price.balance += this.price * this.actions.length
        }        
    }
  
    static renderBalance() {
      const balanceDiv = document.getElementById("balanceDiv")
      balanceDiv.innerHTML = "" // delete all child element
      balanceDiv.appendChild(createHeartsElement(Price.balance))
    }

    renderPrice() {
      let container = document.getElementById('priceContainer') // get reference to the existing container

      // create a div to hold all the price information and add it to the container
      let div = document.createElement("div")
      div.id = "div_" + this.id;
      container.appendChild(div);

      // create the description piece and add it to the div
      let row = document.createElement("span")
      row.className = "priceRow"
      row.id = "row_" + this.id
      row.innerHTML = this.description + "  "
      div.appendChild(row);

      // create the hearts piece and add it to the div
      div.appendChild(createHeartsElement(this.price))
      
      // create the Edit button and add it to the div
      let editCell = document.createElement("span")
      editCell.id = "edit_" + this.id
      editCell.className = "delete"
      editCell.innerText = "  (Edit)"
      editCell.addEventListener('click', this.showPrice.bind(this))
      div.appendChild(editCell)

      
      // create the Delete button and add it to the div
      let deleteCell = document.createElement("span")
      deleteCell.id = "delete_" + this.id
      deleteCell.className = "delete"
      deleteCell.innerText = "  (Delete)"
      deleteCell.addEventListener('click', this.deletePrice.bind(this))
      div.appendChild(deleteCell)

      // create the + button and add it to the div
      let addActionCell = document.createElement("span")
      addActionCell.id = "addAction_" + this.id      
      addActionCell.innerText = "  (+)"
      addActionCell.addEventListener('click', this.submitAction.bind(this))
      div.appendChild(addActionCell)
      
      // create the list for all the actions
      const ul = document.createElement("ul")
      ul.id = "ul_" + this.id
      div.appendChild(ul)

      // add every action to the list
      for (let action of this.actions) {
        ul.appendChild(action.createElement()) //action.js
      }      
    }
  
    showPrice() {
      const span = document.getElementById("row_" + this.id)      
      span.innerHTML = ""; 

      let form = document.createElement("form")
      let input = document.createElement('input')      
      let btn = document.createElement("input")
      btn.type = "submit"
      btn.innerText = "Submit"
      input.id = "content"
      input.value = this.description
      form.id = "priceForm"
      form.append(input)
      form.append(btn)
      span.append(form)
      form.addEventListener('submit', this.submitPrice.bind(this))      
    }

    async submitPrice() {
      event.preventDefault()
      let description = document.getElementById("content").value
      let price_id = this.id
      let priceObj = {price: {description}}
      let options = {
        method: "PATCH",
        headers: {"Content-Type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(priceObj)
      }
  
      document.getElementById("content").value = ""
      try {
        let response = await fetch("http://localhost:3000/prices/" + price_id, options)
        let priceJson = await response.json()
          if (priceJson) {
            document.getElementById("priceContainer").innerHTML = ""
            let price = Price.allPrices.find(p => parseInt(p.id) === priceJson.id)
            price.description = priceJson.description
            Price.renderPrices();
            Price.renderBalance();
          } else {
            throw new Error(priceJson.message)
          }
      } catch(err) {
        alert(err)
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
          Price.renderBalance();

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
        const actionObj = new Action(action.new_action);
        ul.appendChild(actionObj.createElement())

        // Update balance
        Price.balance += this.price;
        this.actions.push(actionObj);
        Price.renderBalance();
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
        Price.renderBalance();
      } catch(err) {
        alert(err)
      }        
    }

    // render all prices one by one, and then render the balance
    static renderPrices() {
      for (let price of this.allPrices) {
          price.renderPrice()
      }
      Price.renderBalance();
    }
  
    // Get all the prices and actions and add to the DOM
    static fetchPrices() {
      fetch("http://localhost:3000/prices") // GET method to the backend to get all prices and actions
      .then(r => r.json()) // Convert to a JSON object
      .then(prices => {
       
        if (!!prices) { // Check that it exists
          for (let price of prices) { // Go over the prices array one by one
            let newPrice = new Price(price) // Create a new price (which will add it to the AllPrices array)
          }
          this.renderPrices() // Render all prices in the DOM
        } else {
          throw new Error("error getting prices") // error handling, couldn't get an object
        }
  
      }).catch(err => alert(err)) // error handling
     
    }
  
    // submit button for the "Add New Behavior" form
    static createPrice(event) {
      event.preventDefault()
      const description = document.getElementById('priceDescription').value
      const price = document.getElementById('pricePrice').value
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({price: {description, price}}) // serialize the price object to a string
      }
  
      document.getElementById('priceDescription').value = ""
  
      fetch("http://localhost:3000/prices", options) // POST the new behavior (price) to the backend
      .then(r => r.json())
      .then(priceObj => {
        if (priceObj.id) { // check if the item was created
          let newPrice = new Price(priceObj) // create a new price object
          newPrice.renderPrice() // render the new price
        } else {
          throw new Error(priceObj.message)
        }
  
      }).catch((err) => alert(err))
    }
  }