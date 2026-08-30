// content data 
const MENU_ITEMS = [
  {
    id: 1,
    name: "Semo and eguisi",
    desc: "Freshly made semo with eguisi soup",
    price: 2500,
    category: "Breakfast",
    tags: ["Breakfast"],
    img: "images/amala and more Main.jpg"
  },
  {
    id: 2,
    name: "Plantain & Beans (Ewa Agoyin)",
    desc: "Fried plantain with specially prepared beans",
    price: 1500,
    category: "Breakfast",
    tags: ["Breakfast"],
    img: "images/ewaagoyinposh.jpg"
  },
  {
    id: 3,
    name: "Moi Moi & Bread",
    desc: "Steamed bean pudding with soft bread",
    price: 1500,
    category: "Breakfast",
    tags: ["Breakfast", "Vegetarian"],
    img: "images/moimoi.jpg"
  },
  {
    id: 9,
    name: "Jollof Rice & Chicken",
    desc: "Signature smoky jollof rice with grilled chicken",
    price: 2000,
    category: "Main Courses",
    tags: ["Main", "Spicy"],
    img: "images/jollofrice.jpg"
  },
  {
    id: 10,
    name: "Ofada Rice & Ayamase Sauce",
    desc: "Local rice with spicy green pepper sauce",
    price: 2000,
    category: "Main Courses",
    tags: ["Main", "Spicy"],
    img: "images/ofadaposh.jpeg"
  },
  {
    id: 11,
    name: "Fufu & Eguisi",
    desc: "Vegetable soup with fufu or akpu and goat meat",
    price: 2500,
    category: "Main Courses",
    tags: ["Main"],
    img: "images/fufu and eguisi.jpg"
  },
  {
    id: 12,
    name: "Native Jollof",
    desc: "Traditional palm oil jollof with assorted protein(concoction)",
    price: 1500,
    category: "Main Courses",
    tags: ["Main"],
    img: "images/nativeJollof.jpg"
  },
  {
    id: 13,
    name: "Okra Soup & Eba",
    desc: "Fresh okra soup served with eba",
    price: 1500,
    category: "Main Courses",
    tags: ["Main"],
    img: "images/okraposh.jpg"
  },
  {
    id: 14,
    name: "Pepper Soup (Goat/Catfish)",
    desc: "Spicy traditional pepper soup",
    price: 3000,
    category: "Main Courses",
    tags: ["Main", "Spicy"],
    img: "images/peppersoupposh.jpg"
  },
  {
    id: 15,
    name: "Street Bukka Special",
    desc: "Amala, Ewedu ,beef + Drink",
    price: 2500,
    category: "Special Combos",
    tags: ["Special Combos"],
    img: "images/amalafood.jpg"
  },
  {
    id: 16,
    name: "Soft Drinks",
    desc: "Assorted chilled soft drinks",
    price: 800,
    category: "Drinks & Beverages",
    tags: ["Drinks"],
    options: ["Coke - ₦600", "Fanta - ₦500", "Sprite - ₦500", "pepsi - ₦500"],
    img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&q=70&auto=format"
  },
  {
    id: 17,
    name: "Bottled Water",
    desc: "Pure bottled water",
    price: 600,
    category: "Drinks & Beverages",
    tags: ["Drinks"],
    options: ["Cold - ₦500", "Normal - ₦300"],
    img: "images/bottledwater.png"
  },
  {
    id: 18,
    name: "Zobo Drink",
    desc: "Refreshing hibiscus drink",
    price: 1200,
    category: "Drinks & Beverages",
    tags: ["Drinks"],
    img: "images/zoboposh.jpg"
  },
  {
    id: 19,
    name: "Fresh Juice",
    desc: "Fresh nigerian fruit mix",
    price: 2000,
    category: "Drinks & Beverages",
    tags: ["Drinks"],
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&q=70&auto=format"
  },
  {
    id: 20,
    name: "Palm Wine",
    desc: "Traditional palm wine",
    price: 1000,
    category: "Drinks & Beverages",
    tags: ["Drinks"],
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=70&auto=format"
  },
  {
    id: 22,
    name: "Beer/Malt/Energy Drink",
    desc: "Assorted beverages",
    price: 1200,
    category: "Drinks & Beverages",
    tags: ["Drinks"],
    options: ["Schweppes - ₦600", "Malt - ₦700", "Predator - ₦600" , "Five Alive -₦1500" , "Berry Blast - ₦1,500"],
    img: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=70&auto=format"
  }
];

