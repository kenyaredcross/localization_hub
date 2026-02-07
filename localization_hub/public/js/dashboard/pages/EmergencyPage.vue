<template>
  <div class="page-container">
    <div class="page-content">
      <h2 class="page-title">Data</h2>
      
      <div class="empty-state">
        <div class="empty-icon">💼</div>
        <p class="empty-text">No data available</p>
        <p class="empty-subtext">Check back later</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataPage'
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: #d63939;
  margin-bottom: 8px;
}

.empty-subtext {
  color: #6c757d;
  font-size: 14px;
}
</style>