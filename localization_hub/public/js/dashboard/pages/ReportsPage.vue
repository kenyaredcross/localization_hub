<template>
  <div class="reports-container">
    <div class="reports-content">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Reports</h1>
        <button class="create-btn" @click="createReport">
          <span class="btn-icon">+</span>
          <span class="btn-text">Create a Report</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Loading reports...</p>
      </div>

      <!-- Reports Timeline -->
      <div v-else-if="groupedReports && Object.keys(groupedReports).length > 0" class="reports-timeline">
        <div 
          v-for="(reports, monthYear) in groupedReports" 
          :key="monthYear"
          class="timeline-group"
        >
          <!-- Month Header -->
          <div class="month-header">
            <h2 class="month-title">{{ monthYear }}</h2>
          </div>

          <!-- Reports in this month -->
          <div class="month-reports">
            <div
              v-for="report in reports"
              :key="report.name"
              class="report-item"
              @click="viewReport(report)"
            >
              <!-- Date Badge -->
              <div class="report-date">
                {{ formatDay(report.date) }}
              </div>

              <!-- Report Content -->
              <div class="report-content">
                <h3 class="report-title">{{ report.title }}</h3>
                
                <!-- Tags/Categories -->
                <div class="report-tags">
                  <span v-if="report.programme" class="tag">{{ report.programme }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📊</div>
        <p class="empty-text">No reports yet</p>
        <p class="empty-subtext">Click "Create a Report" to get started</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportsPage',

  emits: ['view-report'],

  data() {
    return {
      reports: [],
      loading: true
    };
  },

  computed: {
    // Group reports by month and year
    groupedReports() {
      const groups = {};
      
      this.reports.forEach(report => {
        const monthYear = this.formatMonthYear(report.date);
        if (!groups[monthYear]) {
          groups[monthYear] = [];
        }
        groups[monthYear].push(report);
      });

      // Sort each group by date descending
      Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => new Date(b.date) - new Date(a.date));
      });

      return groups;
    }
  },

  mounted() {
    this.fetchReports();
  },

  methods: {
    // Fetch reports from Frappe
    fetchReports() {
      this.loading = true;

      if (!window.frappe) {
        console.error('Frappe not available');
        this.loading = false;
        // Demo data for testing
        this.reports = [
          {
            name: '1',
            title: 'FDA Grants Priority Review for HYMPAVZI® (marstacimab) sBLA for the Treatment of Two Hemophilia A or B Patient Populations',
            programme: 'Prescription Medicines',
            date: '2026-02-06',
            written_by: 'John Doe',
            approved_by: 'Jane Smith'
          },
          {
            name: '2',
            title: 'Pfizer Launches Cost Savings Program on TrumpRx Lowering Drug Costs for Millions of Americans',
            programme: 'Corporate',
            date: '2026-02-05',
            written_by: 'Alice Johnson',
            approved_by: 'Bob Wilson'
          }
        ];
        return;
      }

      frappe.call({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'Reports',
          fields: [
            'name', 'title', 'programme', 'date', 
            'written_by', 'approved_by'
          ],
          order_by: 'date desc',
          limit_page_length: 100
        },
        callback: (response) => {
          if (response.message) {
            this.reports = response.message;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching reports:', error);
          this.loading = false;
        }
      });
    },

    // Format month and year for grouping
    formatMonthYear(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const options = { month: 'long', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },

    // Format day for display
    formatDay(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
      });
    },

    // Create new report
    createReport() {
      if (window.frappe) {
        frappe.set_route('Form', 'Reports', 'new-reports-1');
      }
    },

    // View report detail
    viewReport(report) {
      // Emit event to parent component
      this.$emit('view-report', report.name);
    }
  }
};
</script>

<style scoped>
/* ============================================
   TYPOGRAPHY - Clean Professional
   ============================================ */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;600;700&display=swap');

/* ============================================
   LAYOUT CONTAINER
   ============================================ */
.reports-container {
  min-height: 100vh;
  background: #fafafa;
  padding: 0;
}

.reports-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

/* ============================================
   PAGE HEADER
   ============================================ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
}

.page-title {
  font-family: 'IBM Plex Serif', serif;
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.02em;
}

.create-btn {
  font-family: 'IBM Plex Sans', sans-serif;
  background: #1a3353;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(26, 51, 83, 0.2);
}

.create-btn:hover {
  background: #2d5079;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 51, 83, 0.3);
}

.btn-icon {
  font-size: 20px;
  font-weight: 300;
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

.loading-text {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

/* ============================================
   TIMELINE LAYOUT
   ============================================ */
.reports-timeline {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.timeline-group {
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

/* Month Header */
.month-header {
  margin-bottom: 32px;
}

.month-title {
  font-family: 'IBM Plex Serif', serif;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.01em;
}

/* Month Reports */
.month-reports {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-left: 2px solid #e0e0e0;
  padding-left: 0;
}

/* ============================================
   REPORT ITEMS - Timeline Style
   ============================================ */
.report-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 32px;
  padding: 32px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.report-item::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 40px;
  width: 10px;
  height: 10px;
  background: #1a3353;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #1a3353;
  transition: all 0.3s ease;
}

.report-item:hover {
  background: #fafafa;
}

.report-item:hover::before {
  width: 14px;
  height: 14px;
  left: -8px;
  top: 38px;
}

/* Report Date */
.report-date {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  padding-top: 4px;
  text-align: left;
  padding-left: 32px;
}

/* Report Content */
.report-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-title {
  font-family: 'IBM Plex Serif', serif;
  font-size: 20px;
  font-weight: 600;
  color: #0033cc;
  line-height: 1.4;
  margin: 0;
  transition: color 0.3s ease;
}

.report-item:hover .report-title {
  color: #0029a3;
  text-decoration: underline;
}

/* Report Tags */
.report-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  background: white;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.report-item:hover .tag {
  border-color: #1a3353;
  color: #1a3353;
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
  margin-top: 40px;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 24px;
  opacity: 0.3;
}

.empty-text {
  font-family: 'IBM Plex Serif', serif;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.empty-subtext {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) {
  .reports-content {
    padding: 32px 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .page-title {
    font-size: 32px;
  }

  .create-btn {
    width: 100%;
    justify-content: center;
  }

  .month-title {
    font-size: 24px;
  }

  .report-item {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 24px 0 24px 32px;
  }

  .report-date {
    padding-left: 0;
    font-size: 13px;
  }

  .report-title {
    font-size: 18px;
  }

  .report-item::before {
    left: -6px;
    top: 30px;
  }

  .report-item:hover::before {
    left: -7px;
    top: 29px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .month-title {
    font-size: 20px;
  }

  .report-title {
    font-size: 16px;
  }

  .create-btn {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>