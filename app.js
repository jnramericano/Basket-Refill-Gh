;(function () {
const DRAFT_KEY = "basketRefillGHDraft";
const LEADS_KEY = "basketRefillGHLeads";
const MESSAGES_KEY = "basketRefillGHMessages";

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0
});

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    description: "Best for light monthly shopping.",
    features: [
      "Starter monthly basket",
      "Simple refill support",
      "Good for students on a budget"
    ]
  },
  {
    id: "standard",
    name: "Standard",
    price: 179,
    description: "Balanced for most students.",
    features: [
      "Bigger basket",
      "More refill items",
      "Better monthly value"
    ],
    recommended: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 299,
    description: "For maximum convenience.",
    features: [
      "Largest basket",
      "Priority support",
      "Best for busy students"
    ]
  }
];

const products = [
  { id: "rice", name: "Rice", category: "Provisions", unit: "2kg", price: 28, refillable: true, description: "A student staple for daily meals." },
  { id: "beans", name: "Beans", category: "Provisions", unit: "2kg", price: 30, refillable: true, description: "For waakye, stew, and quick meals." },
  { id: "oil", name: "Cooking Oil", category: "Cooking", unit: "1L", price: 32, refillable: true, description: "Refill-friendly kitchen essential." },
  { id: "margarine", name: "Margarine", category: "Provisions", unit: "500g", price: 22, refillable: false, description: "Spread and cook with everyday convenience." },
  { id: "bread", name: "Bread", category: "Provisions", unit: "Loaf", price: 12, refillable: false, description: "Fresh bread for breakfast and quick meals." },
  { id: "eggs", name: "Eggs", category: "Provisions", unit: "6 pack", price: 18, refillable: false, description: "Protein-rich and easy to prepare." },
  { id: "milo", name: "Milo", category: "Breakfast", unit: "400g", price: 24, refillable: true, description: "Breakfast and study-time energy." },
  { id: "sugar", name: "Sugar", category: "Breakfast", unit: "1kg", price: 18, refillable: true, description: "For tea, porridge, and drinks." },
  { id: "oats", name: "Oats", category: "Breakfast", unit: "500g", price: 20, refillable: true, description: "Quick and easy morning option." },
  { id: "flour", name: "Wheat Flour", category: "Breakfast", unit: "2kg", price: 26, refillable: false, description: "For baking, porridge, and pancakes." },
  { id: "detergent", name: "Detergent", category: "Cleaning", unit: "1kg", price: 28, refillable: true, description: "For laundry and general cleaning." },
  { id: "dishwash", name: "Dishwashing Liquid", category: "Cleaning", unit: "1L", price: 25, refillable: false, description: "Clean dishes and cookware with ease." },
  { id: "bleach", name: "Bleach", category: "Cleaning", unit: "1L", price: 20, refillable: false, description: "Strong cleaning support for the kitchen and bathroom." },
  { id: "shampoo", name: "Shampoo", category: "Toiletries", unit: "500ml", price: 35, refillable: false, description: "Hair care essentials for daily use." },
  { id: "soap", name: "Bath Soap", category: "Toiletries", unit: "3 pack", price: 22, refillable: false, description: "Everyday personal care item." },
  { id: "toothpaste", name: "Toothpaste", category: "Toiletries", unit: "Tube", price: 18, refillable: false, description: "Daily hygiene essential." },
  { id: "tissue", name: "Toilet Tissue", category: "Toiletries", unit: "4 roll pack", price: 25, refillable: false, description: "Useful for hostel and home use." },
  { id: "biscuits", name: "Biscuits", category: "Snacks & Drinks", unit: "Pack", price: 12, refillable: false, description: "Quick snack between lectures." },
  { id: "water", name: "Bottled Water", category: "Snacks & Drinks", unit: "Pack", price: 16, refillable: false, description: "Useful for class, hostel and travel." },
  { id: "chips", name: "Chips", category: "Snacks & Drinks", unit: "Pack", price: 10, refillable: false, description: "A familiar snack for study breaks." },
  { id: "juice", name: "Fruit Juice", category: "Snacks & Drinks", unit: "1L", price: 24, refillable: false, description: "Refreshment for study time and breaks." },
  { id: "canned-tomatoes", name: "Canned Tomatoes", category: "Cooking", unit: "400g", price: 20, refillable: false, description: "Quick sauce base for meals." },
  { id: "pasta", name: "Pasta", category: "Cooking", unit: "500g", price: 18, refillable: false, description: "Easy, fast, and filling pantry item." },
  { id: "salt", name: "Salt", category: "Cooking", unit: "500g", price: 12, refillable: false, description: "Essential seasoning for every kitchen." },
  { id: "pens", name: "Pens", category: "Stationery", unit: "3 pack", price: 10, refillable: false, description: "Basic writing essentials for school." },
  { id: "notebook", name: "Notebook", category: "Stationery", unit: "1 book", price: 14, refillable: false, description: "For class notes and assignments." }
];

