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