/** carousel */
const SPECIALS = [15, 10, 9, 11, 13]; // 5 items

// state
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("Street Bukka _cart") || "[]");
} catch (_) {
  cart = [];
}

let currentPage = "home";
let activeFilter = "All";
let activeDiet = null;
let searchQuery = "";
let carouselTimer = null;
let carouselIndex = 0;

function formatPrice(n) {
  return "₦" + Number(n).toLocaleString();
}

/** Safe image tag with lazy load and fallback . I later excluded the icons and svgs . We will just leave blank */
function imgTag(src, alt, extraClass) {
  const cls = extraClass ? ` class="${extraClass}"` : ' class="food-img"';
  return `<img${cls} src="${src}" alt="${alt || ""}" loading="lazy" decoding="async"
    onerror="this.onerror=null;this.style.display='none';this.parentNode.insertAdjacentHTML('beforeend','<div class=\\'img-fallback\\'></div>');">`;
}

function saveCart() {
  try {
    localStorage.setItem("Street Bukka _cart", JSON.stringify(cart));
  } catch (_) { }
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById("cartBadge");
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!badge || !container || !totalEl) return;

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "flex" : "none";

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    totalEl.textContent = "₦0";
    return;
  }

  container.innerHTML = cart
    .map((item) => {
      const opt = (item.option || "").replace(/'/g, "\\'");
      return `
        <div class="cart-item">
          <div class="cart-item-img" style="width:64px;height:64px;border-radius:10px;overflow:hidden;flex-shrink:0">
            ${imgTag(item.img, item.name)}
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.option || ""}</p>
            <div class="cart-item-qty">
              <button type="button" onclick="changeQty(${item.id},-1,'${opt}')">−</button>
              <span>${item.qty}</span>
              <button type="button" onclick="changeQty(${item.id},1,'${opt}')">+</button>
            </div>
          </div>
          <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        </div>`;
    })
    .join("");

  totalEl.textContent = formatPrice(cart.reduce((s, i) => s + i.price * i.qty, 0));
}

function addToCart(id, option) {
  option = option || null;
  const item = MENU_ITEMS.find((m) => m.id === id);
  if (!item) return;

  const existing = cart.find((c) => c.id === id && c.option === option);
  if (existing) {
    existing.qty += 1;
  } else {
    // still push to cart
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      qty: 1,
      option
    });
  }
  saveCart();
}

function changeQty(id, delta, option) {
  option = option || null;
  const item = cart.find((c) => c.id === id && c.option === option);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((c) => !(c.id === id && c.option === option));
  }
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
  closeCart(); // hide modal after clear
}

function closeCart() {
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
}

// start carousel movement
function startCarousel() {
  stopCarousel();
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  const slides = track.children.length;
  carouselIndex = 0;

  carouselTimer = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % slides;
    goToSlide(carouselIndex);
  }, 4000);

  // Pause on hover
  const wrap = document.querySelector(".carousel-wrap");
  if (wrap) {
    wrap.addEventListener("mouseenter", stopCarousel);
    wrap.addEventListener("mouseleave", startCarousel);
  }
}

function stopCarousel() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

function goToSlide(i) {
  const track = document.getElementById("carouselTrack");
  if (!track) return;
  carouselIndex = i;
  track.style.transform = `translateX(-${i * 100}%)`;

  document.querySelectorAll(".carousel-dot").forEach((d, idx) => {
    d.classList.toggle("active", idx === i);
  });
}

