let pformat = new Intl.NumberFormat('de-DE', { minimumSignificantDigits : 2 }); //để format tiền tệ, vd: pformat.format(2500) sẽ output ra 2.500,00 (I think so?)

function capitalization(string) { //viết hoa chữ cái đầu tiên của string
    return string.charAt(0).toUpperCase() + string.slice(1); //trả về string đó nhưng viết hoa chữ cái đầu tiên. ví dụ: capitalization(zxlckvn) thì sẽ trả về: kí tự đầu tiên của string(kí tự số 0 là z).toUpperCase sẽ biến nó thành Z, khi này string.slice(1) sẽ trả lại string ban đầu nhưng từ kí tự 1 trở đi, tức là trả xlckvn rồi cộng 2 cái lại sẽ ra Zxlckvn.
}

const truncatePrice = (price, k) => { //biến số có dạng abcd -> ab00 (với k=2); hay với k=3 thì abcd -> a000
    const factor = Math.pow(10, Math.abs(price).toString().length - k); 
    return Math.floor(price / factor) * factor; 
}

function genprod(product) {
    if(product.image){
        product.image = "data:image/png;base64," + product.image; //đổi sang format đúng để display ảnh sử dụng base 64, lưu ý là product.image kiểu dữ liệu ban đầu là base 64, dòng code này chỉ khiến cho nó trở thành đúng định dạng hiển thị trong js
    }
    if(product.old_price){
        product.old_price = pformat.format(product.old_price); //same as below (line 17)
    }
    if((!('old_price' in product)) && (product.discount !== 0)){
        product.old_price = pformat.format(truncatePrice(Math.floor((product.price)/(1-(product.discount)/(100))),2));
    }
    if(product.tag){
        product.tag = capitalization(product.tag); //capitalize cái tag cho đẹp
    }
    product.short_desc = capitalization(product.short_desc); //capitalize chữ cái đầu tiên trong phần giới thiệu sơ về product
    product.name = capitalization(product.name); //capitalize chữ cái đầu của tên product
    product.unit_price = capitalization(product.unit_price); //capitalize chữ cái đầu của unit of currency (Usd, Vnd,...); theo design trên web Furniro thì nó sẽ là Rp
    product.price = pformat.format(product.price); //đổi cho đúng format display tiền tệ trên Furniro

    const markup = `
    <div class="product-container" id="${product.name}"> 
        <img class="product-image" src="${product.image}" alt="${product.name}">
        <p class="product-discount">${product.discount ? `-${product.discount}%` : ""}</p>
        <p class="product-tag">${product.tag ? `${product.tag}` : ""}</p>

        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.short_desc}</p>
        <h4 class="product-price">${product.unit_price} ${product.price}</h4>
        <p class="product-old_price"><del>${product.old_price ? `${product.unit_price} ${product.old_price}` : ""}</del></p>
        <div class="product-utility">
            <button class="product-cart">Add to Cart</button>
            <a href=""><span class="material-symbols-outlined">share</span>Share</a>
            <a href=""><span class="material-symbols-outlined">sync_alt</span>Compare</a>
            <a href=""><span class="material-symbols-outlined">favorite</span>Like</a>
        </div>
        <br></br>
    </div>
`;
    return markup;
}

async function loadprod() {
    const resp = await fetch("https://dummyapi-0uzr.onrender.com/products"); //fetch trả về cái promise mà sẽ resolve với object resp
    const prod = await resp.json(); //lấy dữ liệu từ resp (đang là object) theo định dạng JavaScript Object Notation  

    const container = document.getElementById("section-02"); 

    prod.forEach((product) => { //loop forEach = cho mỗi product trong prod
        const disprodhtml = genprod(product); //đặt biến disprodhtml (display-product-html) 
        container.insertAdjacentHTML("beforeend",disprodhtml);
    });
}

loadprod();
