class Price {

    static allPrices = []
  
    constructor(price) {
        this.description = price.attributes.description
        this.id = price.id
        this.actions = price.attributes.actions.map(action => new Action(action))
        Price.allPrices.push(this)
    }
  
    renderPrice() {
      let div = document.getElementById('priceContainer')
      let pgh = document.createElement("p")
      pgh.id = this.id
      pgh.innerText = this.name
      pgh.addEventListener('click', this.showPrice.bind(this))
      div.append(pgh)
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
      input.id = "content"
      label.innerText = "Content:"
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
        if (prices.data) {
          for (let price of prices.data) {
            let newPrice = new Price(price)
          }
          this.renderPrices()
        } else {
          throw new Error(prices.data)
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
        if (priceObj.data) {
          let newPrice = new Price(priceObj.data)
          newPrice.renderPrice()
        } else {
          throw new Error(priceObj.message)
        }
  
      }).catch((err) => alert(err))
    }
  
  
  }