// render specific pages per call
function renderHome() {
  const specialSlides = SPECIALS.map((id) => {
    const m = MENU_ITEMS.find((x) => x.id === id);
    return `
      <div class="carousel-slide">
        <div class="special-img">
          ${imgTag(m.img, m.name)}
        </div>
        <div class="special-content">
          <span class="chef-pick">Chef's Pick</span>
          <h3>${m.name}</h3>
          <p>${m.desc}</p>
          <div style="display:flex;align-items:center;gap:1rem;margin-top:0.5rem">
            <span class="meal-price" style="font-size:1.25rem">${formatPrice(m.price)}</span>
            <button class="btn-order" onclick="addToCart(${m.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              Order
            </button>
          </div>
        </div>
      </div>`;
  }).join("");

  const dots = SPECIALS.map(
    (_, i) =>
      `<button class="carousel-dot ${i === 0 ? "active" : ""}" onclick="goToSlide(${i})" aria-label="Slide ${i + 1}"></button>`
  ).join("");

  return `
  <section class="hero">
    <div class="hero-container">
      <div class="hero-text">
        <div class="hero-badge">Welcome to Street Bukka</div>
        <h1>Fresh Foods You<br><span class="accent">Can Trust</span></h1>
        <p>Experience the best of Nigerian locally-sourced ingredients foods.Think good food, think Street Bukka.</p>
        <button class="btn-primary" data-page="menu">Order Now →</button>
      </div>
      <div class="hero-visual">
        <div class="hero-circle">
          ${imgTag("images/friedricedodoposh.jpg", "Jollof Rice")}
        </div>
        <div class="free-delivery-badge">Free Delivery<br><small>Orders above ₦25,000</small></div>
        <div class="rating-badge">
          <div class="star">★</div>
          <div><strong>4.9 Rating</strong><span>300+ Reviews</span></div>
        </div>
      </div>
    </div>
  </section>

  <div class="features">
    <div class="feature-card">
      <div class="feature-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" class="bi bi-stars" viewBox="0 0 16 16" stroke="#ff7113ec">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/></svg>
      </div>
      <h3>Fresh Ingredients</h3>
      <p>Locally sourced, always fresh</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff7113ec" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>
      </div>
      <h3>Expert Chefs</h3>
      <p>Authentic Nigerian recipes</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff7113ec" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
      </div>
      <h3>Fast Delivery</h3>
      <p>Right to your doorstep</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff7113ec" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <h3>Quick Service</h3>
      <p>Ready in 15 minutes</p>
    </div>
  </div>

  <section class="section specials-bg">
    <div class="section-header">
      <h2>Today's Specials</h2>
      <p>Rotating chef picks you don't want to miss</p>
      <div class="underline"></div>
    </div>
    <div class="carousel-wrap">
      <button class="carousel-nav carousel-prev" onclick="goToSlide((carouselIndex - 1 + ${SPECIALS.length}) % ${SPECIALS.length})" aria-label="Previous">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="carousel-track" id="carouselTrack">
        ${specialSlides}
      </div>
      <button class="carousel-nav carousel-next" onclick="goToSlide((carouselIndex + 1) % ${SPECIALS.length})" aria-label="Next">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
    <div class="carousel-dots">${dots}</div>
  </section>

  <section class="section">
    <div class="section-header">
      <h2>Featured Meals</h2>
      <p>Our most popular dishes, loved by thousands</p>
      <div class="underline"></div>
    </div>
    <div class="featured-grid">
      ${[9, 10, 15]
      .map((id) => {
        const m = MENU_ITEMS.find((x) => x.id === id);
        return `
          <div class="meal-card">
            <div class="meal-img">
              ${imgTag(m.img, m.name)}
              <span class="meal-tag">${m.category}</span>
            </div>
            <div class="meal-body">
              <h3>${m.name}</h3>
              <p>${m.desc}</p>
              <div class="meal-footer">
                <span class="meal-price">${formatPrice(m.price)}</span>
                <button class="btn-order" onclick="addToCart(${m.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                  Order
                </button>
              </div>
            </div>
          </div>`;
      })
      .join("")}
    </div>
  </section>

  <section class="section" style="background:linear-gradient(180deg,#f0fdf4,#fff7ed)">
    <div class="section-header">
      <p style="margin-bottom:.5rem">A taste of what we offer across our categories</p>
      <div class="underline"></div>
    </div>
    <div class="categories-preview">
      ${[
      { title: "Breakfast", ids: [1, 2] },
      { title: "Main Courses", ids: [9, 11] },
      { title: "Drinks & Beverages", ids: [16, 17] }
    ]
      .map(
        (col) => `
        <div class="cat-column">
          <h3>${col.title}</h3>
          ${col.ids
            .map((id) => {
              const m = MENU_ITEMS.find((x) => x.id === id);
              return `
              <div class="cat-item">
                <div class="cat-item-img">
                  ${imgTag(m.img, m.name)}
                  <span class="tag">${m.tags[0]}</span>
                </div>
                <div class="cat-item-info">
                  <h4>${m.name}</h4>
                  <p>${m.desc}</p>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.4rem">
                    <span class="price">${formatPrice(m.price)}</span>
                    <button class="btn-order" style="padding:.35rem .7rem;font-size:.75rem" onclick="addToCart(${m.id})">Order</button>
                  </div>
                </div>
              </div>`;
            })
            .join("")}
        </div>`
      )
      .join("")}
    </div>
    <div style="text-align:center;margin-top:2.5rem">
      <button class="btn-primary" data-page="menu" style="background:#1f2937">View Full Menu →</button>
    </div>
  </section>

  <section class="section">
    <div class="section-header">
      <h2>Delivery Zones & Fees</h2>
      <p>Clear pricing and quick delivery times</p>
      <div class="underline"></div>
    </div>
    <div class="zones-grid">
      <div class="zone-card"><h3>Kubwa axis</h3><div class="fee">₦800</div><div class="eta">ETA: 15–20 mins</div></div>
      <div class="zone-card"><h3>Along airport road <br> <span style="color:#ff7113ec;">Estates</span></h3><div class="fee">₦1,000</div><div class="eta">ETA: 25–30 mins</div></div>
      <div class="zone-card"><h3>City gate and beyond</h3><div class="fee">₦1,500</div><div class="eta">ETA: 35–50 mins</div></div>
    </div>
  </section>

  <div class="catering-banner">
    <div>
      <h3>Catering & Events</h3>
      <p>Hosting a party or corporate event? We handle bulk orders, custom menus, and on-time delivery.</p>
    </div>
    <div class="catering-actions">
      <button class="btn-yellow" data-page="contact">Book Catering</button>
      <button class="btn-outline-light" data-page="menu">View Menu</button>
    </div>
  </div>

  <div class="story-section">
    <div class="story-visual">
      <div class="big-logo">Street<br>Bukka</div>
      <div style="color:#fff;text-align:center;font-weight:700;font-size:1.3rem">Street Bukka </div>
      <div style="color:#fff;letter-spacing:.15em;font-size:.65rem">KITCHEN</div>
      <p class="tagline" style="margin-top:1rem;color:#fff">Eat smart, Live fresh</p>
    </div>
    <div class="story-text">
      <h2>Our Story</h2>
      <div class="underline"></div>
      <p>Street Bukka was born from a passion for authentic Nigerian flavors and a commitment to freshness. Every dish we serve is crafted with care, using locally-sourced ingredients and time-honored recipes.</p>
      <p>Our mission is simple: deliver meals that nourish your body and delight your taste buds.</p>
      <a href="#" data-page="about">Learn more about us →</a>
    </div>
  </div>

  <section class="cta-banner">
    <h2>Hungry? We've Got You Covered</h2>
    <p>Order your favorite meals online and enjoy fast delivery to your doorstep. Fresh, hot, and delicious — every time.</p>
    <div class="cta-actions">
      <button class="btn-yellow-lg" data-page="menu">Order Now</button>
      <button class="btn-outline-white" data-page="contact">Contact Us</button>
    </div>
  </section>`;
}