const productImages = {
  rice: "https://i.pinimg.com/1200x/11/3e/ae/113eae72dd9b982bca13381d8b6575b7.jpg",
  
  beans:
    "https://i.pinimg.com/1200x/09/ad/24/09ad244a3944b3716d4d68f725412141.jpg",
  
  oil:
    "https://i.pinimg.com/1200x/2e/ac/93/2eac93201393e4fce87ad84b5d8ad985.jpg",
  
  margarine:
    "https://i.pinimg.com/1200x/07/c4/bf/07c4bfd85dd167c0bfe5058d7c09e6fd.jpg",
  
  bread:
    "https://i.pinimg.com/1200x/7f/ce/7a/7fce7afbf66cf7fa520a560eb50a6e8f.jpg",
  eggs:
    "https://i.pinimg.com/1200x/ac/05/ff/ac05ff382c8784edf71a460924522480.jpg",
  milo:
    "https://i.pinimg.com/1200x/9d/24/e9/9d24e9cb6db48d17fd31ed7a18f2b998.jpg",
  sugar:
   "https://i.pinimg.com/1200x/c3/fa/19/c3fa194577e56af1bcf4d9099ce0850e.jpg",
  oats:
    "https://i.pinimg.com/1200x/20/4d/e0/204de0501d18b3c6161a9bcf2540ce05.jpg",
  flour:
    "https://i.pinimg.com/1200x/b0/01/c3/b001c3feba5952a01afc6e3c2b863f86.jpg",
  detergent:
    "https://i.pinimg.com/1200x/c8/2d/e3/c82de30dbcd19129a6ff7a909661c719.jpg",
  dishwash:
    "https://i.pinimg.com/1200x/8c/96/4e/8c964e32f53f95d8552b4aa44151e0a9.jpg",
  bleach:
    "https://i.pinimg.com/1200x/cf/a4/91/cfa4910ae8d53b13f43d70adaadf12f0.jpg",
  shampoo:
    "https://i.pinimg.com/1200x/e7/a4/e6/e7a4e67db81f8b2b9dee8a337c50d2e0.jpg",
  soap:
   "https://i.pinimg.com/1200x/33/76/75/337675a2ff3696e498fe3cfa9e07b2c7.jpg",
  toothpaste:
    "https://i.pinimg.com/1200x/83/3a/55/833a550a3d7f1919c5149fa73f3d186b.jpg",
  tissue:
    "https://i.pinimg.com/736x/5b/1e/8f/5b1e8fc2fe5edbbf92cb4434d28cdd2f.jpg",
  biscuits:
   "https://i.pinimg.com/1200x/51/48/84/514884707dcc96a86ca395315ee3aa55.jpg",
  water:
    "https://i.pinimg.com/736x/7d/95/4a/7d954a0f0e54f72c5c3b8393a393fb62.jpg",
  chips:
   "https://i.pinimg.com/736x/c6/3f/4c/c63f4c6c0667ff617486431102c0cfa1.jpg",
  juice:
    "https://i.pinimg.com/1200x/8d/1e/b0/8d1eb0e0ccbe6a055d1076bfcb317464.jpg",
  "canned-tomatoes":
    "https://i.pinimg.com/1200x/7d/65/a8/7d65a860f898a3efa8ddb407a8763335.jpg",
  pasta:
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
  salt:
    "https://i.pinimg.com/1200x/54/55/df/5455df84b1cd8c50a920422b8c1590fd.jpg",
  pens:
   "https://i.pinimg.com/736x/3f/0e/30/3f0e303bdeb09708c96b413d663b52bb.jpg",
  notebook:
   "https://i.pinimg.com/1200x/63/fa/8a/63fa8a3fe72589c4e721b30cbefd7d20.jpg"
};

