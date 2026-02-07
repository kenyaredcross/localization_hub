<template>
  <div class="page-container">
    <div class="page-content">
      <!-- Latest News Section -->
      <section class="news-section">
        <div class="section-header">
          <h2 class="section-title">Latest news</h2>
          <a href="#" @click.prevent="viewAllNews" class="view-all-link">
            See all →
          </a>
        </div>

        <div class="news-grid">
          <div 
            v-for="article in newsArticles" 
            :key="article.name"
            class="news-card"
            @click="openArticle(article)"
          >
            <div class="news-image">
              <img 
                :src="getImageUrl(article.image)" 
                :alt="article.title"
                @error="handleImageError"
              />
              <div v-if="article.category" class="news-badge">
                <span class="badge-icon">📰</span>
                <span class="badge-text">{{ article.category }}</span>
              </div>
            </div>
            <div class="news-content">
              <div class="news-meta">
                <span class="news-date">{{ formatDate(article.date) }}</span>
              </div>
              <h3 class="news-title">{{ article.title }}</h3>
              <p v-if="article.summary" class="news-summary">{{ article.summary }}</p>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="newsArticles.length === 0 && !loading" class="empty-state">
            <div class="empty-icon">📰</div>
            <p class="empty-text">No news articles yet</p>
            <p class="empty-subtext">Create some in the News Article doctype!</p>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading news...</p>
          </div>
        </div>
      </section>

      <!-- Highlights Section -->
      <section class="highlights-section">
        <div class="section-header">
          <h2 class="section-title">Highlights</h2>
        </div>

        <div class="highlights-grid">
          <div 
            v-for="highlight in highlights" 
            :key="highlight.name"
            class="highlight-card"
            @click="openHighlight(highlight)"
          >
            <div class="highlight-image">
              <img 
                :src="getImageUrl(highlight.image)" 
                :alt="highlight.title"
                @error="handleImageError"
              />
            </div>
            <div class="highlight-content">
              <h3 class="highlight-category">{{ highlight.category }}</h3>
              <a href="#" @click.prevent="openHighlight(highlight)" class="highlight-link">
                {{ highlight.link_text }} →
              </a>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="highlights.length === 0 && !loading" class="empty-state">
            <div class="empty-icon">✨</div>
            <p class="empty-text">No highlights yet</p>
            <p class="empty-subtext">Create some in the Highlight doctype!</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  
  data() {
    return {
      newsArticles: [],
      highlights: [],
      loading: true
    }
  },
  
  mounted() {
    this.fetchNewsArticles();
    this.fetchHighlights();
  },
  
  methods: {
    // Fetch latest news articles
    fetchNewsArticles() {
      this.loading = true;
      
      if (!window.frappe) {
        console.error('Frappe not available');
        this.loading = false;
        // Add dummy data for demo
        // this.newsArticles = [
        //   {
        //     name: '1',
        //     title: 'New report warns of rising violence against women online',
        //     date: '2026-02-07',
        //     category: 'Joint News Release',
        //     summary: 'A comprehensive study reveals alarming trends in online harassment targeting women.',
        //     image: null,
        //   }
        // ];
        return;
      }

      frappe.call({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'News Articles',
          fields: ['name', 'title', 'date', 'category', 'summary', 'image'],
          filters: {
            published: 1
          },
          order_by: 'date desc',
          limit: 4
        },
        callback: (response) => {
          if (response.message) {
            this.newsArticles = response.message;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching news:', error);
          this.loading = false;
        }
      });
    },

    // Fetch highlights
    fetchHighlights() {
      if (!window.frappe) {
        console.error('Frappe not available');
        return;
      }

      frappe.call({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'Highlights',
          fields: ['name', 'title', 'category', 'image', 'link_text', 'link_url'],
          filters: {
            published: 1
          },
          order_by: 'display_order asc',
          limit: 4
        },
        callback: (response) => {
          if (response.message) {
            this.highlights = response.message;
          }
        },
        error: (error) => {
          console.error('Error fetching highlights:', error);
        }
      });
    },

    // Get full image URL from Frappe
    getImageUrl(imagePath) {
      if (!imagePath) {
        return 'https://via.placeholder.com/400x250/1a3353/ffffff?text=No+Image';
      }
      
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      return window.location.origin + imagePath;
    },

    // Handle image load errors
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/400x250/1a3353/ffffff?text=Image+Not+Found';
    },

    // Format date nicely
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },

    // Open article detail page
    openArticle(article) {
      if (window.frappe) {
        frappe.set_route('Form', 'News Articles', article.name);
      }
    },

    // Open highlight link
    openHighlight(highlight) {
      if (highlight.link_url) {
        if (highlight.link_url.startsWith('http')) {
          window.open(highlight.link_url, '_blank');
        } else {
          if (window.frappe) {
            frappe.set_route(highlight.link_url);
          }
        }
      }
    },

    // View all news
    viewAllNews() {
      if (window.frappe) {
        frappe.set_route('List', 'News Articles');
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Rounded white container like image 3 */
.page-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #f0f1f3;
  max-width: 100%;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a3353;
  margin: 0;
  letter-spacing: -0.02em;
}

.view-all-link {
  font-size: 14px;
  color: #d63939;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-all-link:hover {
  color: #c02d2d;
  transform: translateX(2px);
}

/* News Section */
.news-section {
  margin-bottom: 48px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* News Cards - BBC Style */
.news-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8ebed;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #d0d0d0;
}

.news-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #1a3353;
  position: relative;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.03);
}

/* News badge on image */
.news-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(26, 51, 83, 0.9);
  backdrop-filter: blur(8px);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge-icon {
  font-size: 14px;
}

.badge-text {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.news-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.news-meta {
  display: flex;
  align-items: center;
}

.news-date {
  font-size: 12px;
  color: #6f767e;
  font-weight: 500;
}

.news-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a3353;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-summary {
  font-size: 13px;
  color: #6f767e;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-footer {
  margin-top: auto;
  padding-top: 8px;
}

/* Highlights Section */
.highlights-section {
  margin-top: 48px;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.highlight-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8ebed;
  transition: all 0.2s ease;
  cursor: pointer;
}

.highlight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #d0d0d0;
}

.highlight-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #1a3353;
}

.highlight-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.highlight-card:hover .highlight-image img {
  transform: scale(1.03);
}

.highlight-content {
  padding: 20px;
  background: #f8f9fa;
}

.highlight-category {
  font-size: 15px;
  font-weight: 700;
  color: #1a3353;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.highlight-link {
  font-size: 13px;
  color: #0066cc;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.highlight-link:hover {
  color: #004499;
}

/* Empty & Loading States */
.empty-state,
.loading-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: #6f767e;
  margin: 0 0 8px 0;
}

.empty-subtext {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f1f3;
  border-top-color: #d63939;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #6f767e;
  font-size: 14px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-content {
    padding: 20px;
    border-radius: 8px;
  }

  .news-grid,
  .highlights-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 20px;
  }

  .view-all-link {
    font-size: 13px;
  }

  .news-section {
    margin-bottom: 32px;
  }

  .highlights-section {
    margin-top: 32px;
  }
}
</style>