const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8080

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 初始化路由
const router = express.Router()
app.use(router)

// 导入路由
const authRouter = require('./API/auth')
const inputdataRouter = require('./API/inputdata')

// 使用路由
app.use('/api', authRouter)
app.use('/api', inputdataRouter)

// 调试：打印所有注册的路由
if (app._router) {
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log('已注册路由:', r.route.path)
    }
  })
}

// 根路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'KAS Backend Server Running',
    version: '1.0.0',
    endpoints: [
      'POST /api/login - TOTP登录验证',
      'POST /api/inputdata - 提交通报数据'
    ]
  })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack)
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`KAS Backend Server 运行在端口 ${PORT}`)
  console.log(`API端点: http://localhost:${PORT}/api/inputdata`)
})