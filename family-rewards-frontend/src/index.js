const form = document.getElementById('priceForm')

form.addEventListener('submit', Price.createPrice)

function createHeartsElement(amount) {
    let hearts = document.createElement("span")
    hearts.className = amount < 0 ? "pricePriceNegative" : "pricePricePositive"
    for (let i = 0; i < Math.abs(amount); i++) {
        hearts.innerHTML += "&#10084;"
    }
    return hearts
}

Price.fetchPrices()