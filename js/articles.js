document.addEventListener("DOMContentLoaded", () => {
  // Load articles from localStorage
  const loadArticlesFromStorage = () => {
    const savedArticles = localStorage.getItem("articles");
    if (savedArticles) {
      return JSON.parse(savedArticles);
    }
    return [];
  };

  // Get articles container
  const articlesGrid = document.querySelector(".articles-grid");

  // Load articles
  const articles = loadArticlesFromStorage();
  console.log("Loaded articles:", articles); // Debug log

  // Filter only published articles
  const publishedArticles = articles.filter(
    (article) => article.status === "published"
  );
  console.log("Published articles:", publishedArticles); // Debug log

  // Render articles if we have any
  if (publishedArticles.length > 0) {
    // Clear existing articles
    articlesGrid.innerHTML = "";

    // Add articles to the grid
    publishedArticles.forEach((article) => {
      const articleCard = document.createElement("div");
      articleCard.className = "article-card";
      articleCard.setAttribute("data-category", article.category);

      articleCard.innerHTML = `
        <div class="article-image">
          <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="article-content">
          <div class="article-meta">
            <span class="category">${article.category}</span>
            <span class="date">${article.date}</span>
          </div>
          <h3>${article.title}</h3>
          <p>${article.intro}</p>
          <a href="article-detail.html?id=${article.id}" class="read-more">Read More</a>
        </div>
      `;

      articlesGrid.appendChild(articleCard);
    });
  } else {
    console.log("No published articles found or articles grid not found"); // Debug log
  }

  // Handle category filtering
  const filterLinks = document.querySelectorAll(".filter-list a");
  const articleCards = document.querySelectorAll(".article-card");

  filterLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all links
      filterLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      const category = this.getAttribute("data-category");

      // Show all articles if "Semua" is selected, otherwise filter
      articleCards.forEach((card) => {
        if (
          category === "Semua" ||
          card.getAttribute("data-category") === category
        ) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Handle tag filtering
  const tagLinks = document.querySelectorAll(".tag-cloud .tag");

  tagLinks.forEach((tag) => {
    tag.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the tag text
      const tagText = this.textContent.toLowerCase();

      // Remove active class from all category links
      filterLinks.forEach((l) => l.classList.remove("active"));

      // Show articles that match the tag (this is a simplified implementation)
      // In a real application, you would have tag data for each article
      articleCards.forEach((card) => {
        const articleTitle = card.querySelector("h3").textContent.toLowerCase();
        const articleDesc = card.querySelector("p").textContent.toLowerCase();

        if (articleTitle.includes(tagText) || articleDesc.includes(tagText)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Handle pagination (simplified)
  const paginationLinks = document.querySelectorAll(".pagination a");

  if (paginationLinks.length > 0) {
    paginationLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active class from all pagination links
        paginationLinks.forEach((l) => l.classList.remove("active"));

        // Add active class to clicked link
        if (!this.classList.contains("page-next")) {
          this.classList.add("active");
        }

        // In a real application, you would load the next page of articles here
        // For this demo, we'll just scroll to the top of the articles section
        document
          .querySelector(".articles-container")
          .scrollIntoView({ behavior: "smooth" });
      });
    });
  }
});
