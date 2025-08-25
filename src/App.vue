<template>
  <div id="app">
    <header>
      <h1>KAS App</h1>
      <p>基于 Vue 3 + Electron 的桌面应用</p>
    </header>
    
    <main>
      <div class="content">
        <h2>欢迎使用 KAS App</h2>
        <p>这是一个使用 Vue 3 和 Electron 构建的桌面应用程序。</p>
        
        <div class="features">
          <div class="feature-card">
            <h3>Vue 3</h3>
            <p>现代化的前端框架</p>
          </div>
          <div class="feature-card">
            <h3>Electron</h3>
            <p>跨平台桌面应用开发</p>
          </div>
          <div class="feature-card">
            <h3>Vite</h3>
            <p>快速的构建工具</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log('Vue 应用已启动')
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  text-align: center;
  color: white;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

main {
  padding: 2rem;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.content h2 {
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.content > p {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #6c757d;
  font-size: 0.9rem;
}
</style>