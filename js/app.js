const btn = document.getElementById("menu-btn");
const menu = document.getElementById("mobile-menu");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});
const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".menu-section");

menuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("data-target");

    sections.forEach((section) => {
      section.classList.add("hidden");
    });

    document.getElementById(targetId).classList.remove("hidden");

    menuLinks.forEach((l) => {
      l.classList.remove("bg-red-500", "text-white", "shadow-md");
      l.classList.add("bg-gray-200");
    });
    link.classList.add("bg-red-500", "text-white", "shadow-md");
    link.classList.remove("bg-gray-200");
  });
});

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("Full Name");

  alert(`Thank you, ${name}! Your message has been sent.`);
  contactForm.reset();
});
const modal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");
const orderButtons = document.querySelectorAll(".order-btn");
const itemInput = document.getElementById("selectedItem");
const orderForm = modal.querySelector("form");

let currentPrice = "0.00";

orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card =
      button.closest(".bg-white") ||
      button.closest(".rounded-2xl") ||
      button.closest("div");

    const foodName = card.querySelector("h3")
      ? card.querySelector("h3").innerText
      : "Delicious Food";

    const priceElement = card.querySelector(".text-orange-500");

    if (priceElement) {
      currentPrice = priceElement.innerText.trim();
    } else {
      currentPrice = card.innerText.match(/\$\d+(\.\d{2})?/)
        ? card.innerText.match(/\$\d+(\.\d{2})?/)[0]
        : "$25.00";
    }

    console.log("Found Food:", foodName, "Found Price:", currentPrice);

    itemInput.value = foodName;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
});

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;
  const foodItem = itemInput.value;

  const newOrder = {
    orderId: "#ORD-" + Math.floor(Math.random() * 9000 + 1000),
    food: foodItem,
    name: fullName,
    phone: phone,
    address: address,
    price: currentPrice,
    status: "Pending",
    time: new Date().toLocaleTimeString(),
  };

  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  existingOrders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(existingOrders));

  hideModal();

  Swal.fire({
    title: "Order Placed!",
    text: `Thanks ${fullName}! Your ${foodItem} is on its way to ${address}.`,
    icon: "success",
    confirmButtonColor: "#f97316",
  });

  orderForm.reset();
});

const hideModal = () => {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
};

closeModal.addEventListener("click", hideModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) hideModal();
});
