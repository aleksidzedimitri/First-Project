const productGrid = document.getElementById("product-grid");
const filterSelect = document.getElementById("filter-select");
const paginationContainer = document.getElementById("pagination");
const searchBar = document.querySelector(".search-input");
const logo = document.querySelector(".logo");
let currentPage = 1;
let pageSize = 9;
let allProducts = [];
let filteredProducts = [];


// Product fetch and error checking
const fetchProducts = async () => {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category/smartphones"
    );
    const data = await response.json();

    if (!data.products) {
      throw new Error("Product data is unavailable");
    }

    allProducts = data.products;
    filteredProducts = allProducts; 
    renderProducts();
    drawPagination();
  } catch (error) {
    console.error("Error fetching products:", error);
    productGrid.innerHTML =
      "<p>Failed to load products. Please try again later.</p>";
  }
};
// logo refreshes page
logo.addEventListener('click', () =>{
  renderProducts()
})
// Render products function
const renderProducts = () => {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const productsToShow = filteredProducts.slice(start, end); 

  productGrid.innerHTML = "";

  productsToShow.forEach((product) => {
    const discountPrice = (
      product.price -
      (product.price * product.discountPercentage) / 100
    ).toFixed(2);

    const averageRating =
    product.reviews && product.reviews.length
      ? (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : "No ratings yet";


    const smallDescription =
      product.description.length > 50
        ? product.description.slice(0, 50) + "..."
        : product.description;

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}" class="product-image">
      <h3 class="product-title">${product.title}</h3>
      <p class="product-price">
        <strong>$${discountPrice}</strong> 
        <span class="original-price">$${product.price}</span>
      </p>
           <p class="product-rating">Average Rating: ${averageRating}</p>
      <p class="product-description">${smallDescription}</p>
    `;

    productGrid.appendChild(productCard);
  });
};

// Draw pagination
const drawPagination = () => {
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(filteredProducts.length / pageSize); 

  for (let i = 1; i <= pageCount; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("page");
    pageButton.textContent = `${i}`;
    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    pageButton.addEventListener("click", () => {
      currentPage = i;
      document.querySelector(".page.active")?.classList.remove("active");
      pageButton.classList.add("active");
      renderProducts();
    });

    paginationContainer.appendChild(pageButton);
  }
};

// Search input
let timeout;
searchBar.addEventListener("keyup", (event) => {
  clearTimeout(timeout);
  const searchWord = event.target.value.toLowerCase().trim();

  timeout = setTimeout(() => {
    filteredProducts = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchWord)
    );
    currentPage = 1; 
    drawPagination();
    renderProducts();
  }, 1000);
});

// Sorting event
filterSelect.addEventListener("change", () => {
  const selectedFilter = filterSelect.value;
  let sortedProducts = [...filteredProducts];

  if (selectedFilter === "price") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (selectedFilter === "name") {
    sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
  }

  filteredProducts = sortedProducts;
  renderProducts();
  drawPagination();
});

fetchProducts();