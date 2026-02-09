<template>
  <div class="report-view-container">
    <div class="report-view-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Loading report...</p>
      </div>

      <!-- Report Content -->
      <div v-else-if="report" class="report-document">
        <!-- Back Button -->
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span>Back to Reports</span>
        </button>

        <!-- Report Header -->
        <header class="report-header">
          <div class="report-meta">
            <span class="report-date">{{ formatDate(report.date) }}</span>
            <span v-if="report.programme" class="report-programme">{{ report.programme }}</span>
          </div>
          <h1 class="report-title">{{ report.title }}</h1>
          <div class="report-authors">
            <div v-if="report.written_by" class="author-item">
              <span class="author-label">Written by:</span>
              <span class="author-name">{{ report.written_by }}</span>
            </div>
            <div v-if="report.accompanied_by" class="author-item">
              <span class="author-label">Accompanied by:</span>
              <span class="author-name">{{ report.accompanied_by }}</span>
            </div>
          </div>
        </header>

        <!-- Report Sections -->
        <div class="report-body">
          <!-- Background -->
          <section v-if="report.background" class="report-section">
            <h2 class="section-title">Background</h2>
            <div class="section-content" v-html="report.background"></div>
          </section>

          <!-- Objectives -->
          <section v-if="report.objectives" class="report-section">
            <h2 class="section-title">Objectives</h2>
            <div class="section-content" v-html="report.objectives"></div>
          </section>

          <!-- Findings -->
          <section v-if="report.findings" class="report-section">
            <h2 class="section-title">Findings</h2>
            <div class="section-content" v-html="report.findings"></div>
          </section>

          <!-- Challenges & Resolutions -->
          <section v-if="report.challenges_resolutions" class="report-section">
            <h2 class="section-title">Challenges & Resolutions</h2>
            <div class="section-content" v-html="report.challenges_resolutions"></div>
          </section>
        </div>

        <!-- Report Footer -->
        <footer class="report-footer">
          <div v-if="report.approved_by" class="approval">
            <span class="approval-label">Approved by:</span>
            <span class="approval-name">{{ report.approved_by }}</span>
          </div>
        </footer>
      </div>

      <!-- Error State -->
      <div v-else class="error-state">
        <div class="error-icon">⚠️</div>
        <p class="error-text">Report not found</p>
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span>Back to Reports</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportView',

  props: {
    reportId: {
      type: String,
      required: true
    }
  },

  emits: ['back'],

  data() {
    return {
      report: null,
      loading: true
    };
  },

  watch: {
    reportId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchReport();
        }
      }
    }
  },

  methods: {
    // Fetch single report
    fetchReport() {
      this.loading = true;

      if (!window.frappe || !this.reportId) {
        console.error('Frappe not available or no report ID');
        this.loading = false;
        return;
      }

      frappe.call({
        method: 'frappe.client.get',
        args: {
          doctype: 'Reports',
          name: this.reportId
        },
        callback: (response) => {
          if (response.message) {
            this.report = response.message;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching report:', error);
          this.loading = false;
        }
      });
    },

    // Format date
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },

    // Go back to reports list
    goBack() {
      // Emit back event to parent component
      this.$emit('back');
    }
  }
};
</script>

<style scoped>
/* ============================================
   TYPOGRAPHY - Document Style
   ============================================ */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;600;700&display=swap');

/* ============================================
   LAYOUT CONTAINER
   ============================================ */
.report-view-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 0;
}

.report-view-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
}

/* ============================================
   LOADING & ERROR STATES
   ============================================ */
.loading-container,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 24px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top-color: #1a3353;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text,
.error-text {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

.error-icon {
  font-size: 72px;
  opacity: 0.3;
}

/* ============================================
   BACK BUTTON
   ============================================ */
.back-btn {
  font-family: 'IBM Plex Sans', sans-serif;
  background: white;
  color: #1a3353;
  border: 1px solid #e0e0e0;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
}

.back-btn:hover {
  background: #f5f5f5;
  border-color: #1a3353;
}

.back-icon {
  font-size: 18px;
}

/* ============================================
   REPORT DOCUMENT
   ============================================ */
.report-document {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 64px;
  animation: fadeIn 0.5s ease;
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
   REPORT HEADER
   ============================================ */
.report-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 32px;
  margin-bottom: 48px;
}

.report-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.report-date {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.report-programme {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1a3353;
  background: #f0f4f8;
  padding: 4px 12px;
  border-radius: 12px;
}

.report-title {
  font-family: 'IBM Plex Serif', serif;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  margin: 0 0 24px 0;
  letter-spacing: -0.01em;
}

.report-authors {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.author-item {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  color: #666;
}

.author-label {
  font-weight: 600;
  color: #1a1a1a;
  margin-right: 8px;
}

.author-name {
  font-weight: 400;
}

/* ============================================
   REPORT BODY
   ============================================ */
.report-body {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.report-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-family: 'IBM Plex Serif', serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a3353;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.section-content {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

/* Rich text content styling */
.section-content :deep(p) {
  margin: 0 0 16px 0;
}

.section-content :deep(p:last-child) {
  margin-bottom: 0;
}

.section-content :deep(ul),
.section-content :deep(ol) {
  margin: 0 0 16px 0;
  padding-left: 24px;
}

.section-content :deep(li) {
  margin-bottom: 8px;
}

.section-content :deep(strong) {
  font-weight: 600;
  color: #1a1a1a;
}

.section-content :deep(em) {
  font-style: italic;
}

.section-content :deep(a) {
  color: #0033cc;
  text-decoration: underline;
}

.section-content :deep(a:hover) {
  color: #0029a3;
}

/* ============================================
   REPORT FOOTER
   ============================================ */
.report-footer {
  border-top: 2px solid #e0e0e0;
  padding-top: 32px;
  margin-top: 48px;
}

.approval {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 8px;
}

.approval-label {
  font-weight: 600;
  color: #1a1a1a;
}

.approval-name {
  font-weight: 400;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) {
  .report-view-content {
    padding: 24px 16px;
  }

  .report-document {
    padding: 32px 24px;
    border-radius: 0;
  }

  .report-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 20px;
  }

  .section-content {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .report-document {
    padding: 24px 16px;
  }

  .report-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .section-content {
    font-size: 14px;
    line-height: 1.7;
  }
}

/* Print Styles */
@media print {
  .report-view-container {
    background: white;
  }

  .back-btn {
    display: none;
  }

  .report-document {
    box-shadow: none;
    padding: 0;
  }
}
</style>