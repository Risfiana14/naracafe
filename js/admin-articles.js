document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const sidebar = document.querySelector(".sidebar");

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (
        sidebar.classList.contains("active") &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".mobile-toggle")
      ) {
        sidebar.classList.remove("active");
      }
    });
  }

  // DOM Elements
  const articlesTableBody = document.getElementById("articles-table-body");
  const newArticleBtn = document.getElementById("new-article-btn");
  const articleModal = document.getElementById("article-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const articleForm = document.getElementById("article-form");
  const cancelArticleBtn = document.getElementById("cancel-article");
  const modalTitle = document.getElementById("modal-title");
  const deleteModal = document.getElementById("delete-modal");
  const closeDeleteModalBtn = document.getElementById("close-delete-modal");
  const cancelDeleteBtn = document.getElementById("cancel-delete");
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const searchInput = document.getElementById("search-articles");
  const categoryFilter = document.getElementById("category-filter");

  // Variables
  let articles = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let articleToDelete = null;
  let filteredArticles = [];

  // Initialize
  loadArticles();

  // Event Listeners
  newArticleBtn.addEventListener("click", openNewArticleModal);
  closeModalBtn.addEventListener("click", closeArticleModal);
  cancelArticleBtn.addEventListener("click", closeArticleModal);
  articleForm.addEventListener("submit", saveArticle);
  closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);
  confirmDeleteBtn.addEventListener("click", deleteArticle);
  searchInput.addEventListener("input", filterArticles);
  categoryFilter.addEventListener("change", filterArticles);

  // Functions
  function loadArticles() {
    // Try to load articles from localStorage
    const savedArticles = localStorage.getItem("articles");

    if (savedArticles) {
      articles = JSON.parse(savedArticles);
    } else {
      // Default articles if none exist
      articles = [
        {
          id: 1,
          title: "Seni Memanggang Kopi",
          category: "Teknik Penyeduhan",
          author: "James Wilson",
          date: "May 15, 2023",
          image:
            "https://i.pinimg.com/736x/6a/98/41/6a9841a5c2768b5c638a0777e7789f38.jpg",
          intro:
            "Setiap tegukan kopi yang kita nikmati menyimpan perjalanan panjang yang dimulai jauh sebelum diseduh. Salah satu tahap paling menentukan dalam perjalanan itu adalah proses sangrai—sebuah momen penting di mana biji kopi mentah diubah menjadi sumber aroma dan rasa yang memikat.",
          content: `
                        <h2>Seni dan Ilmu di Balik Proses Sangrai Kopi </h2> 
                        <p>Dalam dunia kopi, proses sangrai atau coffee roasting adalah tahapan krusial yang menentukan cita rasa akhir dari secangkir kopi. Di sinilah ilmu pengetahuan bertemu dengan kepekaan seni. Sangrai bukan sekadar memanggang biji kopi mentah hingga berwarna cokelat—ia adalah transformasi kompleks yang membangkitkan aroma, rasa, serta karakter sejati dari setiap biji kopi.</p>
                        <div class="article-image-container">
                            <img src="https://i.pinimg.com/736x/29/43/a0/2943a061842d3f291583db75eed0d8f6.jpg" alt="Biji Kopi">
                        </div>
                        <h2>Tingkat Sangrai dan Karakteristiknya</h2>
                        <p>Tingkat sangrai biji kopi merupakan salah satu faktor terpenting yang menentukan rasa kopi dalam cangkir. Sebelum disangrai, biji kopi hijau lembut, beraroma segar seperti rumput dan sedikit atau tidak berasa. Proses sangrai kopi mengubah biji kopi mentah ini menjadi biji kopi yang beraroma, beraroma, dan renyah yang kita kenal sebagai kopi.</p>
                        <h3>1. Sangrai Ringan</h3>
                        <p>Kopi dengan sangrai ringan berwarna cokelat muda, memiliki body (tekstur) yang ringan, dan tidak memiliki minyak di permukaan bijinya. Rasanya cenderung seperti biji-bijian yang dipanggang ringan dan memiliki tingkat keasaman yang tinggi. Cita rasa asli dari biji kopi tetap terjaga lebih baik dibandingkan dengan kopi sangrai yang lebih gelap. Selain itu, sangrai ringan juga mempertahankan sebagian besar kandungan kafein dari biji kopi.</p>
                        <h3>2. Sangrai Sedang</h3>
                        <p>Kopi sangrai sedang berwarna cokelat sedang dan memiliki body yang lebih penuh dibandingkan sangrai ringan. Seperti sangrai ringan, biji kopi ini juga tidak memiliki minyak di permukaannya. Namun, kopi sangrai sedang tidak memiliki rasa biji mentah seperti sangrai ringan, melainkan menawarkan rasa yang lebih seimbang antara kekayaan aroma, rasa, dan tingkat keasaman. Kandungan kafeinnya sedikit berkurang, namun tetap lebih tinggi daripada sangrai gelap.</p>
                        <h3>3. Sangrai Gelap</h3>
                        <p>Kopi sangrai gelap berwarna cokelat tua seperti cokelat hitam, bahkan terkadang mendekati hitam. Permukaan bijinya terlihat mengkilap karena lapisan minyak yang keluar akibat proses sangrai. Minyak ini biasanya terlihat di permukaan saat kopi diseduh. Cita rasa asli dari biji kopi hampir tidak terasa, karena digantikan oleh rasa yang berasal dari proses pemanggangan itu sendiri. Rasanya cenderung pahit, berasap, atau bahkan agak gosong. Kandungan kafeinnya jauh lebih rendah dibandingkan jenis sangrai lainnya.</p>
                    `,
          tags: "Coffee Roasting, Brewing Techniques, Coffee Beans, Flavor Profiles",
          status: "published",
        },
        {
          id: 2,
          title: "Mengeksplorasi Seni Latte dengan Terampil",
          category: "Budaya Kopi",
          author: "Emma Rodriguez",
          date: "June 2, 2023",
          image:
            "https://i.pinimg.com/736x/d2/93/e8/d293e845a15e6042e791ca84b52abf71.jpg",
          intro:
            "Latte Art adalah bentuk ekspresi kreatif yang mengubah secangkir kopi biasa menjadi karya seni visual. Pelajari teknik-teknik yang digunakan barista kami untuk menciptakan desain indah di minuman favorit Anda.",
          content: `
                        <h2>Seni Susu dan Espresso</h2>
                        <p>Latte art adalah praktik kreatif menuangkan susu yang dikukus ke dalam secangkir espresso untuk menciptakan pola atau desain yang menarik secara visual di permukaan latte. Ini adalah keterampilan yang membutuhkan presisi, latihan, dan kesabaran, tetapi hasilnya dapat mengubah pengalaman kopi biasa menjadi sesuatu yang luar biasa.</p>
                        <div class="article-image-container">
                            <img src="https://images.unsplash.com/photo-1534415378365-1e4048bf6c67?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" alt="Latte Art">
                            <p class="image-caption">Pola rosetta yang sempurna</p>
                        </div>
                    `,
          tags: "Latte Art, Coffee Culture, Barista Skills",
          status: "published",
        },
        {
          id: 3,
          title: "Panduan Asal Biji Kopi",
          category: "Biji Kopi",
          author: "Michael Chang",
          date: "June 18, 2023",
          image:
            "https://i.pinimg.com/736x/30/fc/2c/30fc2c6ecfedccb85003391dde9a09da.jpg",
          intro:
            "Perjalanan kopi dimulai jauh sebelum sampai ke cangkirmu. Temukan bagaimana geografi, iklim, dan metode budidaya menciptakan cita rasa unik dari biji kopi yang berasal dari berbagai wilayah di dunia.",
          content: `
                        <h2>Geografi Rasa</h2>
                        <p>Kopi ditanam di wilayah yang dikenal sebagai "Sabuk Kopi," area di antara Tropis Cancer dan Capricorn. Di wilayah ini, faktor-faktor seperti ketinggian, komposisi tanah, pola curah hujan, dan variasi suhu semuanya berkontribusi pada karakteristik khas biji kopi dari berbagai daerah asal.</p>
                    `,
          tags: "Coffee Beans, Origin, Geography, Flavor",
          status: "published",
        },
        {
          id: 4,
          title: "5 Resep Cold Brew Menyegarkan untuk Musim Panas",
          category: "Resep",
          author: "Sophia Martinez",
          date: "July 5, 2023",
          image:
            "https://i.pinimg.com/736x/a9/ec/14/a9ec1401366d97db24c1db2a10f1ad37.jpg",
          intro:
            "Saat suhu meningkat, tidak ada yang lebih menyegarkan daripada minuman kopi dingin yang sempurna. Temukan resep cold brew favorit kami yang akan membuat Anda tetap segar dan berenergi sepanjang musim panas.",
          content: `
                        <h2>Keajaiban Cold Brew</h2>
                        <p>Cold brew coffee bukanlah sekadar kopi biasa yang dituangkan di atas es—ini adalah metode penyeduhan yang sama sekali berbeda yang menciptakan konsentrat kopi yang halus, kurang asam, dan sempurna untuk penyegaran di musim panas. Proses ekstraksi lambat (biasanya 12-24 jam) pada suhu ruangan atau lebih dingin menghasilkan senyawa rasa yang berbeda dari metode penyeduhan panas.</p>
                    `,
          tags: "Cold Brew, Recipes, Summer, Refreshing",
          status: "draft",
        },
        {
          id: 5,
          title: "Metode Tuang Kopi yang Sempurna",
          category: "Teknik Penyeduhan",
          author: "David Wilson",
          date: "July 22, 2023",
          image:
            "https://i.pinimg.com/736x/85/10/48/8510487a03682259794cade516c05c17.jpg",
          intro:
            "Rasakan kenikmatan secangkir kopi yang diseduh dengan presisi. Metode pour-over memungkinkan kamu mengontrol setiap elemen penyeduhan—mulai dari suhu air, teknik menuang, hingga waktu ekstraksi—untuk menghasilkan rasa kopi yang bersih, seimbang, dan aromatik.",
          content: `
                        <h2>Revolusi Pour-Over</h2>
                        <p>Penyeduhan pour-over telah mendapatkan popularitas luar biasa di kalangan penggemar kopi dengan alasan yang bagus. Metode penyeduhan manual ini memberi Anda kendali penuh atas ekstraksi, memungkinkan Anda menyoroti karakteristik unik dari biji kopi khusus. Hasilnya adalah secangkir yang bersih dan penuh rasa yang mengungkapkan catatan halus yang sering hilang dalam metode penyeduhan lainnya.</p>
                    `,
          tags: "Pour Over, Brewing Techniques, Manual Brewing",
          status: "published",
        },
        {
          id: 6,
          title: "Evolusi Budaya Kedai Kopi",
          category: "Budaya Kopi",
          author: "Olivia Thompson",
          date: "August 10, 2023",
          image:
            "https://i.pinimg.com/736x/bf/32/91/bf3291e150a2725bd00847aac074667f.jpg",
          intro:
            "Kedai kopi telah menjadi pusat percakapan, kreativitas, dan komunitas selama berabad-abad. Telusuri bagaimana tempat-tempat yang dicintai ini berkembang dan membentuk masyarakat sepanjang sejarah.",
          content: `
                        <h2>Dari Kedai Kopi Kuno hingga Kafe Modern</h2>
                        <p>Kisah kedai kopi dimulai pada abad ke-15 di Kekaisaran Ottoman dan Timur Tengah. Tempat-tempat awal ini dengan cepat menjadi pusat sosial penting di mana orang berkumpul untuk mendiskusikan politik, bisnis, dan seni sambil menikmati minuman stimulan yang baru. Pada abad ke-17, kedai kopi telah menyebar ke Eropa, di mana mereka mendapat julukan "universitas penny" karena dengan harga secangkir kopi, pengunjung dapat terlibat dalam percakapan intelektual dan mengakses berita dan ide-ide terbaru.</p>
                    `,
          tags: "Coffee Culture, History, Social Spaces",
          status: "published",
        },
      ];

      // Save default articles to localStorage
      localStorage.setItem("articles", JSON.stringify(articles));
    }

    filteredArticles = [...articles];
    renderArticles();
    renderPagination();
  }

  function renderArticles() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentArticles = filteredArticles.slice(startIndex, endIndex);

    articlesTableBody.innerHTML = "";

    if (currentArticles.length === 0) {
      articlesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No articles found</td>
                </tr>
            `;
      return;
    }

    currentArticles.forEach((article) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>
                    <div class="article-info">
                        <img src="${article.image}" alt="${article.title}">
                        <div>
                            <h4>${article.title}</h4>
                            <p>${article.intro.substring(0, 80)}...</p>
                        </div>
                    </div>
                </td>
                <td>${article.category}</td>
                <td>${article.author}</td>
                <td>${article.date}</td>
                <td><span class="status-${article.status}">${article.status === "published" ? "Published" : "Draft"
        }</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${article.id
        }"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${article.id
        }"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete delete-btn" data-id="${article.id
        }"><i class="fas fa-trash"></i></button>
                </td>
            `;

      articlesTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const articleId = btn.getAttribute("data-id");
        window.open(`article-detail.html?id=${articleId}`, "_blank");
      });
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const articleId = Number.parseInt(btn.getAttribute("data-id"));
        openEditArticleModal(articleId);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const articleId = Number.parseInt(btn.getAttribute("data-id"));
        openDeleteModal(articleId);
      });
    });

    // Update showing entries text
    const showingEntries = document.getElementById("showing-entries");
    if (filteredArticles.length === 0) {
      showingEntries.textContent = "No entries to show";
    } else {
      const start = startIndex + 1;
      const end = Math.min(endIndex, filteredArticles.length);
      showingEntries.textContent = `Showing ${start} to ${end} of ${filteredArticles.length} entries`;
    }
  }

  function renderPagination() {
    const paginationContainer = document.getElementById("table-pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    if (totalPages <= 1) {
      return;
    }

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderArticles();
        renderPagination();
      }
    });
    paginationContainer.appendChild(prevBtn);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener("click", () => {
        currentPage = i;
        renderArticles();
        renderPagination();
      });
      paginationContainer.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderArticles();
        renderPagination();
      }
    });
    paginationContainer.appendChild(nextBtn);
  }

  function openNewArticleModal() {
    modalTitle.textContent = "Add New Article";
    articleForm.reset();
    document.getElementById("article-id").value = "";

    // Set current date as default
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = today.toLocaleDateString("en-US", options);

    // Open modal
    articleModal.style.display = "block";
  }

  function openEditArticleModal(articleId) {
    const article = articles.find((a) => a.id === articleId);

    if (!article) return;

    modalTitle.textContent = "Edit Article";

    // Fill form with article data
    document.getElementById("article-id").value = article.id;
    document.getElementById("article-title").value = article.title;
    document.getElementById("article-category").value = article.category;
    document.getElementById("article-author").value = article.author;
    document.getElementById("article-image").value = article.image;
    document.getElementById("article-intro").value = article.intro;
    document.getElementById("article-content").value = article.content;
    document.getElementById("article-tags").value = article.tags;
    document.getElementById("article-status").value = article.status;

    // Open modal
    articleModal.style.display = "block";
  }

  function closeArticleModal() {
    articleModal.style.display = "none";
  }

  function saveArticle(e) {
    e.preventDefault();

    const articleId = document.getElementById("article-id").value;
    const title = document.getElementById("article-title").value;
    const category = document.getElementById("article-category").value;
    const author = document.getElementById("article-author").value;
    const image = document.getElementById("article-image").value;
    const intro = document.getElementById("article-intro").value;
    const content = document.getElementById("article-content").value;
    const tags = document.getElementById("article-tags").value;
    const status = document.getElementById("article-status").value;

    // Get current date if it's a new article
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = today.toLocaleDateString("en-US", options);

    if (articleId) {
      // Update existing article
      const index = articles.findIndex(
        (a) => a.id === Number.parseInt(articleId)
      );

      if (index !== -1) {
        articles[index] = {
          ...articles[index],
          title,
          category,
          author,
          image,
          intro,
          content,
          tags,
          status,
        };
      }
    } else {
      // Add new article
      const newId =
        articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;

      articles.push({
        id: newId,
        title,
        category,
        author,
        date: formattedDate,
        image,
        intro,
        content,
        tags,
        status,
      });
    }

    // Save to localStorage
    localStorage.setItem("articles", JSON.stringify(articles));

    // Refresh the table
    filteredArticles = [...articles];
    renderArticles();
    renderPagination();

    // Close modal
    closeArticleModal();

    // Show success message
    alert(
      articleId
        ? "Article updated successfully!"
        : "Article added successfully!"
    );
  }

  function openDeleteModal(articleId) {
    articleToDelete = articleId;
    deleteModal.style.display = "block";
  }

  function closeDeleteModal() {
    deleteModal.style.display = "none";
    articleToDelete = null;
  }

  function deleteArticle() {
    if (articleToDelete === null) return;

    // Remove article from array
    articles = articles.filter((a) => a.id !== articleToDelete);

    // Save to localStorage
    localStorage.setItem("articles", JSON.stringify(articles));

    // Refresh the table
    filteredArticles = [...articles];
    renderArticles();
    renderPagination();

    // Close modal
    closeDeleteModal();

    // Show success message
    alert("Article deleted successfully!");
  }

  function filterArticles() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;

    filteredArticles = articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm) ||
        article.intro.toLowerCase().includes(searchTerm) ||
        article.author.toLowerCase().includes(searchTerm);

      const matchesCategory =
        categoryValue === "all" || article.category === categoryValue;

      return matchesSearch && matchesCategory;
    });

    currentPage = 1;
    renderArticles();
    renderPagination();
  }
});
