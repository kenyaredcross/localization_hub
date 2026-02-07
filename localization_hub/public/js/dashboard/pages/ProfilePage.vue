<template>
  <div class="page-container">
    <div class="page-content">
      <h2 class="page-title">Profile</h2>
      
      <div class="profile-section">
        <div class="profile-header">
          <div class="profile-avatar">
            {{ userInitials }}
          </div>
          <div class="profile-info">
            <h3>{{ userName }}</h3>
            <p>{{ userEmail }}</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Full Name</span>
            <span class="info-value">{{ userName }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ userEmail }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Role</span>
            <span class="info-value">User</span>
          </div>

          <div class="info-item">
            <span class="info-label">Member Since</span>
            <span class="info-value">{{ currentDate }}</span>
          </div>
        </div>

        <button class="edit-button">Edit Profile</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  
  props: {
    userName: {
      type: String,
      default: 'User'
    },
    userEmail: {
      type: String,
      default: 'user@example.com'
    }
  },

  computed: {
    userInitials() {
      return this.userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
    currentDate() {
      return new Date().toLocaleDateString();
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

.page-content {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #2e3338;
  margin-bottom: 30px;
}

.profile-section {
  max-width: 600px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e8ebed;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #d63939;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
}

.profile-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2e3338;
  margin-bottom: 4px;
}

.profile-info p {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

.info-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #6c757d;
  text-transform: uppercase;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  color: #2e3338;
  font-weight: 500;
}

.edit-button {
  padding: 12px 24px;
  background: #d63939;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button:hover {
  background: #c02929;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(214, 57, 57, 0.3);
}
</style>