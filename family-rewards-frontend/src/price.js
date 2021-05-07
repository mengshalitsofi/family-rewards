class Price {

    static allPrices = []
  
    constructor(price) {
        this.description = price.description
        this.price = price.price
        this.id = price.id
        this.actions = price.actions.map(action => new Action(action))
        Price.allPrices.push(this)
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
      //innerText = this.description
      //pgh.addEventListener('click', this.showPrice.bind(this))
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
  
    async submitAction(){
      event.preventDefault()
      let timestamp = document.getElementById("timestamp").value
      let price_id = this.id
      let action = {action: {timestamp, price_id}}
      let options = {
        method: "POST",
        headers: {"Content-Type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(action)
      }
  
      document.getElementById("timestamp").value = ""
      try {
        let response = await fetch("http://localhost:3000/actions", options)
        let action = await response.json()
          if (action.data) {
            let newAction = new Action(action.data)
            let price = Price.allPrices.find(price => parseInt(price.id) === newAction.priceId)
            let ul = document.querySelector("ul")
            price.actions.push(newAction)
            ul.innerHTML += newAction.actionHTML()
          } else {
            throw new Error(action.message)
          }
      } catch(err) {
        alert(err)
      }
  
    }
  
    static renderPrices() {
      for (let price of this.allPrices) {
          price.renderPrice()
  
      }
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
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({price: {description}})
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