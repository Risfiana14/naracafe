document.addEventListener("DOMContentLoaded", () => {
  // Get the article ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  if (articleId) {
    loadArticleContent(Number.parseInt(articleId));
  } else {
    console.error("No article ID found in URL");
  }

  // Handle comment form submission
  const commentForm = document.getElementById("comment-form");
  if (commentForm) {
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("comment-name").value;
      const email = document.getElementById("comment-email").value;
      const content = document.getElementById("comment-content").value;
      const saveInfo = document.getElementById("comment-save").checked;

      // In a real application, you would send this data to a server
      // For this demo, we'll just show a success message
      alert(
        "Thank you for your comment, " +
        name +
        "! It will be reviewed and posted soon."
      );

      // Reset the form
      commentForm.reset();
    });
  }

  // Handle reply buttons
  const replyButtons = document.querySelectorAll(".reply-btn");
  replyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Scroll to comment form
      document
        .querySelector(".comment-form")
        .scrollIntoView({ behavior: "smooth" });

      // Focus on the comment textarea
      document.getElementById("comment-content").focus();
    });
  });
});

function loadArticleContent(articleId) {
  console.log("Loading article with ID:", articleId); // Debug log

  // Load articles from localStorage
  const savedArticles = localStorage.getItem("articles");
  let articles = [];

  if (savedArticles) {
    articles = JSON.parse(savedArticles);
    console.log("Articles loaded from localStorage:", articles.length); // Debug log
  } else {
    console.error("No articles found in localStorage");
    return;
  }

  // Find the article by ID
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    console.error("Article not found with ID:", articleId);
    return;
  }

  console.log("Article found:", article); // Debug log

  // Update the article title and meta information
  document.querySelector(".article-title").textContent = article.title;
  document.querySelector(".category").textContent = article.category;
  document.querySelector(".date").textContent = article.date;
  document.querySelector(".author").textContent = "By " + article.author;

  // Update the featured image
  const featuredImage = document.querySelector(".article-featured-image img");
  if (featuredImage) {
    featuredImage.src = article.image;
    featuredImage.alt = article.title;
  }

  // Update the article content
  const contentContainer = document.querySelector(".article-content");
  if (!contentContainer) {
    console.error("Article content container not found");
    return;
  }

  // Start with the intro
  let newContent = `<p class="article-intro">${article.intro}</p>`;

  // Add the main content
  newContent += article.content;

  // Add tags if they exist
  if (article.tags) {
    const tagArray = article.tags.split(",").map((tag) => tag.trim());
    let tagsHTML = '<div class="article-tags"><span>Tags:</span>';

    tagArray.forEach((tag) => {
      tagsHTML += `<a href="#" class="tag">${tag}</a>`;
    });

    tagsHTML += "</div>";
    newContent += tagsHTML;
  }

  // Set the content
  contentContainer.innerHTML = newContent;

  // Update the page title
  document.title = "Aroma Café | " + article.title;

  // Find related articles (excluding the current one)
  const relatedArticlesSection = document.querySelector(".related-articles");
  if (relatedArticlesSection) {
    const relatedGrid = relatedArticlesSection.querySelector(".related-grid");

    if (relatedGrid) {
      // Get published articles in the same category (up to 3)
      const relatedArticles = articles
        .filter(
          (a) =>
            a.id !== articleId &&
            a.status === "published" &&
            a.category === article.category
        )
        .slice(0, 3);

      // If we don't have enough in the same category, add some from other categories
      if (relatedArticles.length < 3) {
        const otherArticles = articles
          .filter(
            (a) =>
              a.id !== articleId &&
              a.status === "published" &&
              a.category !== article.category
          )
          .slice(0, 3 - relatedArticles.length);

        relatedArticles.push(...otherArticles);
      }

      // Clear existing related articles
      relatedGrid.innerHTML = "";

      // Add related articles
      relatedArticles.forEach((related) => {
        const relatedCard = document.createElement("div");
        relatedCard.className = "related-card";

        relatedCard.innerHTML = `
          <div class="related-image">
            <img src="${related.image}" alt="${related.title}">
          </div>
          <h4>${related.title}</h4>
          <a href="article-detail.html?id=${related.id}" class="read-more">Read More</a>
        `;

        relatedGrid.appendChild(relatedCard);
      });
    }
  }
}
