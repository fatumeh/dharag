document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("navToggle");
    const closeSidebar = document.getElementById("closeSidebar");
    const sidebarMenu = document.getElementById("sidebarMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const navLinks = document.querySelectorAll(".nav-link");

    function openMenu() {
        sidebarMenu.classList.remove("-translate-x-full");
        sidebarOverlay.classList.remove("hidden");
    }

    function closeMenu() {
        sidebarMenu.classList.add("-translate-x-full");
        sidebarOverlay.classList.add("hidden");
    }

    if (navToggle) navToggle.addEventListener("click", openMenu);
    if (closeSidebar) closeSidebar.addEventListener("click", closeMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeMenu);

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth < 640) {
                closeMenu();
            }
        });
    });
});
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".content-section");

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const targetId = link.getAttribute("data-target");

        sections.forEach((section) => section.classList.add("hidden"));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove("hidden");
        }

        navLinks.forEach((l) =>
            l.classList.remove("bg-red-100", "text-red-500", "border-red-300"),
        );
        link.classList.add("bg-red-100", "text-red-500", "border-red-300");
    });
});

const modal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");
const orderForm = document.getElementById("confirmOrderForm");
const historyBody = document.getElementById("orderHistoryBody");
const emptyRow = document.getElementById("emptyRow");

document.addEventListener("click", (e) => {
    if (e.target.innerText.toLowerCase() === "order now") {
        const card = e.target.closest(".rounded");
        const foodName = card.querySelector("h1").innerText;
        const foodPrice = card
            .querySelector(".text-orange-500")
            .innerText.split("$")[1]
            .trim();

        document.getElementById("modalFoodName").value = foodName;
        document.getElementById("modalFoodPrice").value = "$" + foodPrice;
        modal.classList.remove("hidden");
    }
});

closeModal.onclick = () => modal.classList.add("hidden");

orderForm.onsubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    const address = document.getElementById("custAddress").value;
    const food = document.getElementById("modalFoodName").value;
    const price = document.getElementById("modalFoodPrice").value;
    const orderId = "#ORD-" + Math.floor(Math.random() * 9000 + 1000);

    const newRow = document.createElement("tr");
    newRow.className = "border-b hover:bg-gray-50 transition";

    newRow.innerHTML = `
        <td class="p-4 font-medium text-blue-600">${orderId}</td>
        <td class="p-4">${food}</td>
        <td class="p-4">${name}</td>
        <td class="p-4">${phone}</td>
        <td class="p-4 text-sm text-gray-500">${address}</td>
        <td class="p-4 font-bold text-gray-800">${price}</td>
        <td class="p-4">
            <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                Pending
            </span>
        </td>
        <td class="p-4">
            <button class="text-red-500 hover:text-red-700" onclick="this.closest('tr').remove()">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    const emptyRow = document.getElementById("emptyRow");
    if (emptyRow) {
        emptyRow.classList.add("hidden");
    }

    const historyBody = document.getElementById("orderHistoryBody");
    historyBody.prepend(newRow);

    modal.classList.add("hidden");
    document.body.style.overflow = "auto";

    Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: `Order ${orderId} for ${food} has been added.`,
        confirmButtonColor: "#f97316",
    });

    const newOrderData = {
        orderId: orderId,
        food: food,
        name: name,
        phone: phone,
        address: address,
        price: price,
        status: "Pending",
        time: new Date().toLocaleTimeString(),
    };

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    allOrders.push(newOrderData);
    localStorage.setItem("orders", JSON.stringify(allOrders));
    orderForm.reset();
};

function loadOrders() {
    const historyBody = document.getElementById("orderHistoryBody");
    const emptyRow = document.getElementById("emptyRow");
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    historyBody.innerHTML = "";

    const pendingOrders = savedOrders.filter(
        (order) => !order.status || order.status.toUpperCase() !== "DELIVERED",
    );

    if (pendingOrders.length > 0) {
        if (emptyRow) emptyRow.classList.add("hidden");

        pendingOrders.forEach((order) => {
            const row = document.createElement("tr");
            row.className = "border-b hover:bg-gray-50 transition";

            const statusClass = "bg-yellow-100 text-yellow-700";

            row.innerHTML = `
                <td class="p-4 font-medium text-blue-600">${order.orderId}</td>
                <td class="p-4">${order.food}</td>
                <td class="p-4">${order.name}</td>
                <td class="p-4">${order.phone}</td>
                <td class="p-4 text-sm text-gray-500">${order.address}</td>
                <td class="p-4 font-bold text-gray-800">${order.price}</td>
                <td class="p-4">
                    <span class="status-pill ${statusClass} px-3 py-1 rounded-full text-xs font-bold uppercase cursor-pointer" 
                          onclick="toggleStatus('${order.orderId}')">
                        ${order.status || "PENDING"}
                    </span>
                </td>
                <td class="p-4 flex gap-2">
                    <button class="text-blue-500 hover:text-blue-700" onclick="editOrder('${order.orderId}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-700" onclick="deleteOrder('${order.orderId}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            historyBody.prepend(row);
        });
    } else {
        if (emptyRow) emptyRow.classList.remove("hidden");
    }
}

