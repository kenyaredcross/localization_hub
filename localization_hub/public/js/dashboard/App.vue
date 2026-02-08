<template>
  <div class="dashboard-container">
    <!-- SVG Icon Definitions -->
    <svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
      <symbol id="icon-grid" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </symbol>
      <symbol id="icon-database" viewBox="0 0 24 24">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </symbol>
      <symbol id="icon-file-text" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </symbol>
      <symbol id="icon-calendar" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </symbol>
      <symbol id="icon-alert-circle" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </symbol>
      <symbol id="icon-message-square" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </symbol>
      <symbol id="icon-book-open" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </symbol>
      <symbol id="icon-home" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </symbol>
      <symbol id="icon-help-circle" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </symbol>
      <symbol id="icon-user" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </symbol>
      <symbol id="icon-log-out" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </symbol>
      <symbol id="icon-globe" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </symbol>
    </svg>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar Header with Dropdown -->
      <div class="sidebar-header-container">
        <div class="sidebar-header" @click="toggleDropdown">
          <div class="header-content">
            <div class="app-logo">🌍</div>
            <div class="header-text">
              <div class="app-name">{{ __("LocalizationHub") }}</div>
              <div class="user-info">{{ userName }}</div>
            </div>
          </div>
          <div class="dropdown-icon">
            <span class="chevron" :class="{ open: showDropdown }">▼</span>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <transition name="dropdown">
          <div v-if="showDropdown" class="dropdown-menu">
            <a 
              href="#"
              @click.prevent="navigateToProfile"
              class="dropdown-item"
            >
              <svg class="dropdown-icon-item">
                <use href="#icon-user"></use>
              </svg>
              <span>{{ __("Profile") }}</span>
            </a>
            
            <div class="dropdown-divider"></div>
            
            <a 
              href="#"
              @click.prevent="logout"
              class="dropdown-item"
            >
              <svg class="dropdown-icon-item">
                <use href="#icon-log-out"></use>
              </svg>
              <span>{{ __("Log out") }}</span>
            </a>
          </div>
        </transition>
      </div>
      
      <!-- Sidebar Menu -->
      <div class="sidebar-menu">
        <!-- Dashboard -->
        <a 
          href="#"
          @click.prevent="currentPage = 'dashboard'"
          class="sidebar-item"
          :class="{ active: currentPage === 'dashboard' }"
        >
          <svg class="sidebar-icon">
            <use href="#icon-grid"></use>
          </svg>
          <span class="sidebar-label">{{ __("Dashboard") }}</span>
        </a>

        <!-- Data -->
        <a 
          href="#"
          @click.prevent="currentPage = 'data'"
          class="sidebar-item"
          :class="{ active: currentPage === 'data' }"
        >
          <svg class="sidebar-icon">
            <use href="#icon-database"></use>
          </svg>
          <span class="sidebar-label">{{ __("Data") }}</span>
        </a>

        <!-- Publication -->
        <a 
          href="#"
          @click.prevent="currentPage = 'publication'"
          class="sidebar-item"
          :class="{ active: currentPage === 'publication' }"
        >
          <svg class="sidebar-icon">
            <use href="#icon-file-text"></use>
          </svg>
          <span class="sidebar-label">{{ __("Publication") }}</span>
        </a>

        <!-- Events -->
        <a 
          href="#"
          @click.prevent="currentPage = 'events'"
          class="sidebar-item"
          :class="{ active: currentPage === 'events' }"
        >
          <svg class="sidebar-icon">
            <use href="#icon-calendar"></use>
          </svg>
          <span class="sidebar-label">{{ __("Events") }}</span>
        </a>

        <!-- Emergency -->
        <a 
          href="#"
          @click.prevent="currentPage = 'emergency'"
          class="sidebar-item"
          :class="{ active: currentPage === 'emergency' }"
        >
          <svg class="sidebar-icon">
            <use href="#icon-alert-circle"></use>
          </svg>
          <span class="sidebar-label">{{ __("Emergency") }}</span>
        </a>

        <div class="sidebar-divider"></div>

        <!-- External Links -->
        <a href="/raven" class="sidebar-item">
          <svg class="sidebar-icon">
            <use href="#icon-message-square"></use>
          </svg>
          <span class="sidebar-label">{{ __("Raven") }}</span>
        </a>
        
        <a href="/lms" class="sidebar-item">
          <svg class="sidebar-icon">
            <use href="#icon-book-open"></use>
          </svg>
          <span class="sidebar-label">{{ __("Learning") }}</span>
        </a>
        
        <a href="/app" class="sidebar-item">
          <svg class="sidebar-icon">
            <use href="#icon-home"></use>
          </svg>
          <span class="sidebar-label">{{ __("Desk") }}</span>
        </a>

        <a href="#" class="sidebar-item">
          <svg class="sidebar-icon">
            <use href="#icon-help-circle"></use>
          </svg>
          <span class="sidebar-label">{{ __("Help Desk") }}</span>
        </a>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Welcome Banner - ONLY on dashboard page -->
      <div v-if="currentPage === 'dashboard'" class="welcome-banner">
        <h1>{{ __("Welcome back") }}, <span class="user-name">{{ userName }}</span>!</h1>
        
        <!-- Language Toggle -->
        <div class="language-toggle-wrapper">
          <div class="language-toggle" @click="toggleLanguageDropdown">
            <svg class="lang-icon-svg">
              <use href="#icon-globe"></use>
            </svg>
            <span class="lang-text">{{ currentLanguage.shortName }}</span>
            <svg 
              class="lang-chevron" 
              :class="{ open: showLanguageDropdown }"
              width="12" 
              height="12" 
              viewBox="0 0 16 16" 
              fill="none"
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- Language Dropdown -->
          <transition name="lang-dropdown">
            <div v-if="showLanguageDropdown" class="language-dropdown">
              <div class="language-dropdown-header">{{ __("Select Language") }}</div>

              <a
                v-for="lang in languages"
                :key="lang.code"
                href="#"
                @click.prevent="changeLanguage(lang)"
                class="language-option"
                :class="{ active: lang.code === currentLanguage.code }"
              >
                <span class="lang-flag">{{ lang.flag }}</span>
                <span class="lang-name">{{ lang.name }}</span>
                <span
                  v-if="lang.code === currentLanguage.code"
                  class="checkmark"
                >✓</span>
              </a>
            </div>
          </transition>
        </div>
      </div>

      <!-- Page Title Bar - For OTHER pages (not dashboard) -->
      <div v-else class="page-title-bar">
        <h1 class="page-title">{{ __(getPageTitle()) }}</h1>
        
        <!-- Language Toggle -->
        <div class="language-toggle-wrapper">
          <div class="language-toggle" @click="toggleLanguageDropdown">
            <svg class="lang-icon-svg">
              <use href="#icon-globe"></use>
            </svg>
            <span class="lang-text">{{ currentLanguage.shortName }}</span>
            <svg 
              class="lang-chevron" 
              :class="{ open: showLanguageDropdown }"
              width="12" 
              height="12" 
              viewBox="0 0 16 16" 
              fill="none"
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- Language Dropdown -->
          <transition name="lang-dropdown">
            <div v-if="showLanguageDropdown" class="language-dropdown">
              <div class="language-dropdown-header">{{ __("Select Language") }}</div>

              <a
                v-for="lang in languages"
                :key="lang.code"
                href="#"
                @click.prevent="changeLanguage(lang)"
                class="language-option"
                :class="{ active: lang.code === currentLanguage.code }"
              >
                <span class="lang-flag">{{ lang.flag }}</span>
                <span class="lang-name">{{ lang.name }}</span>
                <span
                  v-if="lang.code === currentLanguage.code"
                  class="checkmark"
                >✓</span>
              </a>
            </div>
          </transition>
        </div>
      </div>
      
      <!-- Scrollable Content Area -->
      <div class="content-area">
        <DashboardPage v-if="currentPage === 'dashboard'" />
        <ProfilePage v-if="currentPage === 'profile'" :user-name="userName" :user-email="userEmail" />
        <DataPage v-if="currentPage === 'data'" />
        <PublicationPage v-if="currentPage === 'publication'" />
        <EventsPage v-if="currentPage === 'events'" />
        <EmergencyPage v-if="currentPage === 'emergency'" />
      </div>
    </div>
  </div>
