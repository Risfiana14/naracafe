document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin products script loaded");

  // Unified default products that match between admin and user
  const defaultProducts = [
    {
      id: 1,
      name: "Cappuccino",
      description: "Espresso yang kaya dengan susu dan busa lembut.",
      category: "Coffee",
      price: 34000,
      stock: 100,
      status: "active",
      image:
        "https://i.pinimg.com/736x/64/57/3b/64573b32f8ec76e81973bedf5c3357fa.jpg",
    },
    {
      id: 2,
      name: "Butter Croissant",
      description:
        "Kue kering beraroma mentega yang dipanggang hingga keemasan sempurna.",
      category: "Pastries",
      price: 36000,
      stock: 50,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=634&q=80",
    },
    {
      id: 3,
      name: "Caramel Macchiato",
      description: "Latte manis dengan lapisan karamel dan sentuhan espresso.",
      category: "Coffee",
      price: 40000,
      stock: 80,
      status: "active",
      image:
        "https://i.pinimg.com/736x/bd/de/a0/bddea0e4dbe2f7a9cffa8cab5194cb74.jpg",
    },
    {
      id: 4,
      name: "Caramel Latte",
      description: "Espresso lembut dengan susu dan sirup karamel.",
      category: "Coffee",
      price: 37000,
      stock: 75,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=634&q=80",
    },
    {
      id: 5,
      name: "Jasmine Green Tea",
      description: "Teh hijau harum dengan bunga melati.",
      category: "Non Coffee",
      price: 29000,
      stock: 60,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=634&q=80",
    },
    {
      id: 6,
      name: "Crispy Chicken",
      description:
        "Keunggulan utama dari Crispy Chicken adalah teksturnya yang renyah dan lapisan luar yang lezat.",
      category: "Heavy Food",
      price: 25000,
      stock: 30,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=634&q=80",
    },
  ];

  let products = [];
  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  // Initialize products with consistent data
  function initializeProducts() {
    try {
      const storedProducts = localStorage.getItem("adminProducts");
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          products = parsedProducts;
          console.log("Loaded existing products:", products.length);
        } else {
          products = [...defaultProducts];
          saveProducts();
          console.log("Initialized with default products");
        }
      } else {
        products = [...defaultProducts];
        saveProducts();
        console.log("Created new products from defaults");
      }

      filteredProducts = [...products];
    } catch (e) {
      console.error("Error initializing products:", e);
      products = [...defaultProducts];
      filteredProducts = [...products];
      saveProducts();
    }
  }

  // Save products to localStorage
  function saveProducts() {
    try {
      localStorage.setItem("adminProducts", JSON.stringify(products));
      console.log("Products saved successfully");
      return true;
    } catch (e) {
      console.error("Error saving products:", e);
      showNotification("Error saving products: " + e.message, "error");
      return false;
    }
  }

  // Render products table with pagination
  function renderProductsTable() {
    const tableBody = document.querySelector(".admin-table tbody");
    if (!tableBody) {
      console.error("Table body not found");
      return;
    }

    tableBody.innerHTML = "";

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(
      startIndex + itemsPerPage,
      filteredProducts.length
    );
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Update pagination info
    updatePaginationInfo(startIndex, endIndex, filteredProducts.length);

    // Render products
    paginatedProducts.forEach((product) => {
      const stockStatus =
        product.stock > 10
          ? "In Stock"
          : product.stock > 0
          ? "Low Stock"
          : "Out of Stock";
      const statusClass =
        product.status === "active" ? "status-active" : "status-inactive";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div class="product-info">
            <img src="${product.image}" alt="${
        product.name
      }" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
            <div>
              <h4>${product.name}</h4>
              <p>${product.description}</p>
            </div>
          </div>
        </td>
        <td>${product.category}</td>
        <td>Rp ${product.price.toLocaleString("id-ID")}</td>
        <td>${stockStatus} (${product.stock})</td>
        <td><span class="${statusClass}">${
        product.status === "active" ? "Active" : "Inactive"
      }</span></td>
        <td>
          <button class="action-btn view-btn" data-id="${
            product.id
          }" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit-btn" data-id="${
            product.id
          }" title="Edit Product">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" data-id="${
            product.id
          }" title="Delete Product">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    addActionButtonListeners();
    updatePaginationControls();
  }

  // Update pagination info
  function updatePaginationInfo(start, end, total) {
    let paginationInfo = document.querySelector(".pagination-info");
    if (!paginationInfo) {
      // Create pagination container if it doesn't exist
      const tableContainer = document.querySelector(".admin-table").parentNode;
      const paginationContainer = document.createElement("div");
      paginationContainer.className = "pagination-container";
      paginationContainer.innerHTML = `
        <div class="pagination-info">Showing ${
          start + 1
        } to ${end} of ${total} entries</div>
        <div class="pagination-controls">
          <button class="pagination-btn prev-btn" ${
            currentPage === 1 ? "disabled" : ""
          }>Previous</button>
          <div class="pagination-pages"></div>
          <button class="pagination-btn next-btn" ${
            currentPage === Math.ceil(total / itemsPerPage) ? "disabled" : ""
          }>Next</button>
        </div>
      `;
      tableContainer.appendChild(paginationContainer);

      // Add pagination event listeners
      setupPaginationListeners();
      paginationInfo = document.querySelector(".pagination-info");
    }

    paginationInfo.textContent = `Showing ${
      start + 1
    } to ${end} of ${total} entries`;
  }

  // Setup pagination event listeners
  function setupPaginationListeners() {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderProductsTable();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderProductsTable();
        }
      });
    }
  }

  // Update pagination controls
  function updatePaginationControls() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginationPages = document.querySelector(".pagination-pages");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (paginationPages) {
      paginationPages.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = `pagination-btn page-btn ${
          i === currentPage ? "active" : ""
        }`;
        pageBtn.textContent = i;
        pageBtn.addEventListener("click", () => {
          currentPage = i;
          renderProductsTable();
        });
        paginationPages.appendChild(pageBtn);
      }
    }

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn)
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  // Add event listeners to action buttons
  function addActionButtonListeners() {
    // Remove existing listeners to prevent duplicates
    document
      .querySelectorAll(".view-btn, .edit-btn, .delete-btn")
      .forEach((btn) => {
        btn.replaceWith(btn.cloneNode(true));
      });

    // View buttons
    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = Number.parseInt(this.getAttribute("data-id"));
        const product = products.find((p) => p.id === productId);
        if (product) {
          showProductDetailsModal(product);
        } else {
          showNotification("Product not found", "error");
        }
      });
    });

    // Edit buttons
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = Number.parseInt(this.getAttribute("data-id"));
        const product = products.find((p) => p.id === productId);
        if (product) {
          showEditProductModal(product);
        } else {
          showNotification("Product not found", "error");
        }
      });
    });

    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = Number.parseInt(this.getAttribute("data-id"));
        const product = products.find((p) => p.id === productId);
        if (
          product &&
          confirm(`Are you sure you want to delete "${product.name}"?`)
        ) {
          deleteProduct(productId);
        }
      });
    });
  }

  // Delete product
  function deleteProduct(productId) {
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      const deletedProduct = products[productIndex];
      products.splice(productIndex, 1);

      // Update filtered products
      filteredProducts = filteredProducts.filter((p) => p.id !== productId);

      // Adjust current page if necessary
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
      }

      if (saveProducts()) {
        renderProductsTable();
        showNotification(
          `Product "${deletedProduct.name}" deleted successfully`
        );
      }
    }
  }

  // Show notification
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Show new product modal
  function showNewProductModal() {
    const modal = createProductModal("Add New Product");
    if (!modal) return;

    const form = modal.querySelector("#product-form");
    form.reset();

    // Set default image
    const imageInput = form.querySelector("#product-image");
    if (imageInput) {
      imageInput.value =
        "https://via.placeholder.com/300x200?text=Product+Image";
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleProductSubmit(e, modal, false);
    });
  }

  // Show edit product modal
  function showEditProductModal(product) {
    const modal = createProductModal("Edit Product");
    if (!modal) return;

    const form = modal.querySelector("#product-form");

    // Populate form with product data
    form.querySelector("#product-id").value = product.id;
    form.querySelector("#product-name").value = product.name;
    form.querySelector("#product-description").value = product.description;
    form.querySelector("#product-category").value = product.category;
    form.querySelector("#product-price").value = product.price;
    form.querySelector("#product-stock").value = product.stock;
    form.querySelector("#product-image").value = product.image;
    form.querySelector("#product-status").value = product.status;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleProductSubmit(e, modal, true);
    });
  }

  // Create product modal
  function createProductModal(title) {
    const modal = document.createElement("div");
    modal.className = "modal show";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>${title}</h2>
        <form id="product-form">
          <input type="hidden" id="product-id">
          <div class="form-group">
            <label for="product-name">Product Name *</label>
            <input type="text" id="product-name" required>
          </div>
          <div class="form-group">
            <label for="product-description">Description *</label>
            <textarea id="product-description" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="product-category">Category *</label>
            <select id="product-category" required>
              <option value="">Select Category</option>
              <option value="Coffee">Coffee</option>
              <option value="Non Coffee">Non Coffee</option>
              <option value="Pastries">Pastries</option>
              <option value="Desserts">Desserts</option>
              <option value="Sandwiches">Sandwiches</option>
              <option value="Heavy Food">Heavy Food</option>
            </select>
          </div>
          <div class="form-group">
            <label for="product-price">Price (Rp) *</label>
            <input type="number" id="product-price" min="0" required>
          </div>
          <div class="form-group">
            <label for="product-stock">Stock *</label>
            <input type="number" id="product-stock" min="0" required>
          </div>
          <div class="form-group">
            <label for="product-image">Image URL</label>
            <input type="url" id="product-image">
            <small>Enter a valid image URL</small>
          </div>
          <div class="form-group">
            <label for="product-status">Status *</label>
            <select id="product-status" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn">${
              title.includes("Edit") ? "Update" : "Save"
            } Product</button>
            <button type="button" class="btn-outline cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup close handlers
    const closeBtn = modal.querySelector(".close-modal");
    const cancelBtn = modal.querySelector(".cancel-btn");

    closeBtn.addEventListener("click", () => closeModal(modal));
    cancelBtn.addEventListener("click", () => closeModal(modal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });

    return modal;
  }

  // Handle product form submission
  function handleProductSubmit(event, modal, isEdit) {
    event.preventDefault();

    const form = event.target;
    const formData = {
      id: isEdit
        ? Number.parseInt(form.querySelector("#product-id").value)
        : null,
      name: form.querySelector("#product-name").value.trim(),
      description: form.querySelector("#product-description").value.trim(),
      category: form.querySelector("#product-category").value,
      price: Number.parseInt(form.querySelector("#product-price").value),
      stock: Number.parseInt(form.querySelector("#product-stock").value),
      image:
        form.querySelector("#product-image").value.trim() ||
        "https://via.placeholder.com/300x200?text=Product+Image",
      status: form.querySelector("#product-status").value,
    };

    // Validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      isNaN(formData.price) ||
      isNaN(formData.stock) ||
      !formData.status
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (formData.price < 0 || formData.stock < 0) {
      showNotification("Price and stock must be non-negative", "error");
      return;
    }

    try {
      if (isEdit) {
        // Update existing product
        const productIndex = products.findIndex((p) => p.id === formData.id);
        if (productIndex !== -1) {
          products[productIndex] = { ...formData };

          // Update filtered products
          const filteredIndex = filteredProducts.findIndex(
            (p) => p.id === formData.id
          );
          if (filteredIndex !== -1) {
            filteredProducts[filteredIndex] = { ...formData };
          }

          if (saveProducts()) {
            renderProductsTable();
            closeModal(modal);
            showNotification(`Product "${formData.name}" updated successfully`);
          }
        }
      } else {
        // Add new product
        const newId =
          products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
        const newProduct = { ...formData, id: newId };

        products.push(newProduct);
        filteredProducts.push(newProduct);

        if (saveProducts()) {
          renderProductsTable();
          closeModal(modal);
          showNotification(`Product "${formData.name}" added successfully`);
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification("Error saving product: " + error.message, "error");
    }
  }

  // Show product details modal
  function showProductDetailsModal(product) {
    const modal = document.createElement("div");
    modal.className = "modal show";

    const stockStatus =
      product.stock > 10
        ? "In Stock"
        : product.stock > 0
        ? "Low Stock"
        : "Out of Stock";
    const statusClass =
      product.status === "active" ? "status-active" : "status-inactive";

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="product-details">
          <div class="product-details-image">
            <img src="${product.image}" alt="${
      product.name
    }" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          </div>
          <div class="product-details-info">
            <h2>${product.name}</h2>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
              <div class="meta-item">
                <span class="meta-label">Category:</span>
                <span class="meta-value">${product.category}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Price:</span>
                <span class="meta-value">Rp ${product.price.toLocaleString(
                  "id-ID"
                )}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Stock:</span>
                <span class="meta-value">${
                  product.stock
                } units (${stockStatus})</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Status:</span>
                <span class="meta-value ${statusClass}">${
      product.status === "active" ? "Active" : "Inactive"
    }</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn edit-product-btn">Edit Product</button>
          <button class="btn-outline close-details-btn">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup event listeners
    const closeBtn = modal.querySelector(".close-modal");
    const closeDetailsBtn = modal.querySelector(".close-details-btn");
    const editBtn = modal.querySelector(".edit-product-btn");

    closeBtn.addEventListener("click", () => closeModal(modal));
    closeDetailsBtn.addEventListener("click", () => closeModal(modal));
    editBtn.addEventListener("click", () => {
      closeModal(modal);
      showEditProductModal(product);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }

  // Close modal
  function closeModal(modal) {
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
  }

  // Filter products by category
  function filterProductsByCategory(category) {
    if (category === "all" || !category) {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(
        (product) => product.category === category
      );
    }
    currentPage = 1;
    renderProductsTable();
  }

  // Search products
  function searchProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    if (!term) {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }
    currentPage = 1;
    renderProductsTable();
  }

  // Setup category filter
  const categoryFilter = document.querySelector(".filter-select");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", function () {
      filterProductsByCategory(this.value);
    });
  }

  // Setup search
  const searchInput = document.querySelector(".search-box input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchProducts(this.value);
    });
  }

  // Setup new product button
  function setupNewProductButton() {
    // Remove duplicate buttons first
    const existingButtons = document.querySelectorAll(".header-actions .btn");
    if (existingButtons.length > 1) {
      for (let i = 1; i < existingButtons.length; i++) {
        existingButtons[i].remove();
      }
    }

    const newProductBtn = document.querySelector(".header-actions .btn");
    if (newProductBtn) {
      newProductBtn.replaceWith(newProductBtn.cloneNode(true));
      const btn = document.querySelector(".header-actions .btn");
      btn.addEventListener("click", showNewProductModal);
    }
  }

  // Add CSS styles
  const style = document.createElement("style");
  style.textContent = `
    .modal {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    
    .modal.show {
      opacity: 1;
      visibility: visible;
    }
    
    .modal-content {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .close-modal {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .form-group small {
      display: block;
      margin-top: 5px;
      color: #666;
      font-size: 12px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .product-details {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .product-details-image {
      flex: 0 0 200px;
    }
    
    .product-details-image img {
      width: 100%;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .product-details-info {
      flex: 1;
    }
    
    .product-meta {
      margin-top: 20px;
    }
    
    .meta-item {
      margin-bottom: 10px;
    }
    
    .meta-label {
      font-weight: 500;
      margin-right: 5px;
    }
    
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 1001;
      opacity: 0;
      transform: translateX(50px);
      transition: opacity 0.3s, transform 0.3s;
    }
    
    .notification.success {
      background-color: #4a3520;
      color: white;
    }
    
    .notification.error {
      background-color: #e74c3c;
      color: white;
    }
    
    .notification.show {
      opacity: 1;
      transform: translateX(0);
    }
    
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding: 10px 0;
      border-top: 1px solid #eee;
    }
    
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .pagination-btn {
      padding: 5px 10px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .pagination-btn:hover:not(:disabled) {
      background-color: #e9e9e9;
    }
    
    .pagination-btn.active {
      background-color: #4a3520;
      color: white;
      border-color: #4a3520;
    }
    
    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .pagination-pages {
      display: flex;
      gap: 5px;
    }
    
    .action-btn {
      margin: 0 2px;
      padding: 5px 8px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .action-btn:hover {
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .product-details {
        flex-direction: column;
      }
      
      .product-details-image {
        flex: 0 0 auto;
        max-width: 100%;
      }
      
      .pagination-container {
        flex-direction: column;
        gap: 10px;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialize
  initializeProducts();
  renderProductsTable();
  setupNewProductButton();
});