function renderMenu() {
  const categories = [
    "All",
    "Breakfast",
    "Snacks & Light Meals",
    "Drinks & Beverages",
    "Main Courses",
    "Desserts",
    "Special Combos"
  ];
  const diets = ["Vegetarian", "Spicy", "Gluten-Free"];

  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat = activeFilter === "All" || item.category === activeFilter;
    const matchDiet = !activeDiet || (item.tags && item.tags.includes(activeDiet));
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchCat && matchDiet && matchSearch;
  });

  return `
  <section class="menu-hero">
    <h1>Our Menu</h1>
    <p>Freshness you can taste.</p>
  </section>
  <div class="menu-controls">
    <div class="search-box">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input type="text" id="menuSearch" placeholder="Search dishes, ingredients, categories..." value="${searchQuery.replace(/"/g, "&quot;")}" />
    </div>
    <button class="btn-download" type="button">↓ Download Menu</button>
  </div>
  <div class="filters">
    ${categories
      .map(
        (c) =>
          `<button class="filter-btn ${activeFilter === c ? "active" : ""}" data-filter="${c}">${c}</button>`
      )
      .join("")}
  </div>
  <div class="diet-filters">
    ${diets
      .map(
        (d) =>
          `<button class="diet-btn ${activeDiet === d ? "active" : ""}" data-diet="${d}">${d}</button>`
      )
      .join("")}
  </div>
  <div class="menu-grid">
    ${filtered.length === 0
      ? '<p style="grid-column:1/-1;text-align:center;color:#6b7280;padding:3rem 0">No dishes match your search.</p>'
      : filtered
        .map(
          (item) => `
      <div class="menu-card">
        <div class="menu-card-img">
          ${imgTag(item.img, item.name)}
          <span class="tag">${item.tags[0] || item.category}</span>
        </div>
        <div class="menu-card-body">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          ${item.options
              ? `<select class="option-select" id="opt-${item.id}">${item.options
                .map((o) => `<option>${o}</option>`)
                .join("")}</select>`
              : ""
            }
          <div class="menu-card-footer">
            <span class="menu-price">${formatPrice(item.price)}</span>
            <button class="btn-add" type="button" onclick="addToCart(${item.id}${item.options ? `,document.getElementById('opt-${item.id}').value` : ""
            })">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              Order
            </button>
          </div>
        </div>
      </div>`
        )
        .join("")
    }
  </div>`;
}

