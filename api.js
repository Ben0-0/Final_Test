let pformat = new Intl.NumberFormat('de-DE', { minimumSignificantDigits : 2 });

function capitalization(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const truncatePrice = (price, k) => { 
    const factor = Math.pow(10, Math.abs(price).toString().length - k); 
    return Math.floor(price / factor) * factor; 
}

function genprod(product) {
    if(product.image){
        product.image = "data:image/png;base64," + product.image; 
    }
    if(product.old_price){
        product.old_price = pformat.format(product.old_price); 
    }
    if((!('old_price' in product)) && (product.discount !== 0)){
        product.old_price = pformat.format(truncatePrice(Math.floor((product.price)/(1-(product.discount)/(100))),2));
    }
    if(product.tag){
        product.tag = capitalization(product.tag); 
    }
    product.short_desc = capitalization(product.short_desc); 
    product.name = capitalization(product.name); 
    product.unit_price = capitalization(product.unit_price); 
    product.price = pformat.format(product.price); 

    const markup = `
    <div class="product-container" id="${product.name}"> 
        <img class="product-image" src="${product.image}" alt="${product.name}">
        <p class="product-discount">${product.discount ? `-${product.discount}%` : ""}</p>
        <p class="product-tag">${product.tag ? `${product.tag}` : ""}</p>

        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.short_desc}</p>
        <h4 class="product-price">${product.unit_price} ${product.price}</h4>
        <p class="product-old_price"><del>${product.old_price ? `${product.unit_price} ${product.old_price}` : ""}</del></p>
        <div class="middle">
        <button class="add_to_cart">Add to cart</button>
          <div class="hove">
            <span class="material-symbols-outlined">share</span>
            <p>Share</p>
            <span class="material-symbols-outlined">compare_arrows</span>
            <p>Compare</p>
            <span id="heart" class="material-symbols-outlined">favorite</span>
            <p>Like</p>
          </div>
        </div>
        <br></br>
    </div>
`;
    return markup;
}
  
var start =0;
var limit1 =-1;
var count=0;
async function loadProducts(limit) {
    if (limit1 > 8) {
        start = 0;
        limit1 = limit;
    }
    if (limit1==-1){  
        limit1 = limit;
    }
    const res = await fetch("data.json");
    const data = await res.json();
    const products = data.product_list.slice(start, limit1);
    start =limit1;
    limit1 += limit;
    const productContainer = document.getElementById("products");
  
    products.forEach(function (product) {
      const markup = genprod(product);
      productContainer.insertAdjacentHTML("beforeend", markup);
    });
    if (count === 40) {
      document.getElementById("showmorebutton").style.display = "none";
      return; 
    }
    localStorage.setItem("products", JSON.stringify(products));
}
loadProducts(8);
count+=8;
document.getElementById("countprod").innerHTML = count;
document.getElementById("showmorebutton").addEventListener("click",function() {
    if (count < 32) {
        count+=4;
        document.getElementById("countprod").innerHTML = count;
        loadProducts(4);
    }
    else{

    }
})
  ///////////
document.getElementById("smitbutton").addEventListener("click",function() {
    a="Submitted"
    setTimeout(document.getElementById("smit").innerHTML = a,1000)
})

document.addEventListener("click", function(event) {
    if (event.target.id === "heart") {
        const heartElement = event.target;
        const heartId = heartElement.id;
        const isLiked = heartElement.classList.contains("liked");
  
        if (isLiked) {
            heartElement.classList.remove("liked");
            heartElement.classList.add("disliked");
            localStorage.removeItem(heartId);
        } 
        else{
        heartElement.classList.remove("disliked");
        heartElement.classList.add("liked");
        localStorage.setItem(heartId, "id");
        }
    }
});
countprod = document.getElementById("countprod").innerHTML = count;
  
document.getElementById("Shopinput").addEventListener("input", function(event) {
    let Shopinput = event.target.value;
    loadProducts(parseInt(Shopinput));
});