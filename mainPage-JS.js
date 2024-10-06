
        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");
        
        ctx.font = "50px Arial";
        ctx.fillText("Hello World",10,80);
     

let intervalId;
function increaseQuantity() {
var quantityInput = document.getElementById('Coins');
var currentValue = parseInt(quantityInput.value);
if (currentValue < quantityInput.max) {
  quantityInput.value = currentValue + 1;
}
}

function decreaseQuantity() {
var quantityInput = document.getElementById('Coins');
var currentValue = parseInt(quantityInput.value);
if (currentValue > quantityInput.min) {
  quantityInput.value = currentValue - 1;
}
}
function startIncreasing() {
increaseQuantity(); 
intervalId = setInterval(increaseQuantity, 100); 
}


function startDecreasing() {
decreaseQuantity(); 
intervalId = setInterval(decreaseQuantity, 100);
}


function stopChanging() {
clearInterval(intervalId);
}
