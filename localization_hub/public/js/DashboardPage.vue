<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">My Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening in the Localisation Hub.</p>
      </div>
      <div class="header-actions">
        <button class="btn-outline">
          <i class="fas fa-filter"></i>
          Filters
        </button>
        <button class="btn-primary">
          <i class="fas fa-plus"></i>
          Create New
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon red">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalSocieties }}</div>
          <div class="stat-label">National Societies</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Working together
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fas fa-book-open"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalResources }}</div>
          <div class="stat-label">Shared Resources</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            +{{ newResourcesThisMonth }} this month
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fas fa-calendar"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ upcomingEvents }}</div>
          <div class="stat-label">Upcoming Events</div>
          <div class="stat-change">
            <i class="fas fa-calendar-alt"></i>
            Next 30 days
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ activeInitiatives }}</div>
          <div class="stat-label">Active Initiatives</div>
          <div class="stat-change">
            <i class="fas fa-clock"></i>
            In progress
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Quick Actions</h2>
      </div>
      
      <div class="actions-grid">
        <div class="action-card" @click="navigateToResources">
          <div class="action-icon">
            <i class="fas fa-upload"></i>
          </div>
          <h3>Share a Resource</h3>
          <p>Upload documents, tools, or templates for the community</p>
        </div>

        <div class="action-card" @click="navigateToExchange">
          <div class="action-icon">
            <i class="fas fa-comments"></i>
          </div>
          <h3>Start a Discussion</h3>
          <p>Ask questions or share insights with peers</p>
        </div>

        <div class="action-card" @click="navigateToImpact">
          <div class="action-icon">
            <i class="fas fa-star"></i>
          </div>
          <h3>Share Impact Story</h3>
          <p>Showcase your society's achievements</p>
        </div>

        <div class="action-card" @click="navigateToEvents">
          <div class="action-icon">
            <i class="fas fa-calendar-plus"></i>
          </div>
          <h3>Create Event</h3>
          <p>Organize webinars or learning sessions</p>
        </div>
      </div>
    </div>

    <!-- Latest from Community -->
    <div class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Latest from the Community</h2>
          <p class="section-subtitle">Recent impacts and success stories from National Societies</p>
        </div>
        <a href="#" class="see-all-link">View all stories →</a>
      </div>

      <div v-if="impacts.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No community stories yet. Be the first to share!</p>
        <button class="btn-primary" @click="navigateToImpact">Share Your Story</button>
      </div>

      <div v-else class="cards-grid">
        <div 
          v-for="impact in impacts.slice(0, 3)" 
          :key="impact.name"
          class="content-card"
          @click="viewImpact(impact.name)"
        >
          <div class="card-image">
            <img :src="impact.image || getPlaceholderImage()" :alt="impact.title">
            <div class="card-badge">{{ impact.category || 'IMPACT' }}</div>
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span class="card-date">{{ formatDate(impact.creation) }}</span>
              <span v-if="impact.society" class="card-society">{{ impact.society }}</span>
            </div>
            <h3 class="card-title">{{ impact.title }}</h3>
            <p class="card-excerpt">{{ impact.excerpt }}</p>
            <div class="card-footer">
              <span class="read-more">Read more</span>
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Upcoming Events</h2>
          <p class="section-subtitle">Webinars, workshops, and learning sessions</p>
        </div>
        <a href="#" class="see-all-link">View calendar →</a>
      </div>

      <div v-if="events.length === 0" class="empty-state">
        <i class="fas fa-calendar"></i>
        <p>No upcoming events scheduled</p>
      </div>

      <div v-else class="events-list">
        <div 
          v-for="event in events.slice(0, 3)" 
          :key="event.name"
          class="event-item"
        >
          <div class="event-date">
            <div class="event-month">{{ formatMonth(event.start_date) }}</div>
            <div class="event-day">{{ formatDay(event.start_date) }}</div>
          </div>
          <div class="event-details">
            <h4 class="event-title">{{ event.title }}</h4>
            <p class="event-description">{{ event.description }}</p>
            <div class="event-meta">
              <span><i class="fas fa-clock"></i> {{ formatTime(event.start_date) }}</span>
              <span v-if="event.location"><i class="fas fa-map-marker-alt"></i> {{ event.location }}</span>
            </div>
          </div>
          <button class="btn-outline-small">Register</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  data() {
    return {
      totalSocieties: 0,
      totalResources: 0,
      newResourcesThisMonth: 0,
      upcomingEvents: 0,
      activeInitiatives: 0,
      impacts: [],
      events: []
    };
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      try {
        // Fetch impacts
        const impactsResponse = await frappe.call({
          method: 'frappe.client.get_list',
          args: {
            doctype: 'Local Impact',
            fields: ['name', 'title', 'excerpt', 'society', 'category', 'creation', 'image'],
            filters: { is_published: 1 },
            order_by: 'creation desc',
            limit: 6
          }
        });
        this.impacts = impactsResponse.message || [];

        // Fetch events
        const eventsResponse = await frappe.call({
          method: 'frappe.client.get_list',
          args: {
            doctype: 'Hub Event',
            fields: ['name', 'title', 'description', 'start_date', 'location'],
            filters: [
              ['is_published', '=', 1],
              ['start_date', '>', frappe.datetime.now_datetime()]
            ],
            order_by: 'start_date asc',
            limit: 3
          }
        });
        this.events = eventsResponse.message || [];

        // Fetch stats
        this.fetchStats();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        this.loadSampleData();
      }
    },
    async fetchStats() {
      try {
        const societiesCount = await frappe.call({
          method: 'frappe.client.get_count',
          args: { doctype: 'Society', filters: { is_active: 1 } }
        });
        this.totalSocieties = societiesCount.message || 0;

        const resourcesCount = await frappe.call({
          method: 'frappe.client.get_count',
          args: { doctype: 'Hub Publication', filters: { is_published: 1 } }
        });
        this.totalResources = resourcesCount.message || 0;

        const eventsCount = await frappe.call({
          method: 'frappe.client.get_count',
          args: {
            doctype: 'Hub Event',
            filters: [
              ['is_published', '=', 1],
              ['start_date', '>', frappe.datetime.now_datetime()]
            ]
          }
        });
        this.upcomingEvents = eventsCount.message || 0;
        
        this.activeInitiatives = 12; // Placeholder
        this.newResourcesThisMonth = 8; // Placeholder
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },
    loadSampleData() {
      // Sample data for testing
      this.totalSocieties = 10;
      this.totalResources = 156;
      this.newResourcesThisMonth = 8;
      this.upcomingEvents = 3;
      this.activeInitiatives = 12;
      
      this.impacts = [
        {
          name: 'impact-1',
          title: 'Mobile Health Clinics Reach 15,000 People',
          excerpt: 'Our mobile health program delivered primary healthcare to remote communities.',
          society: 'Kenya Red Cross',
          category: 'HEALTH',
          creation: new Date().toISOString(),
          image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800'
        }
      ];

      this.events = [
        {
          name: 'event-1',
          title: 'Financial Sustainability Workshop',
          description: 'Learn best practices for diversifying revenue streams',
          start_date: '2025-03-15 10:00:00',
          location: 'Virtual'
        }
      ];
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    formatMonth(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    },
    formatDay(dateString) {
      const date = new Date(dateString);
      return date.getDate();
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },
    getPlaceholderImage() {
      return '/assets/frappe/images/default-placeholder.png';
    },
    viewImpact(impactId) {
      console.log('Viewing impact:', impactId);
      // Navigate to impact detail
    },
    navigateToResources() {
      console.log('Navigate to resources');
    },
    navigateToExchange() {
      console.log('Navigate to peer exchange');
    },
    navigateToImpact() {
      console.log('Navigate to create impact');
    },
    navigateToEvents() {
      console.log('Navigate to create event');
    }
  }
};
</script>

