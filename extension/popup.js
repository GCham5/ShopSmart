const selectUserTypeInput = document.getElementById("userType");
const customerView = document.getElementById("customer");
const businessView = document.getElementById("business");


// script.js
fetch('testData.json')
  .then(response => response.json())
  .then(data => {
    console.log(data.dataArray);
  });

selectUserTypeInput.addEventListener("change", function() {
    customerView.style.display = "none";
    businessView.style.display = "none";

  switch (selectUserTypeInput.value) {
    case "customer":
        customerView.style.display = "block";
      break;
    case "business":
        businessView.style.display = "block";
      break;
  }
});

document.getElementById("btn").addEventListener('click', ()=>{
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        if (/^http/.test(tabs[0].url)) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "tofg_generateheatmap"})
        }
   })
});

function generateCards(data) {
  let cardContainer = document.querySelector("#card-container");
  for (let i = 0; i < data.length; i++) {
    const button = document.createElement('button');
    button.innerHTML = data[i].title;
    button.setAttribute('data-value', data[i].value);
    button.classList.add('data-button');
    cardContainer.appendChild(button);
  }
}
