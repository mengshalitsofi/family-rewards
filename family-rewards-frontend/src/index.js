const form = document.getElementById('priceForm')
form.addEventListener('submit', Price.createPrice)

const sort = document.getElementById("sortbutton")
sort.addEventListener('click', sortPrice)

function createHeartsElement(amount) {
    let hearts = document.createElement("span")
    hearts.className = amount < 0 ? "pricePriceNegative" : "pricePricePositive"
    for (let i = 0; i < Math.abs(amount); i++) {
        hearts.innerHTML += "&#10084;"
    }
    return hearts
}

function sortPrice(){
   const c = document.getElementById("priceContainer")
   c.innerHTML = ""
   Price.allPrices.sort(function(a, b) {
    var nameA = a.description.toUpperCase(); // ignore upper and lowercase
    var nameB = b.description.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  
    // names must be equal
    return 0;
  })
   Price.renderPrices() 
}
// Get all the prices and actions and add to the DOM
Price.fetchPrices()