function renderAbout() {
  return `
  <section class="about-hero">
    <div class="label">OUR STORY</div>
    <h1>About Us</h1>
    <p>Eat smart, Live fresh</p>
  </section>
  <div class="about-story">
    <div>
      <h2>The Street Bukka Story</h2>
      <div class="underline"></div>
      <p>Street Bukka started with a simple belief: everyone deserves access to fresh, delicious, and affordable Nigerian food. Founded in Abuja, we set out to redefine the local food experience with quality ingredients, skilled chefs, and a vibrant dining atmosphere.</p>
      <p>From our humble beginnings as a small kitchen to our growing network of locations, we remain committed to our founding principles: freshness, authenticity, and community.</p>
      <p>Today, Street Bukka is more than a restaurant — it's a movement toward healthier eating, stronger communities, and a celebration of Nigerian culinary heritage.</p>
    </div>
    <div class="about-visual">
      ${imgTag("images/overlayposh.jpg")}
    </div>
  </div>
  <section class="values-section">
    <div class="section-header">
      <h2>Our Values</h2>
      <p>The pillars that guide everything we do</p>
      <div class="underline"></div>
    </div>
    <div class="values-grid">
      <div class="value-card"><div class="value-icon"> 
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" class="bi bi-stars" viewBox="0 0 16 16" stroke="#ff7113ec">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
  </svg>
  </div>
  <h3>Freshness First</h3><p>We source ingredients locally every morning to guarantee peak freshness in every dish.</p>
  </div>
      <div class="value-card"><div class="value-icon"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" class="bi bi-stars" viewBox="0 0 16 16" stroke="#ff7113ec">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
  </svg>
  </div><h3>Authentic Flavors</h3><p>Our recipes honor traditional Nigerian cuisine while embracing modern techniques.</p></div>
      <div class="value-card"><div class="value-icon"> 
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" class="bi bi-stars" viewBox="0 0 16 16" stroke="#ff7113ec">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
  </svg>
  </div><h3>Community Focus</h3><p>We support local farmers and create opportunities within our community.</p></div>
      <div class="value-card"><div class="value-icon"> 
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" class="bi bi-stars" viewBox="0 0 16 16" stroke="#ff7113ec">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
  </svg>
  </div><h3>Sustainability</h3><p>Eco-conscious packaging and practices that respect our environment.</p></div>
    </div>
  </section>
  <div class="brand-identity">
    <h2>Our Brand Identity</h2>
    <div class="underline"></div>
    <p>The Street Bukka logo combines the letters F and B with a leaf, symbolizing freshness and natural ingredients.</p>
  </div>`;
}

