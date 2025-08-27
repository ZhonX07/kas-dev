const express = require('express')
const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

const router = express.Router()

// 确保DB目录存在
const dbDir = path.join(__dirname, '../DB')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// 获取或创建数据库文件
function getDatabase(submitTime) {
  const date = new Date(submitTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  
  // 查找同月份的数据库文件
  const files = fs.readdirSync(dbDir).filter(file => 
    file.startsWith(`${year}-${month}`) && file.endsWith('.db')
  )
  
  if (files.length > 0) {
    // 检查现有文件的记录数
    for (const file of files) {
      const tempDbPath = path.join(dbDir, file)
      try {
        const tempDb = new Database(tempDbPath, { readonly: true })
        const count = tempDb.prepare("SELECT COUNT(*) as count FROM reports").get()
        tempDb.close()
        
        if (count.count < 1500) {
          return { path: tempDbPath, isNew: false }
        }
      } catch (error) {
        // 如果表不存在，说明是新数据库
        return { path: tempDbPath, isNew: true }
      }
    }
    
    // 如果所有文件都满了，创建新文件
    const fileCount = files.length + 1
    const dbFileName = `${year}-${month}-${String(fileCount).padStart(2, '0')}.db`
    const dbPath = path.join(dbDir, dbFileName)
    return { path: dbPath, isNew: true }
  } else {
    // 创建第一个文件
    const dbFileName = `${year}-${month}-01.db`
    const dbPath = path.join(dbDir, dbFileName)
    return { path: dbPath, isNew: true }
  }
}

// 创建数据表
function createTable(db) {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      CLASS INTEGER NOT NULL,
      isadd BOOLEAN NOT NULL,
      changescore INTEGER NOT NULL,
      submittime INTEGER NOT NULL,
      note TEXT NOT NULL,
      submitter TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  
  db.exec(createTableSQL)
}

// 处理数据提交
router.post('/inputdata', (req, res) => {
  try {
    const { class: classNum, isadd, changescore, note, submitter } = req.body
    
    // 验证必需字段
    if (!classNum || isadd === undefined || !changescore || !note || !submitter) {
      return res.status(400).json({
        success: false,
        message: '缺少必需字段'
      })
    }
    
    // 生成时间戳
    const submittime = Date.now()
    
    // 获取数据库
    const dbInfo = getDatabase(submittime)
    const db = new Database(dbInfo.path)
    
    try {
      // 如果是新数据库，创建表
      if (dbInfo.isNew) {
        createTable(db)
      }
      
      // 插入数据
      const insertStmt = db.prepare(`
        INSERT INTO reports (CLASS, isadd, changescore, submittime, note, submitter)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      
      const result = insertStmt.run(
        parseInt(classNum),
        Boolean(isadd),
        parseInt(changescore),
        submittime,
        note,
        submitter
      )
      
      db.close()
      
      console.log(`数据已插入到 ${dbInfo.path}，记录ID: ${result.lastInsertRowid}`)
      
      res.json({
        success: true,
        message: '数据提交成功',
        id: result.lastInsertRowid,
        database: path.basename(dbInfo.path),
        submittime: submittime
      })
      
    } catch (error) {
      db.close()
      throw error
    }
    
  } catch (error) {
    console.error('数据提交错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

module.exports = router
      
      console.log(`数据已插入到 ${dbInfo.path}，记录ID: ${insertId}`)
      
      res.json({
        success: true,
        message: '数据提交成功',
        id: insertId,
        database: path.basename(dbInfo.path)
      })
      
    } catch (error) {
      db.close()
      throw error
    }
    
  } catch (error) {
    console.error('数据提交错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

module.exports = router