<style scoped>
.dashboard-page {
  width: 100%;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-outline,
.btn-primary,
.btn-outline-small {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.875rem;
}

.btn-outline {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-outline:hover {
  border-color: #DC2626;
  color: #DC2626;
}

.btn-primary {
  background: #DC2626;
  color: white;
}

.btn-primary:hover {
  background: #B91C1C;
  transform: translateY(-1px);
}

.btn-outline-small {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 16px;
  transition: all 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon i {
  font-size: 1.5rem;
  color: white;
}

.stat-icon.red { background: #DC2626; }
.stat-icon.blue { background: #2563EB; }
.stat-icon.green { background: #16A34A; }
.stat-icon.purple { background: #9333EA; }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-change.positive {
  color: #16A34A;
}

/* Section */
.section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

.see-all-link {
  color: #DC2626;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.see-all-link:hover {
  color: #B91C1C;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #DC2626;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: #fee2e2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.action-icon i {
  font-size: 1.25rem;
  color: #DC2626;
}

.action-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.action-card p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.content-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.content-card:hover {
  border-color: #DC2626;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
  transform: translateY(-2px);
}

.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #DC2626;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.card-content {
  padding: 20px;
}

.card-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.75rem;
  color: #6b7280;
}

.card-society {
  color: #DC2626;
  font-weight: 600;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-excerpt {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #DC2626;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Events List */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.event-date {
  flex-shrink: 0;
  width: 64px;
  text-align: center;
  padding: 8px;
  background: #fee2e2;
  border-radius: 8px;
}

.event-month {
  font-size: 0.75rem;
  font-weight: 700;
  color: #DC2626;
}

.event-day {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.event-details {
  flex: 1;
}

.event-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.event-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.event-meta {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: #6b7280;
}

.event-meta i {
  margin-right: 4px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.empty-state i {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .event-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>