function renderContact() {
  return `
  <section class="contact-hero">
    <div class="label">GET IN TOUCH</div>
    <h1>Contact Us</h1>
    <p>We'd love to hear from you</p>
  </section>
  <div class="contact-section">
    <div class="contact-info">
      <h2>Get In Touch</h2>
      <div class="underline"></div>
      <p>Have questions, feedback, or want to place a bulk order? Reach out to us through any of the channels below or fill out the form.</p>
      <div class="info-item">
       <div class="info-icon"> 
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill"
            viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
          </svg>
       </div>
      <div><h4>Address</h4><p>Kubwa, Abuja, Nigeria.</p></div></div>
      <div class="info-item">
      <div class="info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-telephone-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
        </svg>
      </div><div><h4>Phone</h4><p>07078338766</p></div></div>
      <div class="info-item"><div class="info-icon">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-envelope-at-fill" viewBox="0 0 16 16">
            <path
              d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
            <path
              d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791" />
          </svg>
      </div><div><h4>Email</h4><p>hello@StreetBukka.ng</p></div></div>
      <div class="info-item"><div class="info-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-alarm-fill" viewBox="0 0 16 16">
  <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5m2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.04 8.04 0 0 0 .86 5.387M11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.04 8.04 0 0 0-3.527-3.527"/>
</svg>
      </div><div><h4>Hours</h4><p>Mon–Fri 7am–10pm | Sat 8am–11pm | Sun Closed</p></div></div>
    </div>
    <form class="contact-form" id="contactForm">
      <div class="form-group"><label>Full Name</label><input type="text" placeholder="John Doe" required /></div>
      <div class="form-group"><label>Email</label><input type="email" placeholder="john@example.com" required /></div>
      <div class="form-group"><label>Subject</label><input type="text" placeholder="How can we help?" required /></div>
      <div class="form-group"><label>Message</label><textarea placeholder="Tell us more..." required></textarea></div>
      <button type="submit" class="btn-send">Send Message ✈</button>
    </form>
  </div>`;
}

// spa router , per click
const pages = {
  home: renderHome,
  menu: renderMenu,
  about: renderAbout,
  contact: renderContact
};

function navigate(page) {
  if (!pages[page]) page = "home";
  currentPage = page;
  stopCarousel();

  document.querySelectorAll(".nav-link").forEach((l) => {
    l.classList.toggle("active", l.dataset.page === page);
  });

  document.title =
    "Street Bukka | " +
    ({ home: "Home", menu: "Menu", about: "About", contact: "Contact" }[page]);

  const app = document.getElementById("app");
  if (!app) return;

  app.style.opacity = "0";
  setTimeout(() => {
    app.innerHTML = pages[page]();
    app.style.opacity = "1";
    app.style.transition = "opacity 0.25s ease";

    if (page === "home") startCarousel();
    if (page === "menu") bindMenuEvents();
    if (page === "contact") {
      const form = document.getElementById("contactForm");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          alert("Thank you! Your message has been received.");
          form.reset();
        });
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 120);

  const nav = document.getElementById("navLinks");
  if (nav) nav.classList.remove("open");
}

function bindMenuEvents() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      navigate("menu");
    });
  });
  document.querySelectorAll(".diet-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeDiet = activeDiet === btn.dataset.diet ? null : btn.dataset.diet;
      navigate("menu");
    });
  });
  const search = document.getElementById("menuSearch");
  if (search) {
    search.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      clearTimeout(window._st);
      window._st = setTimeout(() => navigate("menu"), 250);
    });
  }
}

// compile all init 
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    const t = e.target.closest("[data-page]");
    if (t) {
      e.preventDefault();
      navigate(t.dataset.page);
    }
  });

  const toggle = document.getElementById("mobileToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.getElementById("navLinks").classList.toggle("open");
    });
  }

  document.getElementById("floatingCart").addEventListener("click", () => {
    document.getElementById("cartSidebar").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
  });

  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  document.getElementById("clearCartBtn").addEventListener("click", () => {
    if (cart.length && confirm("Clear all items from cart?")) {
      clearCart();
    }
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const lines = cart.map(
      (i) =>
        `• ${i.qty}x ${i.name}${i.option ? " (" + i.option + ")" : ""} – ${formatPrice(
          i.price * i.qty
        )}`
    );
    const total = formatPrice(cart.reduce((s, i) => s + i.price * i.qty, 0));
    const text = encodeURIComponent(
      "Hello Street Bukka! \n\nI would like to place an order:\n\n" +
      lines.join("\n") +
      "\n\n*Total: " +
      total +
      "*\n\nPlease confirm. Thank you!"
      +
      "*\n\nThen drop the restaurants account let me make payment at once!"
    );
    window.open("https://wa.me/2347078338766?text=" + text, "_blank");
  });

  updateCartUI();
  navigate("home");
});

/* Expose for inlinehandling and bakend routing */
window.addToCart = addToCart;
window.changeQty = changeQty;
window.clearCart = clearCart;
window.goToSlide = goToSlide;
window.carouselIndex = 0;
