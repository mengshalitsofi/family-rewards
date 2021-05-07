const header = document.getElementById("header")
const form = document.getElementById('priceForm')
const mainContainer = document.getElementById('container')

form.addEventListener('submit', Price.createPrice)
header.addEventListener('click', reset)

function reset(){
  mainContainer.innerHTML = ''
  mainContainer.innerHTML += `<form id="priceForm">
    <label for="">Name:</label>
    <input type="text" id="priceDescription">
    <input type="submit" >
  </form>`
  addListeners()
}

function addListeners() {
    const form = document.getElementById('priceForm')
    const div = document.createElement('div')
    div.id = "priceContainer"
    mainContainer.append(div)
    form.addEventListener('submit', Price.createPrice)
    Price.renderPrices()
}

Price.fetchPrices()