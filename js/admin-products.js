document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin products script loaded at", new Date().toISOString());

  let products = [];

  function loadProducts() {
    console.log("Attempting to load products from localStorage");
    try {
      const storedProducts = localStorage.getItem("adminProducts");
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          products = parsedProducts;
          console.log("Loaded products:", products.length, "items");
        } else {
          console.log("Empty or invalid products array, initializing defaults");
          initializeDefaultProducts();
        }
      } else {
        console.log("No products in localStorage, initializing defaults");
        initializeDefaultProducts();
      }
    } catch (e) {
      console.error("Error loading products:", e);
      showNotification("Failed to load products: " + e.message, "error");
      initializeDefaultProducts();
    }
  }

  function initializeDefaultProducts() {
    console.log("Initializing default products");
    products = [
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
        name: "Caramel Latte",
        description: "Espresso lembut dengan susu dan sirup karamel.",
        category: "Coffee",
        price: 37000,
        stock: 80,
        status: "active",
        image:
          "https://i.pinimg.com/736x/bd/de/a0/bddea0e4dbe2f7a9cffa8cab5194cb74.jpg",
      },
    ];
    saveProducts();
  }

  function saveProducts() {
    console.log("Saving products to localStorage:", products.length, "items");
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

  function renderProductsTable() {
    console.log("Rendering products table");
    const tableBody = document.querySelector(".admin-table tbody");
    if (!tableBody) {
      console.error("Table body not found");
      showNotification("Table body not found", "error");
      return;
    }

    tableBody.innerHTML = "";
    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="no-products">No products available</td></tr>`;
      return;
    }

    products.forEach((product) => {
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
            <img src="${product.image}" alt="${product.name
        }" onerror="this.src='https://via.placeholder.com/60';">
            <div>
              <h4>${product.name}</h4>
              <p>${product.description}</p>
            </div>
          </div>
        </td>
        <td>${product.category}</td>
        <td>Rp ${product.price.toLocaleString("id-ID")}</td>
        <td>${stockStatus} (${product.stock})</td>
        <td><span class="${statusClass}">${product.status === "active" ? "Active" : "Inactive"
        }</span></td>
        <td>
          <button class="action-btn view-btn" data-id="${product.id
        }"><i class="fas fa-eye"></i></button>
          <button class="action-btn edit-btn" data-id="${product.id
        }"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete-btn" data-id="${product.id
        }"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    addActionButtonListeners();
  }

  function addActionButtonListeners() {
    console.log("Adding action button listeners");
    document
      .querySelectorAll(".view-btn, .edit-btn, .delete-btn")
      .forEach((btn) => {
        btn.replaceWith(btn.cloneNode(true));
      });

    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.getAttribute("data-id"));
        console.log("View button clicked for product ID:", productId);
        const product = products.find((p) => p.id === productId);
        if (product) showProductDetailsModal(product);
        else showNotification("Product not found", "error");
      });
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.getAttribute("data-id"));
        console.log("Edit button clicked for product ID:", productId);
        const product = products.find((p) => p.id === productId);
        if (product) showEditProductModal(product);
        else showNotification("Product not found", "error");
      });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.getAttribute("data-id"));
        const product = products.find((p) => p.id === productId);
        console.log("Delete button clicked for product ID:", productId);
        if (
          product &&
          confirm(`Delete "${product.name}" (ID: ${productId})?`)
        ) {
          deleteProduct(productId);
        }
      });
    });
  }

  function deleteProduct(productId) {
    console.log("Deleting product ID:", productId);
    const product = products.find((p) => p.id === productId);
    if (!product) {
      showNotification("Product not found", "error");
      return;
    }
    products = products.filter((p) => p.id !== productId);
    if (saveProducts()) {
      renderProductsTable();
      showNotification(`Product "${product.name}" deleted`);
    }
  }

  function showNotification(message, type = "success") {
    console.log("Showing notification:", message, "Type:", type);
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

  function createModalFromTemplate(templateId) {
    console.log("Creating modal from template:", templateId);
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Template ${templateId} not found`);
      showNotification(`Template ${templateId} not found`, "error");
      return null;
    }

    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = template.innerHTML;
    const modal = modalContainer.querySelector(".modal");
    if (!modal) {
      console.error("Modal element not found in template");
      showNotification("Invalid modal template", "error");
      return null;
    }

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("show"), 10);
    return modal;
  }

  function showNewProductModal() {
    console.log("Attempting to show new product modal");
    const modalTemplate = document.getElementById("product-modal-template");
    if (!modalTemplate) {
      console.error("Product modal template not found");
      showNotification("Product modal template not found", "error");
      return;
    }

    const modal = createModalFromTemplate("product-modal-template");
    if (!modal) {
      console.error("Failed to create new product modal");
      return;
    }

    const title = modal.querySelector("#modal-title");
    if (title) {
      title.textContent = "Add New Product";
      console.log("Modal title set to Add New Product");
    } else {
      console.error("Modal title not found");
      showNotification("Modal title not found", "error");
    }

    const form = modal.querySelector("#product-form");
    if (!form) {
      console.error("Product form not found");
      showNotification("Product form not found", "error");
      closeModal(modal);
      return;
    }
    console.log("Resetting form");
    form.reset();
    const productIdInput = form.querySelector("#product-id");
    if (productIdInput) {
      productIdInput.value = "";
    } else {
      console.warn("Product ID input not found");
    }

    setupModalCloseHandlers(modal);
    form.onsubmit = (event) => {
      console.log("Form submit event triggered");
      handleNewProductSubmit(event, modal);
    };
  }

  function handleNewProductSubmit(event, modal) {
    event.preventDefault();
    console.log("New product form submitted");

    try {
      const form = event.target;
      const name = form.querySelector("#product-name")?.value?.trim();
      const description = form
        .querySelector("#product-description")
        ?.value?.trim();
      const category = form.querySelector("#product-category")?.value;
      const price = Number.parseInt(
        form.querySelector("#product-price")?.value
      );
      const stock = Number.parseInt(
        form.querySelector("#product-stock")?.value
      );
      let image = form.querySelector("#product-image")?.value?.trim();
      const status = form.querySelector("#product-status")?.value;

      console.log("Form input values:", {
        name,
        description,
        category,
        price,
        stock,
        image,
        status,
      });

      if (
        !name ||
        !description ||
        !category ||
        isNaN(price) ||
        isNaN(stock) ||
        !status
      ) {
        showNotification("Please fill all required fields", "error");
        console.error("Form validation failed: Missing required fields", {
          name,
          description,
          category,
          price,
          stock,
          status,
        });
        return;
      }

      if (price < 0 || stock < 0) {
        showNotification("Price and stock must be non-negative", "error");
        console.error("Form validation failed: Negative price or stock", {
          price,
          stock,
        });
        return;
      }

      if (
        image &&
        !image.startsWith("http://") &&
        !image.startsWith("https://")
      ) {
        image = "https://" + image;
        console.log("Added https:// to image URL:", image);
      }

      if (image) {
        try {
          new URL(image);
          console.log("Image URL is valid:", image);
        } catch {
          image = "https://via.placeholder.com/150";
          console.warn("Invalid image URL, using default:", image);
        }
      } else {
        image = "https://via.placeholder.com/150";
        console.log("No image provided, using default:", image);
      }

      const newProduct = {
        id:
          products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        name,
        description,
        category,
        price,
        stock,
        status,
        image,
      };

      console.log("Adding new product:", newProduct);
      products.push(newProduct);

      if (saveProducts()) {
        renderProductsTable();
        closeModal(modal);
        showNotification(`Product "${newProduct.name}" added`);
      } else {
        console.error("Failed to save new product");
      }
    } catch (e) {
      console.error("Error adding product:", e);
      showNotification("Error adding product: " + e.message, "error");
    }
  }

  function showEditProductModal(product) {
    console.log("Showing edit product modal for ID:", product.id);
    const modal = createModalFromTemplate("product-modal-template");
    if (!modal) return;

    const title = modal.querySelector("#modal-title");
    if (title) title.textContent = "Edit Product";
    else console.error("Modal title not found");

    const form = modal.querySelector("#product-form");
    if (!form) {
      console.error("Product form not found");
      showNotification("Product form not found", "error");
      closeModal(modal);
      return;
    }

    form.querySelector("#product-id").value = product.id;
    form.querySelector("#product-name").value = product.name;
    form.querySelector("#product-description").value = product.description;
    form.querySelector("#product-category").value = product.category;
    form.querySelector("#product-price").value = product.price;
    form.querySelector("#product-stock").value = product.stock;
    form.querySelector("#product-image").value = product.image;
    form.querySelector("#product-status").value = product.status;

    setupModalCloseHandlers(modal);
    form.onsubmit = handleEditProductSubmit;
  }

  function handleEditProductSubmit(event) {
    event.preventDefault();
    console.log("Edit product form submitted");

    try {
      const form = event.target;
      const id = Number.parseInt(form.querySelector("#product-id")?.value);
      const name = form.querySelector("#product-name")?.value?.trim();
      const description = form
        .querySelector("#product-description")
        ?.value?.trim();
      const category = form.querySelector("#product-category")?.value;
      const price = Number.parseInt(
        form.querySelector("#product-price")?.value
      );
      const stock = Number.parseInt(
        form.querySelector("#product-stock")?.value
      );
      let image = form.querySelector("#product-image")?.value?.trim();
      const status = form.querySelector("#product-status")?.value;

      if (
        !name ||
        !description ||
        !category ||
        isNaN(price) ||
        isNaN(stock) ||
        !status
      ) {
        showNotification("Please fill all required fields", "error");
        console.error("Form validation failed:", {
          name,
          description,
          category,
          price,
          stock,
          image,
          status,
        });
        return;
      }

      if (price < 0 || stock < 0) {
        showNotification("Price and stock must be non-negative", "error");
        return;
      }

      if (
        image &&
        !image.startsWith("http://") &&
        !image.startsWith("https://")
      ) {
        image = "https://" + image;
      }

      if (image) {
        try {
          new URL(image);
        } catch {
          image = "https://via.placeholder.com/150";
        }
      } else {
        image = "https://via.placeholder.com/150";
      }

      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        showNotification("Product not found", "error");
        return;
      }

      products[productIndex] = {
        id,
        name,
        description,
        category,
        price,
        stock,
        status,
        image,
      };
      console.log("Updated product:", products[productIndex]);

      if (saveProducts()) {
        renderProductsTable();
        closeModal(document.getElementById("product-modal"));
        showNotification(`Product "${name}" updated`);
      }
    } catch (e) {
      console.error("Error updating product:", e);
      showNotification("Error updating product: " + e.message, "error");
    }
  }

  function showProductDetailsModal(product) {
    console.log("Showing product details for ID:", product.id);
    const modal = createModalFromTemplate("product-details-template");
    if (!modal) return;

    const stockStatus =
      product.stock > 10
        ? "In Stock"
        : product.stock > 0
          ? "Low Stock"
          : "Out of Stock";
    const statusClass =
      product.status === "active" ? "status-active" : "status-inactive";

    const img = modal.querySelector("#details-image");
    if (img) {
      img.src = product.image;
      img.alt = product.name;
      img.onerror = () => (img.src = "https://via.placeholder.com/150");
    }

    const name = modal.querySelector("#details-name");
    if (name) name.textContent = product.name;

    const desc = modal.querySelector("#details-description");
    if (desc) desc.textContent = product.description;

    const cat = modal.querySelector("#details-category");
    if (cat) cat.textContent = product.category;

    const price = modal.querySelector("#details-price");
    if (price)
      price.textContent = `Rp ${product.price.toLocaleString("id-ID")}`;

    const stock = modal.querySelector("#details-stock");
    if (stock) stock.textContent = `${product.stock} units (${stockStatus})`;

    const status = modal.querySelector("#details-status");
    if (status) {
      status.textContent = product.status === "active" ? "Active" : "Inactive";
      status.className = `meta-value ${statusClass}`;
    }

    setupModalCloseHandlers(modal);
    const editBtn = modal.querySelector(".edit-product-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        closeModal(modal);
        showEditProductModal(product);
      });
    }
  }

  function setupModalCloseHandlers(modal) {
    console.log("Setting up modal close handlers");
    const closeBtn = modal.querySelector(".close-modal");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));

    const cancelBtn = modal.querySelector(".cancel-btn");
    if (cancelBtn) cancelBtn.addEventListener("click", () => closeModal(modal));

    const closeDetailsBtn = modal.querySelector(".close-details-btn");
    if (closeDetailsBtn)
      closeDetailsBtn.addEventListener("click", () => closeModal(modal));

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  }

  function closeModal(modal) {
    if (modal) {
      console.log("Closing modal");
      modal.classList.remove("show");
      setTimeout(() => modal.remove(), 300);
    }
  }

  function init() {
    console.log("Initializing admin products");
    loadProducts();
    renderProductsTable();

    const newProductBtn = document.getElementById("new-product-btn");
    if (newProductBtn) {
      console.log("New product button found");
      newProductBtn.replaceWith(newProductBtn.cloneNode(true));
      const newBtn = document.getElementById("new-product-btn");
      newBtn.addEventListener("click", () => {
        console.log("New product button clicked");
        showNewProductModal();
      });
    } else {
      console.error("New product button not found");
      showNotification("New product button not found", "error");
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("action") === "new") {
      console.log("Detected action=new, opening new product modal");
      showNewProductModal();
    }
  }

  init();
});
