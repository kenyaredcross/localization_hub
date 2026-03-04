<template>
  <div class="app-wrapper">
    <!-- Sidebar Navigation -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-hand-holding-heart"></i>
          <span v-if="!sidebarCollapsed">Localisation Hub</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <a 
            href="#" 
            @click.prevent="navigateTo('dashboard')"
            class="nav-item"
            :class="{ active: currentPage === 'dashboard' }"
          >
            <i class="fas fa-th-large"></i>
            <span v-if="!sidebarCollapsed">My Dashboard</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="navigateTo('resources')"
            class="nav-item"
            :class="{ active: currentPage === 'resources' }"
          >
            <i class="fas fa-book-open"></i>
            <span v-if="!sidebarCollapsed">Resources</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="navigateTo('peer-exchange')"
            class="nav-item"
            :class="{ active: currentPage === 'peer-exchange' }"
          >
            <i class="fas fa-users"></i>
            <span v-if="!sidebarCollapsed">Peer Exchange</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="navigateTo('community-insights')"
            class="nav-item"
            :class="{ active: currentPage === 'community-insights' }"
          >
            <i class="fas fa-chart-line"></i>
            <span v-if="!sidebarCollapsed">Community Insights</span>
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title" v-if="!sidebarCollapsed">Pillars</div>
          
          <a 
            href="#" 
            @click.prevent="navigateTo('leadership')"
            class="nav-item pillar-purple"
            :class="{ active: currentPage === 'leadership' }"
          >
            <i class="fas fa-crown"></i>
            <span v-if="!sidebarCollapsed">Leadership</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="navigateTo('branches')"
            class="nav-item pillar-red"
            :class="{ active: currentPage === 'branches' }"
          >
            <i class="fas fa-sitemap"></i>
            <span v-if="!sidebarCollapsed">Branches</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="navigateTo('resource-mobilisation')"
            class="nav-item pillar-blue"
            :class="{ active: currentPage === 'resource-mobilisation' }"
          >
            <i class="fas fa-chart-bar"></i>
            <span v-if="!sidebarCollapsed">Resources</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="navigateTo('finance')"
            class="nav-item pillar-green"
            :class="{ active: currentPage === 'finance' }"
          >
            <i class="fas fa-coins"></i>
            <span v-if="!sidebarCollapsed">Finance</span>
          </a>
        </div>

        <div class="nav-section">
          <a 
            href="#" 
            @click.prevent="navigateTo('events')"
            class="nav-item"
            :class="{ active: currentPage === 'events' }"
          >
            <i class="fas fa-calendar"></i>
            <span v-if="!sidebarCollapsed">Events</span>
          </a>
          
          <a 
            href="#" 
            @click.prevent="navigateTo('feedback')"
            class="nav-item"
            :class="{ active: currentPage === 'feedback' }"
          >
            <i class="fas fa-comment"></i>
            <span v-if="!sidebarCollapsed">Feedback</span>
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" v-if="!sidebarCollapsed">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-details">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
        </div>
        
        <button @click="toggleSidebar" class="collapse-btn">
          <i class="fas" :class="sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Top Bar -->
      <div class="top-bar">
        <div class="top-bar-left">
          <a href="/" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Back to homepage
          </a>
        </div>
        
        <div class="top-bar-right">
          <div class="user-menu">
            <div class="user-avatar-small">{{ userInitials }}</div>
            <span class="user-name-top">{{ userName }}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="content-wrapper">
        <component :is="currentPageComponent" />
      </div>
    </main>
  </div>
</template>

<script>
import DashboardPage from './DashboardPage.vue';

export default {
  name: 'App',
  components: {
    DashboardPage
  },
  data() {
    return {
      currentPage: 'dashboard',
      sidebarCollapsed: false,
      userName: 'User Name',
      userRole: 'National Society Member',
      userInitials: 'UN'
    };
  },
  computed: {
    currentPageComponent() {
      const pages = {
        'dashboard': 'DashboardPage',
        // Add more page components as needed
      };
      return pages[this.currentPage] || 'DashboardPage';
    }
  },
  mounted() {
    this.loadUserInfo();
  },
  methods: {
    navigateTo(page) {
      this.currentPage = page;
      // Scroll to top when navigating
      window.scrollTo(0, 0);
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    loadUserInfo() {
      // Load user info from Frappe
      if (window.frappe && window.frappe.session) {
        this.userName = window.frappe.session.user_fullname || 'User';
        this.userInitials = this.getInitials(this.userName);
      }
    },
    getInitials(name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
  }
};
</script>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.logo i {
  font-size: 1.5rem;
  color: #DC2626;
  flex-shrink: 0;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section-title {
  padding: 8px 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px;
}

.nav-item i {
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.nav-item:hover {
  background: #f9fafb;
  color: #DC2626;
}

.nav-item.active {
  background: #fee2e2;
  color: #DC2626;
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #DC2626;
}

/* Pillar colors */
.nav-item.pillar-purple:hover,
.nav-item.pillar-purple.active {
  background: #f3e8ff;
  color: #9333EA;
}

.nav-item.pillar-purple.active::before {
  background: #9333EA;
}

.nav-item.pillar-red:hover,
.nav-item.pillar-red.active {
  background: #fee2e2;
  color: #DC2626;
}

.nav-item.pillar-red.active::before {
  background: #DC2626;
}

.nav-item.pillar-blue:hover,
.nav-item.pillar-blue.active {
  background: #dbeafe;
  color: #2563EB;
}

.nav-item.pillar-blue.active::before {
  background: #2563EB;
}

.nav-item.pillar-green:hover,
.nav-item.pillar-green.active {
  background: #dcfce7;
  color: #16A34A;
}

.nav-item.pillar-green.active::before {
  background: #16A34A;
}

.sidebar-footer {
  border-top: 1px solid #e5e7eb;
  padding: 16px 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #DC2626;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapse-btn {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: #f9fafb;
  color: #DC2626;
  border-color: #DC2626;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sidebar.collapsed + .main-content {
  margin-left: 80px;
}

/* Top Bar */
.top-bar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #DC2626;
}

.back-link i {
  font-size: 0.875rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-menu:hover {
  background: #f9fafb;
}

.user-avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #DC2626;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name-top {
  font-weight: 600;
  color: #111827;
}

/* Content Wrapper */
.content-wrapper {
  flex: 1;
  padding: 32px;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }
  
  .sidebar .logo span,
  .sidebar .nav-item span,
  .sidebar .nav-section-title,
  .sidebar .user-info {
    display: none;
  }
  
  .main-content {
    margin-left: 80px;
  }
  
  .content-wrapper {
    padding: 20px;
  }
}
</style>