const categoryImages = {
  Provisions:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  Breakfast:
    "https://images.unsplash.com/photo-1505253215791-2de07e0996af?auto=format&fit=crop&w=800&q=80",
  Cooking:
    "https://images.unsplash.com/photo-1514516870921-3e0a9e166a08?auto=format&fit=crop&w=800&q=80",
  Cleaning:
    "https://images.unsplash.com/photo-1581579181042-17d7c7eb13d8?auto=format&fit=crop&w=800&q=80",
  Toiletries:
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  "Snacks & Drinks":
    "https://images.unsplash.com/photo-1524594154907-67acb824ffe5?auto=format&fit=crop&w=800&q=80",
  Stationery:
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80"
};

let state = loadDraft();

function loadDraft() {
  const saved = safeParse(localStorage.getItem(DRAFT_KEY));
  return {
    selectedPlan: saved?.selectedPlan || "basic",
    orderType: saved?.orderType || "subscription",
    cart: Array.isArray(saved?.cart) ? saved.cart : []
  };
}

function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getEls(id) {
  return Array.from(document.querySelectorAll(`[id="${id}"]`));
}

function setTextAll(id, value) {
  getEls(id).forEach((el) => (el.textContent = value));
}

function setHTMLAll(id, value) {
  getEls(id).forEach((el) => (el.innerHTML = value));
}

function onAll(id, event, handler) {
  getEls(id).forEach((el) => el.addEventListener(event, handler));
}

function money(amount) {
  return currency.format(Number(amount) || 0);
}