function deleteOrder(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "This order will be permanently removed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            let orders = JSON.parse(localStorage.getItem("orders")) || [];
            orders.splice(index, 1);
            localStorage.setItem("orders", JSON.stringify(orders));
            loadOrders();
        }
    });
}

function toggleStatus(id) {
    let savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const actualIndex = savedOrders.findIndex(
        (order) => order.orderId.toString() === id.toString(),
    );

    if (actualIndex !== -1) {
        savedOrders[actualIndex].status = "DELIVERED";

        localStorage.setItem("orders", JSON.stringify(savedOrders));

        loadOrders();

        if (typeof updateDeliveredHistory === "function") {
            updateDeliveredHistory();
        }
    } else {
        console.error("Dalabkaas laguma helin kaydka dhabta ah!");
    }
}

function updateDeliveredHistory() {
    const historyBody = document.getElementById("deliveredHistoryBody");

    const allOrders = JSON.parse(localStorage.getItem("foodOrders")) || [];

    const deliveredOnly = allOrders.filter(
        (order) => order.status && order.status.toUpperCase() === "DELIVERED",
    );

    if (deliveredOnly.length === 0) {
        historyBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-gray-400">No DELIVERED orders found.</td></tr>`;
        return;
    }

    historyBody.innerHTML = deliveredOnly
        .map(
            (order) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4 text-sm text-gray-500">#${order.id.toString().slice(-5)}</td>
            <td class="p-4 font-bold text-gray-800">${order.foodName}</td>
            <td class="p-4 text-orange-600 font-bold">$${order.price}</td>
            <td class="p-4">
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">
                    ${order.status}
                </span>
            </td>
        </tr>
    `,
        )
        .join("");
}

function updateDeliveredHistory() {
    const historyBody = document.getElementById("deliveredHistoryBody");

    if (!historyBody) {
        console.error(
            "Cilad: Laguma guulaysan in la helo 'deliveredHistoryBody' ee HTML-ka!",
        );
        return;
    }

    const allOrders =
        JSON.parse(localStorage.getItem("foodOrders")) ||
        JSON.parse(localStorage.getItem("orders")) || [];

    console.log("Xogta ku jirta kaydkaaga:", allOrders);

    const deliveredOnly = allOrders.filter((order) => {
        return (
            order.status && order.status.toString().toUpperCase() === "DELIVERED"
        );
    });

    if (deliveredOnly.length === 0) {
        historyBody.innerHTML = `
            <tr>
                <td colspan="4" class="p-8 text-center text-gray-400">
                    <i class="bi bi-exclamation-circle block text-2xl text-orange-500 mb-2"></i>
                    Wax xog ah oo DELIVERED ah laguma helin kaydka
                </td>
            </tr>`;
        return;
    }

    historyBody.innerHTML = deliveredOnly
        .map((order) => {
            const orderId =
                order.orderId || order.id || Math.floor(Math.random() * 10000);
            const foodItem = order.food || order.foodName || "Cunto aan la aqoon";
            const itemPrice = order.price || order.total || "0.00";

            return `
            <tr class="border-b hover:bg-gray-50 transition">
                <td class="p-4 text-sm font-medium text-blue-600">#${orderId.toString().slice(-5)}</td>
                <td class="p-4 font-bold text-gray-800">${foodItem}</td>
                <td class="p-4 text-gray-700">${order.name || "N/A"}</td>
                <td class="p-4 text-gray-700">${order.phone || "N/A"}</td>
                <td class="p-4 text-sm text-gray-500">${order.address || "N/A"}</td>
                <td class="p-4 font-bold text-orange-600">${itemPrice.includes("$") ? itemPrice : "$" + itemPrice}</td>
                <td class="p-4">
                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                        ${order.status || "DELIVERED"}
                    </span>
                </td>
                <td class="p-4 flex gap-3">
                    <button class="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1" 
                            onclick="printReceipt('${orderId}')">
                        <i class="bi bi-printer"></i> Receipt
                    </button>
                    
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1" 
                            onclick="deleteHistoryOrder('${orderId}')">
                        <i class="bi bi-trash"></i> 
                    </button>
                </td>
            </tr>
        `;
        })
        .join("");
}

function printReceipt(id) {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = savedOrders.find(
        (o) => (o.orderId || o.id).toString() === id.toString(),
    );

    if (!order) {
        alert("Dalabkan laguma helin kaydka!");
        return;
    }

    const printWindow = window.open("", "_blank", "width=600,height=600");
    printWindow.document.write(`
    <html>
    <head>
        <title>Receipt #${id.toString().slice(-5)}</title>
        <style>
            @page { size: auto; margin: 0mm; }
            body { 
                font-family: 'Courier New', Courier, monospace; 
                width: 320px; 
                margin: 0 auto; 
                padding: 20px; 
                color: #111; 
                background-color: #fff;
            }
            .receipt-container {
                border: 1px solid #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            }
            .header { 
                text-align: center; 
                margin-bottom: 15px; 
            }
            .brand-name {
                font-size: 24px;
                font-weight: 900;
                letter-spacing: 2px;
                margin: 0;
                color: #ea580c; /* Orange-600 */
            }
            .subtitle {
                font-size: 11px;
                color: #666;
                margin: 3px 0 0 0;
            }
            .divider { 
                border-top: 2px dashed #bbb; 
                margin: 12px 0;
            }
            .details-table {
                width: 100%;
                font-size: 13px;
                border-collapse: collapse;
                margin-bottom: 10px;
            }
            .details-table td {
                padding: 4px 0;
                vertical-align: top;
            }
            .label {
                color: #555;
                font-weight: bold;
                width: 40%;
            }
            .value {
                text-align: right;
                width: 60%;
                word-break: break-word;
            }
            .item-row {
                background-color: #f9fafb;
                padding: 8px;
                border-radius: 4px;
                margin: 10px 0;
                font-size: 14px;
            }
            .item-flex {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
            }
            .total-container { 
                display: flex;
                justify-content: space-between;
                font-size: 18px; 
                font-weight: bold; 
                color: #111; 
                margin-top: 12px;
                padding-top: 4px;
            }
            .footer {
                text-align: center;
                font-size: 11px;
                color: #777;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header">
                <h2 class="brand-name">DHARAG</h2>
                <p class="subtitle">Delicious Food Delivered Fresh</p>
                <p class="subtitle">Waad ku mahadsantahay dalabkaaga</p>
            </div>
            
            <div class="divider"></div>
            
            <table class="details-table">
                <tr>
                    <td class="label">Order ID:</td>
                    <td class="value">#${id.toString().slice(-5)}</td>
                </tr>
                <tr>
                    <td class="label">Customer:</td>
                    <td class="value">${order.name || "N/A"}</td>
                </tr>
                <tr>
                    <td class="label">Phone:</td>
                    <td class="value">${order.phone || "N/A"}</td>
                </tr>
                <tr>
                    <td class="label">Address:</td>
                    <td class="value">${order.address || "N/A"}</td>
                </tr>
            </table>
            
            <div class="divider"></div>
            
            <div class="item-row">
                <div class="item-flex">
                    <span>${order.food || order.foodName}</span>
                    <span>1x</span>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="total-container">
                <span>TOTAL PAID:</span>
                <span>${order.price.includes("$") ? order.price : "$" + order.price}</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
                <p>Palace of Taste • Kismayo, Somalia</p>
            </div>
        </div>

        <script>
            window.onload = function() { 
                window.print(); 
                setTimeout(function() { window.close(); }, 500); 
            }
        </script>
    </body>
    </html>
`);
    printWindow.document.close();
}

function deleteHistoryOrder(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "do you want to delete this?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Okay, Delete!",
        cancelButtonText: "Cancel",
    }).then((result) => {
        if (result.isConfirmed) {
            let savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

            savedOrders = savedOrders.filter(
                (order) => (order.orderId || order.id).toString() !== id.toString(),
            );

            localStorage.setItem("orders", JSON.stringify(savedOrders));

            if (typeof updateDeliveredHistory === "function")
                updateDeliveredHistory();
            if (typeof loadOrders === "function") loadOrders();

            Swal.fire({
                title: "Waa la tirtiray!",
                text: "Dalabkii waa laga saaray taariikhda.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    });
}
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        const target = link.getAttribute("data-target");

        if (target === "order-history" || target === "order") {
            setTimeout(updateDeliveredHistory, 50);
        }
    });
});
window.addEventListener("DOMContentLoaded", loadOrders);
