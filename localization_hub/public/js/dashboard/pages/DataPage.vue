<template>
  <div class="data-page-container">
    <div class="data-page-content">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Data Resources</h1>
          <p class="page-subtitle">Quality data is the foundation of meaningful research</p>
        </div>
      </div>

      <!-- Stats Overview (Optional) -->
      <div v-if="statsEnabled" class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">{{ totalDatasets }}</div>
          <div class="stat-label">Total Datasets</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ formatFileSize(totalSize) }}</div>
          <div class="stat-label">Total Data Size</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ categories.length - 1 }}</div>
          <div class="stat-label">Categories</div>
        </div>
      </div>

      <!-- Category Filters -->
      <div class="category-filters">
        <button
          v-for="category in categories"
          :key="category.value"
          :class="['filter-btn', { active: selectedCategory === category.value }]"
          @click="selectCategory(category.value)"
        >
          <span class="filter-icon">{{ category.icon }}</span>
          <span class="filter-label">{{ category.label }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Loading data resources...</p>
      </div>

      <!-- Data Cards Grid -->
      <div v-else-if="filteredDatasets.length > 0" class="data-grid">
        <div
          v-for="dataset in filteredDatasets"
          :key="dataset.name"
          class="data-card"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="card-icon" :style="{ background: getCategoryColor(dataset.category) }">
              <span>{{ getCategoryIcon(dataset.category) }}</span>
            </div>
            <div class="card-meta">
              <span class="category-badge">{{ dataset.category }}</span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <h3 class="card-title">{{ dataset.title }}</h3>
            <p class="card-description">{{ dataset.description }}</p>
            
            <!-- Metadata -->
            <div class="card-metadata">
              <div class="metadata-item">
                <span class="metadata-icon">📅</span>
                <span class="metadata-text">{{ formatDate(dataset.last_updated) }}</span>
              </div>
              <div v-if="dataset.file_size" class="metadata-item">
                <span class="metadata-icon">💾</span>
                <span class="metadata-text">{{ formatFileSize(dataset.file_size) }}</span>
              </div>
            </div>
          </div>

          <!-- Card Footer with Download Button -->
          <div class="card-footer">
            <button 
              class="download-btn"
              @click="downloadFile(dataset)"
            >
              <span class="btn-icon">⬇</span>
              <span class="btn-text">{{ dataset.file_format || 'Download' }}</span>
            </button>
            <button
              v-if="dataset.documentation_url"
              class="preview-btn"
              @click="openDocumentation(dataset)"
            >
              <span class="btn-icon">📄</span>
              <span class="btn-text">Documentation</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📂</div>
        <p class="empty-text">No datasets found</p>
        <p class="empty-subtext">
          {{ selectedCategory === 'all' 
            ? 'Create some in the Data Resources doctype!' 
            : 'Try selecting a different category' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataPage',

  data() {
    return {
      datasets: [],
      selectedCategory: 'all',
      loading: true,
      statsEnabled: true,
      categories: [
        { label: 'All', value: 'all', icon: '📁' },
        { label: 'Documentation', value: 'Documentation', icon: '📄' },
        { label: 'Statistics', value: 'Statistics', icon: '📊' },
        { label: 'Research Data', value: 'Research Data', icon: '🔬' },
        { label: 'Reference', value: 'Reference', icon: '📚' },
        { label: 'Reports', value: 'Reports', icon: '📈' }
      ]
    };
  },

  computed: {
    filteredDatasets() {
      if (this.selectedCategory === 'all') {
        return this.datasets;
      }
      return this.datasets.filter(
        dataset => dataset.category === this.selectedCategory
      );
    },

    totalDatasets() {
      return this.datasets.length;
    },

    totalSize() {
      return this.datasets.reduce((sum, dataset) => sum + (dataset.file_size || 0), 0);
    }
  },

  mounted() {
    this.fetchDatasets();
  },

  methods: {
    // Fetch datasets from Frappe
    fetchDatasets() {
      this.loading = true;

      if (!window.frappe) {
        console.error('Frappe not available');
        this.loading = false;
        // Demo data for testing
        this.datasets = [
          {
            name: '1',
            title: 'Documentation',
            category: 'Documentation',
            description: 'Contains a PDF file with information on the WHO Mortality Database, file specifications and list of causes of death.',
            last_updated: '2025-02-01',
            file_size: 839680,
            file_format: '.zip (820kb)',
            documentation_url: 'https://example.com/docs'
          },
          {
            name: '2',
            title: 'Availability',
            category: 'Statistics',
            description: 'Contains an Excel file with the list of countries-years available for the mortality and population data.',
            last_updated: '2025-02-01',
            file_size: 286720,
            file_format: '.zip (280kb)'
          }
        ];
        return;
      }

      frappe.call({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'Data Resources',
          fields: [
            'name', 'title', 'category', 'description', 
            'last_updated', 'file_attachment', 'file_size', 
            'file_format', 'documentation_url'
          ],
          filters: {
            published: 1
          },
          order_by: 'last_updated desc',
          limit_page_length: 50
        },
        callback: (response) => {
          if (response.message) {
            this.datasets = response.message;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching datasets:', error);
          this.loading = false;
        }
      });
    },

    // Select category filter
    selectCategory(category) {
      this.selectedCategory = category;
    },

    // Download file
    downloadFile(dataset) {
      if (dataset.file_attachment) {
        // If it's a Frappe file path
        const fileUrl = dataset.file_attachment.startsWith('http') 
          ? dataset.file_attachment 
          : window.location.origin + dataset.file_attachment;
        
        window.open(fileUrl, '_blank');
      } else {
        frappe.msgprint('No file attached to this dataset');
      }
    },

    // Open documentation
    openDocumentation(dataset) {
      if (dataset.documentation_url) {
        window.open(dataset.documentation_url, '_blank');
      }
    },

    // Get category icon based on category
    getCategoryIcon(category) {
      const iconMap = {
        'Documentation': '📄',
        'Statistics': '📊',
        'Research Data': '🔬',
        'Reference': '📚',
        'Reports': '📈',
        'Other': '📁'
      };
      return iconMap[category] || '📊';
    },

    // Get category color - using same muted professional color for all
    getCategoryColor(category) {
      return '#64748b'; // Muted slate gray - professional and consistent
    },

    // Format date
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      return 'Last update: ' + date.toLocaleDateString('en-US', options);
    },

    // Format file size
    formatFileSize(bytes) {
      if (!bytes || bytes === 0) return '0 KB';
      
      const kb = bytes / 1024;
      if (kb < 1024) return `${kb.toFixed(0)} KB`;
      
      const mb = kb / 1024;
      if (mb < 1024) return `${mb.toFixed(1)} MB`;
      
      const gb = mb / 1024;
      return `${gb.toFixed(2)} GB`;
    }
  }
};
</script>

<style scoped>
/* ============================================
   TYPOGRAPHY - Modern Data Dashboard
   ============================================ */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

/* CSS Variables */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* ============================================
   LAYOUT CONTAINER
   ============================================ */
.data-page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 0;
}