function getPlan(id = state.selectedPlan) {
  return plans.find((plan) => plan.id === id) || plans[0];
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function cartQty(id) {
  return state.cart.find((item) => item.id === id)?.qty || 0;
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  return state.cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function currentTotal() {
  const plan = getPlan();
  const addOnTotal = cartSubtotal();

  if (state.orderType === "single") {
    return addOnTotal;
  }

  return plan.price + addOnTotal;
}

function currentPlanCharge() {
  return state.orderType === "single" ? 0 : getPlan().price;
}

function selectedPlanLabel() {
  return getPlan().name;
}

function orderTypeLabel() {
  return state.orderType === "single"
    ? "Single item / one-time order"
    : "Monthly subscription";
}

function updatePlanSelect() {
  const select = document.getElementById("planSelect");
  if (select) select.value = state.selectedPlan;
}

function updateOrderTypeSelects() {
  const signUpSelect = document.getElementById("orderPreference");
  const shopSelect = document.getElementById("orderType");

  if (signUpSelect) signUpSelect.value = state.orderType;
  if (shopSelect) shopSelect.value = state.orderType;
}

function renderPlanOptions() {
  const select = document.getElementById("planSelect");
  if (!select) return;

  select.innerHTML = plans
    .map(
      (plan) => `
        <option value="${plan.id}">${plan.name} — ${money(plan.price)}/month</option>
      `
    )
    .join("");

  select.value = state.selectedPlan;
}

function renderPlans() {
  const markup = plans
    .map((plan) => {
      const selected = plan.id === state.selectedPlan;
      return `
        <article class="plan-card ${plan.recommended ? "recommended" : ""} ${
          selected ? "selected" : ""
        }">
          <span class="plan-badge">${plan.recommended ? "Most popular" : "Plan"}</span>
          <h3>${plan.name}</h3>
          <p class="plan-description">${plan.description}</p>
          <div class="plan-price">${money(plan.price)} <span>/month</span></div>
          <ul class="plan-features">
            ${plan.features.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <button class="btn ${selected ? "btn-secondary" : "btn-primary"}" data-action="choose-plan" data-plan="${plan.id}">
            ${selected ? "Selected" : "Choose plan"}
          </button>
        </article>
      `;
    })
    .join("");

  setHTMLAll("plansGrid", markup);
}

function filteredProducts() {
  const q = (document.getElementById("productSearch")?.value || "").toLowerCase().trim();
  const category = document.getElementById("categoryFilter")?.value || "";

  return products.filter((product) => {
    const matchesSearch =
      !q ||
      `${product.name} ${product.category} ${product.unit} ${product.description}`
        .toLowerCase()
        .includes(q);

    const matchesCategory = !category || product.category === category;

    return matchesSearch && matchesCategory;
  });
}

function renderProducts() {
  const items = filteredProducts();

  const markup = items.length
    ? items
        .map((product) => {
          const qty = cartQty(product.id);
          const imageUrl = productImages[product.id] || categoryImages[product.category] || categoryImages.Provisions;
          return `
            <article class="item-card">
              <div class="item-image" style="background-image:url('${imageUrl}')"></div>
              <div class="item-top">
                <div>
                  <h3>${product.name}</h3>
                  <div class="item-meta">${product.category} • ${product.unit}</div>
                </div>
                <span class="item-tag ${product.refillable ? "" : "packaged"}">
                  ${product.refillable ? "Refillable" : "Packaged"}
                </span>
              </div>

              <p class="item-description">${product.description}</p>

              <div class="item-price">${money(product.price)}</div>

              <div class="quantity-control">
                <button class="qty-btn" data-action="decrease" data-id="${product.id}" ${
                  qty === 0 ? "disabled" : ""
                }>−</button>
                <span class="qty-value">${qty}</span>
                <button class="qty-btn" data-action="increase" data-id="${product.id}">+</button>
              </div>

              <div class="item-actions">
                <input
                  type="number"
                  min="1"
                  value="1"
                  class="qty-input"
                  data-id="${product.id}"
                  aria-label="Quantity for ${product.name}"
                />
                <button class="btn btn-secondary" data-action="add-quantity" data-id="${product.id}">
                  Add quantity
                </button>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="item-card"><p class="empty-text">No products match your search.</p></div>`;

  setHTMLAll("itemsGrid", markup);
  setTextAll("availableItemCount", `${items.length} item${items.length === 1 ? "" : "s"}`);
}

function addItemByQuantity(id, qty) {
  const product = getProduct(id);
  if (!product) return;

  const found = state.cart.find((item) => item.id === id);
  if (found) found.qty += qty;
  else state.cart.push({ id, qty });

  renderAll();
  showToast(`${qty} ${product.name} added.`);
}

function renderBasket() {
  const cart = state.cart;

  if (!cart.length) {
    setHTMLAll("selectedItemsList", `<p class="empty-text">No items selected yet.</p>`);
    setTextAll("basketItemCount", "0 items");
    return;
  }

  const markup = cart
    .map((item) => {
      const product = getProduct(item.id);
      if (!product) return "";

      const subtotal = product.price * item.qty;

      return `
        <div class="selected-item-row">
          <span>
            ${product.name} × ${item.qty}
            <br />
            <small class="muted">${product.category}</small>
          </span>

          <strong>${money(subtotal)}</strong>
        </div>
      `;
    })
    .join("");

  setHTMLAll("selectedItemsList", markup);
  setTextAll("basketItemCount", `${cartCount()} item${cartCount() === 1 ? "" : "s"}`);
}

function renderSummary() {
  const plan = getPlan();
  const total = currentTotal();
  const planCharge = currentPlanCharge();

  setTextAll("summaryOrderType", orderTypeLabel());
  setTextAll("summaryPlanName", plan.name);
  setTextAll("summaryPlanPrice", money(planCharge || plan.price));
  setTextAll("summaryTotal", money(total));

  setTextAll("heroSelectedPlan", plan.name);
  setTextAll("heroSelectedTotal", money(total));
  setTextAll("impactPlanName", plan.name);

  updateOrderTypeSelects();
  updatePlanSelect();
}

function renderImpact() {
  const itemCount = cartCount();
  const refillableCount = state.cart.filter((item) => getProduct(item.id)?.refillable).length;

  const plasticSaved = Math.max(2, itemCount * 2 + refillableCount * 3 + (state.orderType === "subscription" ? 4 : 1));
  const co2Reduced = (plasticSaved * 0.05).toFixed(1);
  const containersUsed = Math.max(1, refillableCount || 1);

  setTextAll("plasticSaved", String(plasticSaved));
  setTextAll("co2Reduced", `${co2Reduced}kg`);
  setTextAll("containersUsed", String(containersUsed));
}

function renderAll() {
  renderPlanOptions();
  renderPlans();
  renderProducts();
  renderBasket();
  renderSummary();
  renderImpact();
  saveDraft();
}

function addItem(id) {
  const found = state.cart.find((item) => item.id === id);
  if (found) found.qty += 1;
  else state.cart.push({ id, qty: 1 });

  renderAll();
  showToast(`${getProduct(id).name} added.`);
}

function removeItem(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  renderAll();
  showToast("Item removed.");
}

function decreaseItem(id) {
  const found = state.cart.find((item) => item.id === id);
  if (!found) return;

  found.qty -= 1;
  if (found.qty <= 0) {
    removeItem(id);
    return;
  }

  renderAll();
}

function clearCart() {
  state.cart = [];
  renderAll();
  showToast("Basket cleared.");
}

function setPlan(planId) {
  state.selectedPlan = planId;
  renderAll();
  showToast(`${getPlan(planId).name} selected.`);
}

function setOrderType(type) {
  state.orderType = type === "single" ? "single" : "subscription";
  renderAll();
}

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function bindEvents() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "choose-plan") setPlan(btn.dataset.plan);
    if (action === "increase") addItem(id);
    if (action === "decrease") decreaseItem(id);
    if (action === "add-quantity") {
      const qtyInput = document.querySelector(`.qty-input[data-id="${id}"]`);
      const qty = Math.max(1, Number(qtyInput?.value) || 1);
      addItemByQuantity(id, qty);
    }
    if (action === "remove") removeItem(id);
  });

  const search = document.getElementById("productSearch");
  const category = document.getElementById("categoryFilter");

  if (search) search.addEventListener("input", renderProducts);
  if (category) category.addEventListener("change", renderProducts);

  onAll("clearItemsBtn", "click", clearCart);

  const orderTypeSelect = document.getElementById("orderType");
  if (orderTypeSelect) {
    orderTypeSelect.addEventListener("change", (e) => setOrderType(e.target.value));
  }

  const orderPreference = document.getElementById("orderPreference");
  if (orderPreference) {
    orderPreference.addEventListener("change", (e) => setOrderType(e.target.value));
  }

  const planSelect = document.getElementById("planSelect");
  if (planSelect) {
    planSelect.addEventListener("change", (e) => setPlan(e.target.value));
  }

  const messageForm = document.getElementById("messageForm");
  if (messageForm) {
    messageForm.addEventListener("submit", handleMessageSubmit);
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignupSubmit);
  }
}

function handleMessageSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("messageName").value.trim();
  const contact = document.getElementById("messageContact").value.trim();
  const topic = document.getElementById("messageTopic").value;
  const message = document.getElementById("messageText").value.trim();
  const response = document.getElementById("messageResponse");

  const messages = safeParse(localStorage.getItem(MESSAGES_KEY)) || [];

  messages.unshift({
    id: `MSG-${Date.now()}`,
    name,
    contact,
    topic,
    message,
    status: "New",
    reply: "",
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

  e.target.reset();

  if (response) {
    response.textContent = "Thanks. Your message has been sent.";
    response.classList.add("show");
  }

  showToast("Comment saved.");
}

function handleSignupSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const phone = document.getElementById("phone").value.trim();
  const school = document.getElementById("school").value;
  const studentType = document.getElementById("studentType").value;
  const deliveryArea = document.getElementById("deliveryArea").value.trim();
  const orderPreference = document.getElementById("orderPreference").value;
  const planId = document.getElementById("planSelect").value || state.selectedPlan;
  const comments = document.getElementById("studentComments").value.trim();
  const consent = document.getElementById("consent").checked;
  const confirmation = document.getElementById("confirmationCard");

  if (!consent) {
    showToast("Please confirm the consent checkbox.");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match.");
    return;
  }

  if (!window.BRGHAuth) {
    showToast("Auth system not loaded.");
    return;
  }

  try {
    BRGHAuth.registerStudent({
      name,
      email,
      password,
      school,
      studentType,
      phone,
      deliveryArea,
      orderPreference,
      plan: planId,
      comments
    });

    // Update the newest lead with cart items and totals
    const leads = BRGHAuth.getLeads();
    const lead = leads[0];

    if (lead && lead.email && lead.email.toLowerCase() === email.toLowerCase()) {
      const plan = getPlan(planId);
      const addOns = state.cart.map((item) => {
        const product = getProduct(item.id);
        return {
          id: product.id,
          name: product.name,
          unit: product.unit,
          category: product.category,
          price: product.price,
          quantity: item.qty,
          refillable: product.refillable
        };
      });

      lead.fullName = name;
      lead.phone = phone;
      lead.school = school;
      lead.studentType = studentType;
      lead.deliveryArea = deliveryArea;
      lead.orderType = orderPreference;
      lead.orderTypeLabel =
        orderPreference === "single"
          ? "Single item / one-time order"
          : "Monthly subscription";
      lead.planId = orderPreference === "single" ? "none" : plan.id;
      lead.planName = orderPreference === "single" ? "No subscription" : plan.name;
      lead.planPrice = orderPreference === "single" ? 0 : plan.price;
      lead.addOns = addOns;
      lead.addonTotal = cartSubtotal();
      lead.estimatedMonthlyTotal =
        orderPreference === "single"
          ? cartSubtotal()
          : plan.price + cartSubtotal();
      lead.comments = comments;

      BRGHAuth.saveLeads(leads);
    }

    if (confirmation) {
      confirmation.hidden = false;
      confirmation.innerHTML = `
        <h3>Registration received</h3>
        <p>Thanks, ${escapeHTML(name)}. Your interest has been saved.</p>
        <ul>
          <li>Plan: ${escapeHTML(getPlan(planId).name)}</li>
          <li>Order type: ${escapeHTML(
            orderPreference === "single" ? "Single item order" : "Monthly subscription"
          )}</li>
          <li>Items selected: ${cartCount()}</li>
        </ul>
        <p>Redirecting to login...</p>
      `;
    }

    showToast("Account created. Redirecting to login...");

    setTimeout(() => {
      window.location.href = `login.html?email=${encodeURIComponent(email)}`;
    }, 1200);
  } catch (err) {
    showToast(err.message || "Signup failed.");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  bindEvents();
  renderAll();
});
})();