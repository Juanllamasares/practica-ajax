import STRIPE_KEYS from "/stripe_keys.js";

//console.log(STRIPE_KEYS);

const $pizzas = document.getElementById("pizzas"),
$template = document.getElementById("pizza-template").content,
$fragment = document.createDocumentFragment(),
fetchOptions = {
    headers:{
        Authorization: `Bearer ${STRIPE_KEYS.secret}`
    }
};

let prices,products;

const formatoDinero = num=>`$${num.slice(0,-2)}.${num.slice(-2)}`;

Promise.all([
    fetch("https://api.stripe.com/v1/products",fetchOptions),
    fetch("https://api.stripe.com/v1/prices",fetchOptions)
])
.then((responses)=>Promise.all(responses.map((res)=>res.json())))
.then(json=>{
    //console.log(json);
    products = json[0].data;
    prices = json[1].data;
    console.log(products,prices);

    prices.forEach(el => {
        let productData = products.filter((product)=>product.id===el.product);
        console.log(productData);

        $template.querySelector(".pizza").setAttribute("data-price",el.id);
        $template.querySelector("img").src = productData[0].images[0];
        $template.querySelector("img").alt = productData[0].name;
        $template.querySelector("figcaption").innerHTML = `${productData[0].name}
        <br>
        ${formatoDinero(el.unit_amount_decimal)} ${el.currency}
        `;

        let $clone = document.importNode($template,true);
        $fragment.appendChild($clone);
    });

    $pizzas.appendChild($fragment);
})
.catch(err=>{
    console.log(err);
    $pizzas.innerHTML = `<p>Error: ${err.status}</p>`;
});

document.addEventListener("click",e=>{
    if(e.target.matches(".pizza *")){
        let price = e.target.parentElement.getAttribute("data-price");

        Stripe(STRIPE_KEYS.public).redirectToCheckout({
            lineItems:[{price,quantity:1}],
            mode:"payment",
            successUrl:"http://127.0.0.1:5500/succes_stripe.html",
            cancelUrl:"http://127.0.0.1:5500/cancel_stripe.html"
        })
        .then((res)=>{
            if(res.error){
                $pizzas.insertAdjacentElement("afterend",res.error.message);
            }
        })
        
    }
});