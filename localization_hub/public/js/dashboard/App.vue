<template>
  <div class="dashboard-container">
    <!-- Sidebar - Fixed, Always Visible -->
    <div class="sidebar">
      <!-- Sidebar Header with Dropdown -->
      <div class="sidebar-header-container">
        <div class="sidebar-header" @click="toggleDropdown">
          <div class="header-content">
            <div class="app-logo">🌍</div>
            <div class="header-text">
              <div class="app-name">LocalizationHub</div>
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
              <span class="dropdown-icon-item">👤</span>
              <span>{{ t('Profile') }}</span>
            </a>
            
            <div class="dropdown-divider"></div>
            
            <a 
              href="#"
              @click.prevent="logout"
              class="dropdown-item"
            >
              <span class="dropdown-icon-item">🚪</span>
              <span>{{ t('Log out') }}</span>
            </a>
          </div>
        </transition>
      </div>
      
      <!-- Sidebar Menu -->
      <div class="sidebar-menu">
        <!-- Dashboard Home -->
        <a 
          href="#"
          @click.prevent="currentPage = 'dashboard'"
          class="sidebar-item"
          :class="{ active: currentPage === 'dashboard' }"
        >
          <span class="sidebar-icon">📊</span>
          <span class="sidebar-label">{{ t('Dashboard') }}</span>
        </a>

        <!-- Data -->
        <a 
          href="#"
          @click.prevent="currentPage = 'data'"
          class="sidebar-item"
          :class="{ active: currentPage === 'data' }"
        >
          <span class="sidebar-icon">💼</span>
          <span class="sidebar-label">{{ t('Data') }}</span>
        </a>

        <!-- Publication -->
        <a 
          href="#"
          @click.prevent="currentPage = 'publication'"
          class="sidebar-item"
          :class="{ active: currentPage === 'publication' }"
        >
          <span class="sidebar-icon">📦</span>
          <span class="sidebar-label">{{ t('Publication') }}</span>
        </a>

        <!-- Events -->
        <a 
          href="#"
          @click.prevent="currentPage = 'events'"
          class="sidebar-item"
          :class="{ active: currentPage === 'events' }"
        >
          <span class="sidebar-icon">📅</span>
          <span class="sidebar-label">{{ t('Events') }}</span>
        </a>

        <!-- Emergency -->
        <a 
          href="#"
          @click.prevent="currentPage = 'emergency'"
          class="sidebar-item"
          :class="{ active: currentPage === 'emergency' }"
        >
          <span class="sidebar-icon">🎫</span>
          <span class="sidebar-label">{{ t('Emergency') }}</span>
        </a>

        <div class="sidebar-divider"></div>

        <!-- External Links -->
        <a href="/raven" class="sidebar-item">
          <span class="sidebar-icon">💬</span>
          <span class="sidebar-label">{{ t('Raven') }}</span>
        </a>
        
        <a href="/lms" class="sidebar-item">
          <span class="sidebar-icon">📚</span>
          <span class="sidebar-label">{{ t('Learning') }}</span>
        </a>
        
        <a href="/app" class="sidebar-item">
          <span class="sidebar-icon">🏠</span>
          <span class="sidebar-label">{{ t('Desk') }}</span>
        </a>

        <a href="#" class="sidebar-item">
          <span class="sidebar-icon">❓</span>
          <span class="sidebar-label">{{ t('Help Desk') }}</span>
        </a>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Top Bar with Language Toggle - Always Visible -->
      <div class="top-bar">
        <!-- Welcome message - only on dashboard -->
        <h1 v-if="currentPage === 'dashboard'">
          {{ t('Welcome back') }}, <span class="user-name">{{ userName }}</span>!
        </h1>
        <!-- Page title - on other pages -->
        <h1 v-else class="page-title">{{ t(getPageTitle()) }}</h1>
        
        <!-- Language Toggle - Always visible -->
        <div class="language-toggle-wrapper">
          <div class="language-toggle" @click="toggleLanguageDropdown">
            <span class="lang-icon">🌐</span>
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
              <div class="language-dropdown-header">{{ t('Select Language') }}</div>
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
                <span v-if="lang.code === currentLanguage.code" class="checkmark">✓</span>
              </a>
            </div>
          </transition>
        </div>
      </div>
      
      <!-- Scrollable Content Area - Different components load here -->
      <div class="content-area">
        <!-- Load different page components based on currentPage -->
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
// Import all page components
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
      currentLanguage: { code: 'en', name: 'English', flag: '🇬🇧', shortName: 'EN' },
      
      // Built-in translations
      translations: {
        en: {
          'Welcome back': 'Welcome back',
          'Dashboard': 'Dashboard',
          'Data': 'Data',
          'Publication': 'Publication',
          'Events': 'Events',
          'Emergency': 'Emergency',
          'Raven': 'Raven',
          'Learning': 'Learning',
          'Desk': 'Desk',
          'Help Desk': 'Help Desk',
          'Profile': 'Profile',
          'Log out': 'Log out',
          'Select Language': 'Select Language',
          'Switching language...': 'Switching language...',
          'Language changed successfully': 'Language changed successfully',
          'Failed to change language': 'Failed to change language'
        },
        fr: {
          'Welcome back': 'Bon retour',
          'Dashboard': 'Tableau de bord',
          'Opportunities': 'Opportunités',
          'Deployments': 'Déploiements',
          'Events': 'Événements',
          'Membership': 'Adhésion',
          'Raven': 'Raven',
          'Learning': 'Apprentissage',
          'Desk': 'Bureau',
          'Help Desk': "Centre d'aide",
          'Profile': 'Profil',
          'Log out': 'Se déconnecter',
          'Select Language': 'Choisir la langue',
          'Switching language...': 'Changement de langue...',
          'Language changed successfully': 'Langue changée avec succès',
          'Failed to change language': 'Échec du changement de langue'
        },
        ar: {
          'Welcome back': 'مرحبا بك',
          'Dashboard': 'لوحة القيادة',
          'Opportunities': 'الفرص',
          'Deployments': 'عمليات النشر',
          'Events': 'الأحداث',
          'Membership': 'العضوية',
          'Raven': 'الغراب',
          'Learning': 'التعلم',
          'Desk': 'المكتب',
          'Help Desk': 'مكتب المساعدة',
          'Profile': 'الملف الشخصي',
          'Log out': 'تسجيل الخروج',
          'Select Language': 'اختر اللغة',
          'Switching language...': 'جاري تبديل اللغة...',
          'Language changed successfully': 'تم تغيير اللغة بنجاح',
          'Failed to change language': 'فشل تغيير اللغة'
        },
        sw: {
          'Welcome back': 'Karibu tena',
          'Dashboard': 'Dashibodi',
          'Opportunities': 'Fursa',
          'Deployments': 'Utumiaji',
          'Events': 'Matukio',
          'Membership': 'Uanachama',
          'Raven': 'Raven',
          'Learning': 'Kujifunza',
          'Desk': 'Dawati',
          'Help Desk': 'Dawati la Msaada',
          'Profile': 'Wasifu',
          'Log out': 'Toka',
          'Select Language': 'Chagua Lugha',
          'Switching language...': 'Inabadilisha lugha...',
          'Language changed successfully': 'Lugha imebadilishwa',
          'Failed to change language': 'Imeshindwa kubadilisha lugha'
        },
        pt: {
          'Welcome back': 'Bem-vindo de volta',
          'Dashboard': 'Painel',
          'Opportunities': 'Oportunidades',
          'Deployments': 'Implantações',
          'Events': 'Eventos',
          'Membership': 'Associação',
          'Raven': 'Raven',
          'Learning': 'Aprendizagem',
          'Desk': 'Secretária',
          'Help Desk': 'Central de Ajuda',
          'Profile': 'Perfil',
          'Log out': 'Sair',
          'Select Language': 'Selecionar Idioma',
          'Switching language...': 'Mudando idioma...',
          'Language changed successfully': 'Idioma alterado com sucesso',
          'Failed to change language': 'Falha ao alterar idioma'
        }
      }
    }
  },
  
  methods: {
    // Translation helper - uses built-in translations first, falls back to Frappe
    t(text) {
      const lang = this.currentLanguage.code;
      
      // Try built-in translations first
      if (this.translations[lang] && this.translations[lang][text]) {
        return this.translations[lang][text];
      }
      
      // Fall back to Frappe translation if available
      if (window.frappe && window.__) {
        return window.__(text);
      }
      
      // Return original text if no translation found
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
      const pageTitles = {
        'dashboard': 'Dashboard',
        'data': 'Data',
        'publication': 'Publication',
        'events': 'Events',
        'emergency': 'Emergency',
        'profile': 'Profile'
      };
      return pageTitles[this.currentPage] || 'Dashboard';
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
          message: this.t('Switching language...'),
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
                message: this.t('Language changed successfully'),
                indicator: 'green'
              });
              setTimeout(() => {
                location.reload();
              }, 800);
            }
          },
          error: () => {
            frappe.show_alert({
              message: this.t('Failed to change language'),
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
      
      const userLang = frappe.boot.user.language || 'en';
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
/* Main Container - FIXED 100vw x 100vh */
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

/* ============================================
   SIDEBAR - Professional & Compact
   ============================================ */
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
  z-index: 10;
}

.sidebar-header-container {
  position: relative;
  margin-bottom: 16px;
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

/* Dropdown Menu */
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  z-index: 1000;
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
  font-size: 16px;
  width: 18px;
  text-align: center;
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
  margin: 0 0;
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
  font-size: 18px;
  width: 20px;
  text-align: center;
  opacity: 0.9;
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

/* ============================================
   MAIN CONTENT AREA
   ============================================ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Top Bar - Floating Professional Card */
.top-bar {
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
  direction: ltr;
}

.top-bar h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

.top-bar .page-title {
  font-size: 20px;
  color: #1a1d1f;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.user-name {
  color: #d63939;
  font-weight: 600;
}

/* Language Toggle Wrapper */
.language-toggle-wrapper {
  position: relative;
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

.lang-icon {
  font-size: 16px;
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
  box-shadow: 0 4px 16px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
  min-width: 200px;
  z-index: 1000;
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
  position: relative;
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

/* Content Area - Scrollable */
.content-area {
  flex: 1;
  background: #f5f7fa;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 24px 40px 24px;
}

/* ============================================
   RESPONSIVE
   ============================================ */
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

  .top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    margin: 12px 16px 0 16px;
  }

  .top-bar h1 {
    font-size: 20px;
  }

  .top-bar .page-title {
    font-size: 18px;
  }
}
</style>