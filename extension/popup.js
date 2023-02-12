const selectUserTypeInput = document.getElementById("userType");
const customerView = document.getElementById("customer");
const businessView = document.getElementById("business");


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
})
