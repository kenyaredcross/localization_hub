<template>
  <div class="publications-container">
    <div class="publications-content">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Latest Articles</h1>
      </div>

      <!-- Main Layout: Sidebar + Articles -->
      <div class="publications-layout">
        <!-- Left Sidebar: Categories -->
        <aside class="categories-sidebar">
          <div class="categories-list">
            <button
              v-for="category in categories"
              :key="category.value"
              :class="['category-btn', { active: selectedCategory === category.value }]"
              @click="selectCategory(category.value)"
            >
              {{ category.label }}
            </button>
          </div>
        </aside>

        <!-- Right Side: Articles Grid -->
        <main class="articles-section">
          <!-- Loading State -->
          <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p class="loading-text">Loading publications...</p>
          </div>

          <!-- Articles Grid -->
          <div v-else-if="filteredArticles.length > 0" class="articles-grid">
            <article
              v-for="article in filteredArticles"
              :key="article.name"
              class="article-card"
              @click="openArticle(article)"
            >
              <!-- Article Image -->
              <div class="article-image">
                <img
                  :src="getImageUrl(article.image)"
                  :alt="article.title"
                  @error="handleImageError"
                />
              </div>

              <!-- Article Content -->
              <div class="article-content">
                <!-- Category Badge -->
                <div class="article-category">
                  {{ article.category }}
                </div>

                <!-- Title -->
                <h2 class="article-title">
                  {{ article.title }}
                </h2>

                <!-- Description/Summary -->
                <p class="article-description">
                  {{ article.description }}
                </p>
              </div>
            </article>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <div class="empty-icon">📚</div>
            <p class="empty-text">No publications found</p>
            <p class="empty-subtext">
              {{ selectedCategory === 'all' 
                ? 'Create some in the Publications doctype!' 
                : 'Try selecting a different category' }}
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublicationsPage',

  data() {
    return {
      articles: [],
      selectedCategory: 'all',
      loading: true,
      categories: [
        { label: 'Purpose & Ideals', value: 'Purpose & Ideals' },
        { label: 'Science & Innovation', value: 'Science & Innovation' },
        { label: 'Health & Wellness', value: 'Health & Wellness' },
        { label: 'Policy & Advocacy', value: 'Policy & Advocacy' },
        { label: 'Community Stories', value: 'Community Stories' }
      ]
    };
  },

  computed: {
    filteredArticles() {
      if (this.selectedCategory === 'all') {
        return this.articles;
      }
      return this.articles.filter(
        article => article.category === this.selectedCategory
      );
    }
  },

  mounted() {
    this.fetchPublications();
  },

  methods: {
    // Fetch publications from Frappe
    fetchPublications() {
      this.loading = true;

      if (!window.frappe) {
        console.error('Frappe not available');
        this.loading = false;
        return;
      }

      frappe.call({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'Publications',
          fields: ['name', 'title', 'category', 'description', 'image', 'publish_date'],
          filters: {
            published: 1
          },
          order_by: 'publish_date desc',
          limit_page_length: 50
        },
        callback: (response) => {
          if (response.message) {
            this.articles = response.message;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching publications:', error);
          this.loading = false;
        }
      });
    },

    // Select category filter
    selectCategory(category) {
      this.selectedCategory = category;
    },

    // Get full image URL
    getImageUrl(imagePath) {
      if (!imagePath) {
        return 'https://via.placeholder.com/400x300/1a3353/ffffff?text=No+Image';
      }

      if (imagePath.startsWith('http')) {
        return imagePath;
      }

      return window.location.origin + imagePath;
    },

    // Handle image errors
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/400x300/1a3353/ffffff?text=Image+Not+Found';
    },

    // Open article detail
    openArticle(article) {
      if (window.frappe) {
        frappe.set_route('Form', 'Publications', article.name);
      }
    }
  }
};
</script>

<style scoped>
/* ============================================
   TYPOGRAPHY - Editorial Magazine Style
   ============================================ */
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

/* ============================================
   LAYOUT CONTAINER
   ============================================ */
.publications-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 0;
}

.publications-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* ============================================
   PAGE HEADER
   ============================================ */
.page-header {
  margin-bottom: 40px;
  border-bottom: 3px solid #1a3353;
  padding-bottom: 16px;
}

.page-title {
  font-family: 'Lora', serif;
  font-size: 36px;
  font-weight: 700;
  color: #1a3353;
  margin: 0;
  letter-spacing: -0.02em;
}

/* ============================================
   MAIN LAYOUT: Sidebar + Content
   ============================================ */
.publications-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 48px;
  align-items: start;
}

/* ============================================
   LEFT SIDEBAR: Categories
   ============================================ */
.categories-sidebar {
  position: sticky;
  top: 24px;
  background: white;
  border-radius: 8px;
  padding: 24px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e8ebed;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-btn {
  font-family: 'DM Sans', sans-serif;
  background: transparent;
  border: none;
  padding: 12px 24px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #1a3353;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border-left: 3px solid transparent;
}

.category-btn:hover {
  background: #f8f9fa;
  color: #0052cc;
}

.category-btn.active {
  background: #f0f4f8;
  color: #0052cc;
  font-weight: 600;
  border-left-color: #0052cc;
}

/* ============================================
   ARTICLES SECTION
   ============================================ */
.articles-section {
  min-height: 400px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================
   ARTICLE CARDS - Editorial Style
   ============================================ */
.article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e8ebed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: #d0d0d0;
}

/* Article Image */
.article-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a3353 0%, #2d5079 100%);
  position: relative;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

/* Article Content */
.article-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.article-category {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #0052cc;
  margin: 0;
}

.article-title {
  font-family: 'Lora', serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  color: #1a3353;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}

.article-card:hover .article-title {
  color: #0052cc;
}

.article-description {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #6f767e;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ============================================
   LOADING STATE
   ============================================ */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f1f3;
  border-top-color: #0052cc;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #6f767e;
  margin: 0;
  font-weight: 500;
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-text {
  font-family: 'Lora', serif;
  font-size: 20px;
  font-weight: 600;
  color: #1a3353;
  margin: 0 0 8px 0;
}

.empty-subtext {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 1024px) {
  .publications-layout {
    grid-template-columns: 180px 1fr;
    gap: 32px;
  }

  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .category-btn {
    font-size: 13px;
    padding: 10px 16px;
  }
}

@media (max-width: 768px) {
  .publications-content {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-header {
    margin-bottom: 32px;
  }

  .publications-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .categories-sidebar {
    position: relative;
    top: 0;
    padding: 16px 0;
  }

  .categories-list {
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
    padding: 0 8px;
    -webkit-overflow-scrolling: touch;
  }

  .category-btn {
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 10px 16px;
  }

  .category-btn.active {
    border-left-color: transparent;
    border-bottom-color: #0052cc;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .article-image {
    height: 200px;
  }

  .article-content {
    padding: 20px;
  }

  .article-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }

  .article-image {
    height: 180px;
  }

  .article-content {
    padding: 16px;
    gap: 10px;
  }

  .article-title {
    font-size: 16px;
  }

  .article-description {
    font-size: 13px;
  }
}
</style>