</template>

<script>
import DashboardPage from './pages/DashboardPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import DataPage from './pages/DataPage.vue';
import PublicationPage from './pages/PublicationPage.vue';
import EventsPage from './pages/EventsPage.vue';
import EmergencyPage from './pages/EmergencyPage.vue';

export default {
  name: 'DashboardApp',
  
  components: {
    DashboardPage,
    ProfilePage,
    DataPage,
    PublicationPage,
    EventsPage,
    EmergencyPage
  },
  
  data() {
    return {
      currentPage: 'dashboard',
      userName: 'User',
      userEmail: 'user@example.com',
      showDropdown: false,
      showLanguageDropdown: false,
      languages: [
        { code: 'en', name: 'English', flag: '🇬🇧', shortName: 'EN' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦', shortName: 'AR' },
        { code: 'fr', name: 'Français', flag: '🇫🇷', shortName: 'FR' },
        { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', shortName: 'SW' },
        { code: 'pt', name: 'Português', flag: '🇵🇹', shortName: 'PT' }
      ],
      currentLanguage: { code: 'en', name: 'English', flag: '🇬🇧', shortName: 'EN' }
    }
  },
  
  methods: {
    // Frappe translation helper
    __(text) {
      if (window.__ && typeof window.__ === 'function') {
        return window.__(text);
      }
      return text;
    },

    toggleDropdown(e) {
      e.stopPropagation();
      this.showDropdown = !this.showDropdown;
      this.showLanguageDropdown = false;
    },
    
    toggleLanguageDropdown(e) {
      e.stopPropagation();
      this.showLanguageDropdown = !this.showLanguageDropdown;
      this.showDropdown = false;
    },
    
    navigateToProfile() {
      this.currentPage = 'profile';
      this.showDropdown = false;
    },
    
    logout() {
      if (window.frappe) {
        frappe.app.logout();
      }
    },

    closeDropdowns() {
      this.showDropdown = false;
      this.showLanguageDropdown = false;
    },

    getPageTitle() {
      const titles = {
        'dashboard': 'Dashboard',
        'data': 'Data',
        'publication': 'Publication',
        'events': 'Events',
        'emergency': 'Emergency',
        'profile': 'Profile'
      };
      return titles[this.currentPage] || 'Dashboard';
    },

    changeLanguage(lang) {
      if (lang.code === this.currentLanguage.code) {
        this.showLanguageDropdown = false;
        return;
      }

      this.currentLanguage = lang;
      this.showLanguageDropdown = false;

      if (window.frappe) {
        frappe.show_alert({
          message: this.__('Switching language...'),
          indicator: 'blue'
        });

        frappe.call({
          method: 'frappe.client.set_value',
          args: {
            doctype: 'User',
            name: frappe.session.user,
            fieldname: 'language',
            value: lang.code
          },
          callback: (response) => {
            if (response.message) {
              frappe.show_alert({
                message: this.__('Language changed successfully'),
                indicator: 'green'
              });
              setTimeout(() => {
                location.reload();
              }, 800);
            }
          },
          error: () => {
            frappe.show_alert({
              message: this.__('Failed to change language'),
              indicator: 'red'
            });
          }
        });
      }
    }
  },
  
  mounted() {
    if (window.frappe && frappe.session) {
      this.userName = frappe.session.user_fullname || frappe.session.user;
      this.userEmail = frappe.session.user;
      
      const userLang = frappe.boot?.user?.language || 'en';
      const foundLang = this.languages.find(l => l.code === userLang);
      if (foundLang) {
        this.currentLanguage = foundLang;
      }
    }

    document.addEventListener('click', this.closeDropdowns);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdowns);
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f5f7fa;
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
}

/* SIDEBAR */
.sidebar {
  width: 200px;
  background: #fafbfc;
  border-right: 1px solid #f0f1f3;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.sidebar-header-container {
  position: relative;
  margin-bottom: 16px;
  z-index: 1002;
}

.sidebar-header {
  padding: 12px 16px 16px 16px;
  border-bottom: 1px solid #f0f1f3;
  cursor: pointer;
  transition: background 0.15s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 8px 16px 8px;
  border-radius: 8px;
}

.sidebar-header:hover {
  background: #f5f6f7;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.header-text {
  flex: 1;
}

.app-logo {
  font-size: 24px;
}

.app-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1d1f;
  letter-spacing: -0.01em;
}

.user-info {
  font-size: 11px;
  color: #6f767e;
  margin-top: 2px;
  font-weight: 500;
}

.dropdown-icon {
  display: flex;
  align-items: center;
  color: #6f767e;
  margin-left: 8px;
}

.chevron {
  transition: transform 0.2s;
  color: #6f767e;
  font-size: 10px;
  display: inline-block;
}

.chevron.open {
  transform: rotate(180deg);
}

/* Dropdown Menu - Fixed positioning */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 8px;
  right: 8px;
  background: white;
  border: 1px solid #f0f1f3;
  border-radius: 10px;
  margin-top: 8px;
  padding: 6px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08);
  z-index: 2000;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  color: #33383f;
  text-decoration: none;
  transition: background 0.15s ease;
  cursor: pointer;
  font-size: 13px;
  border-radius: 6px;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #f5f6f7;
}

