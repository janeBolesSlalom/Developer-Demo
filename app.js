// Load and display tiles from sites.json
document.addEventListener('DOMContentLoaded', function() {
  // Highlight active navigation link
  highlightActiveNav();
  
  // Load tiles if on home page
  const tilesContainer = document.getElementById('tiles-container');
  if (tilesContainer) {
    loadTiles();
  }
});

function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

async function loadTiles() {
  const tilesContainer = document.getElementById('tiles-container');
  
  try {
    // Show loading state
    tilesContainer.innerHTML = '<div class="loading">Loading sites...</div>';
    
    // Fetch sites data
    const response = await fetch('sites.json');
    if (!response.ok) {
      throw new Error('Failed to load sites data');
    }
    
    const sites = await response.json();
    
    // Clear loading state
    tilesContainer.innerHTML = '';
    
    // Create tiles
    if (sites.length === 0) {
      tilesContainer.innerHTML = '<div class="loading">No sites available</div>';
      return;
    }
    
    sites.forEach(site => {
      const tile = createTile(site);
      tilesContainer.appendChild(tile);
    });
    
  } catch (error) {
    console.error('Error loading tiles:', error);
    tilesContainer.innerHTML = '<div class="loading">Error loading sites. Please try again later.</div>';
  }
}

function createTile(site) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  
  const img = document.createElement('img');
  img.className = 'tile-image';
  img.src = site.image;
  img.alt = site.title;
  img.loading = 'lazy';
  
  const content = document.createElement('div');
  content.className = 'tile-content';
  
  const title = document.createElement('h3');
  title.className = 'tile-title';
  title.textContent = site.title;
  
  const description = document.createElement('p');
  description.className = 'tile-description';
  description.textContent = site.description;
  
  const link = document.createElement('a');
  link.className = 'tile-link';
  link.href = site.link;
  link.textContent = 'View Site';
  // Only open in new tab if not a placeholder link
  if (site.link && site.link !== '#') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(link);
  
  tile.appendChild(img);
  tile.appendChild(content);
  
  return tile;
}
