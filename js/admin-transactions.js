document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector(".admin-table tbody");
  const statusFilter = document.querySelector(".filter-select");
  const searchInput = document.querySelector(".search-box input");
  const exportBtn = document.querySelector(".btn");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let filtered = [...transactions];

  function renderTransactions(data) {
    tableBody.innerHTML = "";

    if (data.length === 0) {
      tableBody.innerHTML =
        "<tr><td colspan='7'>No transactions found.</td></tr>";
      return;
    }

    data.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${order.id}</td>
          <td>
            <div class="user-info-row no-image">
              <div>
                <h4>${order.name}</h4>
                <p>${order.email}</p>
              </div>
            </div>
          </td>
          <td>${order.date}</td>
          <td>Rp ${order.total.toLocaleString("id-ID")}</td>
          <td>${order.method}</td>
          <td><span class="status-${order.status.toLowerCase()}" data-id="${
        order.id
      }">${capitalize(order.status)}</span></td>
          <td>
            <button class="action-btn view-btn" data-id="${
              order.id
            }"><i class="fas fa-eye"></i></button>
            <button class="action-btn edit-btn" data-id="${
              order.id
            }"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" data-id="${
              order.id
            }"><i class="fas fa-trash"></i></button>
          </td>
        `;
      tableBody.appendChild(row);
    });

    attachActionListeners();
  }

  function attachActionListeners() {
    // View
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const t = transactions.find((tx) => tx.id === id);
        if (!t) return;
        alert(
          `Order ID: ${t.id}\nName: ${t.name}\nEmail: ${
            t.email
          }\nAmount: Rp ${t.total.toLocaleString("id-ID")}\nDate: ${
            t.date
          }\nMethod: ${t.method}\nStatus: ${t.status}`
        );
      });
    });

    // Edit
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const idx = transactions.findIndex((tx) => tx.id === id);
        if (idx === -1) return;
        const t = transactions[idx];

        const newName = prompt("Edit name:", t.name);
        const newEmail = prompt("Edit email:", t.email);
        const newDate = prompt("Edit date:", t.date);
        const newTotal = prompt("Edit total amount:", t.total);
        const newMethod = prompt("Edit payment method:", t.method);
        const newStatus = prompt(
          "Edit status (processing/completed/cancelled):",
          t.status
        );

        if (
          newName &&
          newEmail &&
          newDate &&
          newTotal &&
          newMethod &&
          ["processing", "completed", "cancelled"].includes(
            newStatus.toLowerCase()
          )
        ) {
          transactions[idx] = {
            ...t,
            name: newName,
            email: newEmail,
            date: newDate,
            total: parseFloat(newTotal),
            method: newMethod,
            status: newStatus.toLowerCase(),
          };
          localStorage.setItem("transactions", JSON.stringify(transactions));
          applyFilters();
        } else {
          alert(
            "Invalid input. Please ensure all fields are filled and status is valid."
          );
        }
      });
    });

    // Delete
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const idx = transactions.findIndex((tx) => tx.id === id);
        if (idx === -1) return;
        if (confirm("Are you sure you want to delete this transaction?")) {
          transactions.splice(idx, 1);
          localStorage.setItem("transactions", JSON.stringify(transactions));
          applyFilters();
        }
      });
    });

    // Status click to update
    document.querySelectorAll("td span[class^='status-']").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        const idx = transactions.findIndex((tx) => tx.id === id);
        if (idx === -1) return;
        const t = transactions[idx];
        const newStatus = prompt(
          "Update status (processing/completed/cancelled):",
          t.status
        );
        if (
          ["processing", "completed", "cancelled"].includes(
            newStatus.toLowerCase()
          )
        ) {
          transactions[idx].status = newStatus.toLowerCase();
          localStorage.setItem("transactions", JSON.stringify(transactions));
          applyFilters();
        } else {
          alert("Invalid status.");
        }
      });
    });
  }

  function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    filtered = transactions.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchText) ||
        t.email.toLowerCase().includes(searchText) ||
        t.id.toLowerCase().includes(searchText);

      const matchStatus =
        selectedStatus === "all" || t.status.toLowerCase() === selectedStatus;

      return matchSearch && matchStatus;
    });

    renderTransactions(filtered);
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function exportToCSV(data) {
    if (data.length === 0) {
      alert("Tidak ada data transaksi untuk diekspor.");
      return;
    }

    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Date",
      "Amount",
      "Payment Method",
      "Status",
    ];

    const rows = data.map((t) => [
      t.id,
      t.name,
      t.email,
      t.date,
      `Rp ${t.total.toLocaleString("id-ID")}`,
      t.method,
      capitalize(t.status),
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  exportBtn?.addEventListener("click", () => exportToCSV(transactions));

  renderTransactions(transactions);
});
