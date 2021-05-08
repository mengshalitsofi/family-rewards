class Action {

    constructor(action){
      this.timestamp = action.timestamp
      this.id = action.id
      this.priceId = action.price_id
    }

    createElement() {      
      const li = document.createElement("li")
      li.id = "li_" + this.id;
      
      const ts = document.createElement("span")
      ts.innerText = new Date(this.timestamp).toLocaleString();
      li.appendChild(ts); 

      const del = document.createElement("span")
      del.innerText = "  (Delete)";
      del.className = "delete";
      del.addEventListener("click", this.deleteAction.bind(this));
      li.appendChild(del);

      return li;
    }

    deleteAction() {
      Price.removeAction(this.priceId, this.id)
    }
  
  }