.dropdown-icon-item {
  width: 16px;
  height: 16px;
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
  flex-shrink: 0;
}

.dropdown-divider {
  height: 1px;
  background: #f0f1f3;
  margin: 4px 0;
}

/* Sidebar Menu */
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: #33383f;
  transition: all 0.15s ease;
  cursor: pointer;
  font-size: 13px;
}

.sidebar-item:hover {
  background: #f0f1f3;
  transform: translateX(2px);
}

.sidebar-item.active {
  background: #fff0f0;
  color: #d63939;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(214, 57, 57, 0.1);
}

.sidebar-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
  flex-shrink: 0;
}

.sidebar-label {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.sidebar-divider {
  height: 1px;
  background: #f0f1f3;
  margin: 10px 8px;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Welcome Banner - Only dashboard */
.welcome-banner {
  background: white;
  padding: 20px 28px;
  margin: 16px 24px 0 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #f0f1f3;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-banner h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

/* Page Title Bar - Other pages */
.page-title-bar {
  background: white;
  padding: 20px 28px;
  margin: 16px 24px 0 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #f0f1f3;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 20px;
  color: #1a1d1f;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
}

.user-name {
  color: #d63939;
  font-weight: 600;
}

/* Language Toggle */
.language-toggle-wrapper {
  position: relative;
  z-index: 1001;
}

.language-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #d63939;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 600;
  user-select: none;
  box-shadow: 0 1px 2px rgba(214, 57, 57, 0.15);
}

.language-toggle:hover {
  background: #c02d2d;
  box-shadow: 0 2px 4px rgba(214, 57, 57, 0.25);
  transform: translateY(-1px);
}

.lang-icon-svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
}

.lang-text {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.lang-chevron {
  transition: transform 0.2s;
  opacity: 0.8;
}

.lang-chevron.open {
  transform: rotate(180deg);
}

/* Language Dropdown */
.language-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: white;
  border: 1px solid #f0f1f3;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08);
  min-width: 200px;
  z-index: 2000;
  overflow: hidden;
}

.language-dropdown-header {
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  color: #6f767e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f0f1f3;
  background: #fafbfc;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #33383f;
  text-decoration: none;
  transition: all 0.15s;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}

.language-option:hover {
  background: #f5f6f7;
}

.language-option.active {
  background: #fff5f5;
  color: #d63939;
  font-weight: 600;
}

.lang-flag {
  font-size: 18px;
  width: 22px;
  text-align: center;
}

.lang-name {
  flex: 1;
  font-size: 13px;
}

.checkmark {
  color: #d63939;
  font-weight: bold;
  font-size: 14px;
}

.lang-dropdown-enter-active,
.lang-dropdown-leave-active {
  transition: all 0.2s ease;
}

.lang-dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.lang-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Content Area */
.content-area {
  flex: 1;
  background: #f5f7fa;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 24px 40px 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }
  
  .sidebar-label,
  .app-name,
  .user-info {
    display: none;
  }
  
  .header-text {
    display: none;
  }
  
  .sidebar-header {
    justify-content: center;
  }
  
  .content-area {
    padding: 20px;
  }

  .welcome-banner,
  .page-title-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    margin: 12px 16px 0 16px;
  }

  .welcome-banner h1,
  .page-title {
    font-size: 20px;
  }
}
</style>
