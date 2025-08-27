<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>KLYZ Assessment System</h1>
      <div class="user-info">
        <span>欢迎使用系统</span>
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
    </header>
    
    <main class="dashboard-main">
      <div class="dashboard-content">
        <div class="welcome-card">
          <h2>欢迎来到仪表板</h2>
          <p>您已成功通过TOTP验证登录系统。</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>系统状态</h3>
            <p class="stat-value">正常运行</p>
          </div>
          
          <div class="stat-card">
            <h3>在线用户</h3>
            <p class="stat-value">1</p>
          </div>
          
          <div class="stat-card">
            <h3>最后登录</h3>
            <p class="stat-value">{{ currentTime }}</p>
          </div>
        </div>
        
        <div class="actions-section">
          <h3>快速操作</h3>
          <div class="action-buttons">
            <button class="action-btn primary">开始评估</button>
            <button class="action-btn secondary">查看历史</button>
            <button class="action-btn secondary">系统设置</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN')
}

const logout = () => {
  // 清除可能的登录状态
  router.push('/login')
}

onMounted(() => {
  updateTime()
  // 每分钟更新一次时间
  setInterval(updateTime, 60000)
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'HarmonyOS Sans SC', 'Jetbrains Mono', sans-serif;
}

.dashboard-header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info span {
  color: #666;
  font-size: 0.9rem;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c0392b;
}

.dashboard-main {
  padding: 2rem;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.welcome-card h2 {
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
}

.welcome-card p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  font-family: 'Jetbrains Mono', monospace;
}

.actions-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions-section h3 {
  color: #333;
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e9ecef;
}

.action-btn.secondary:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>