.data-page-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 24px;
}

/* ============================================
   PAGE HEADER
   ============================================ */
.page-header {
  margin-bottom: 48px;
  animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  text-align: center;
}

.page-title {
  font-family: 'Outfit', sans-serif;
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #1a3353 0%, #4a5f8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  letter-spacing: -0.03em;
}

.page-subtitle {
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* ============================================
   STATS OVERVIEW
   ============================================ */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #1a3353;
  margin-bottom: 8px;
}

.stat-label {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-trend {
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.positive {
  color: #10b981;
}

.stat-trend.negative {
  color: #ef4444;
}

.stat-trend.positive::before {
  content: '↗';
}

.stat-trend.negative::before {
  content: '↘';
}

/* ============================================
   CATEGORY FILTERS
   ============================================ */
.category-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.filter-btn {
  font-family: 'Manrope', sans-serif;
  background: transparent;
  border: 2px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #64748b;
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
}

.filter-icon {
  font-size: 18px;
}

.filter-label {
  font-weight: 600;
}

/* ============================================
   DATA GRID
   ============================================ */
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

/* ============================================
   DATA CARDS - Modern Style
   ============================================ */
.data-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
}

.data-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #64748b;
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.data-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.data-card:hover::before {
  transform: scaleX(1);
}

/* Card Header */
.card-header {
  padding: 16px 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.data-card:hover .card-icon {
  transform: scale(1.05);
}

.card-meta {
  text-align: right;
}

.category-badge {
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
}

/* Card Body */
.card-body {
  padding: 0 16px 16px;
  flex: 1;
}

.card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a3353;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.card-description {
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #64748b;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-metadata {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metadata-item {
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.metadata-icon {
  font-size: 12px;
}

.metadata-text {
  font-weight: 500;
}

/* Card Footer */
.card-footer {
  padding: 12px 16px 16px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
}

.download-btn {
  font-family: 'Manrope', sans-serif;
  flex: 1;
  background: #64748b;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2);
}

.download-btn:hover {
  background: #475569;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(100, 116, 139, 0.3);
}

.download-btn:active {
  transform: translateY(0);
}

.preview-btn {
  font-family: 'Manrope', sans-serif;
  background: white;
  color: #64748b;
  border: 1.5px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.preview-btn:hover {
  background: #f8fafc;
  border-color: #64748b;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 14px;
}

.btn-text {
  font-weight: 600;
}

/* ============================================
   LOADING STATE
   ============================================ */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 24px;
}

.spinner {
  width: 56px;
  height: 56px;
  border: 5px solid #f1f5f9;
  border-top-color: #64748b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  color: #64748b;
  margin: 0;
  font-weight: 600;
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.3;
}

.empty-text {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a3353;
  margin: 0 0 12px 0;
}

.empty-subtext {
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  color: #94a3b8;
  margin: 0;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 1024px) {
  .data-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .stats-overview {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .data-page-content {
    padding: 32px 16px;
  }

  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .page-header {
    margin-bottom: 32px;
  }

  .category-filters {
    padding: 12px;
  }

  .filter-btn {
    padding: 10px 20px;
    font-size: 13px;
  }

  .data-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-footer {
    flex-direction: column;
  }

  .preview-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .stat-value {
    font-size: 28px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-description {
    font-size: 13px;
  }
}
</style>