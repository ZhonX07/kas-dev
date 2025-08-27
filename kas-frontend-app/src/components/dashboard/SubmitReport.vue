<template>
  <div class="submit-report-container">
    <div class="submit-header">
      <h2>提交通报</h2>
      <p>请填写通报信息，所有字段均为必填</p>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="report-form">
        <div class="form-row">
          <!-- 班级选择 -->
          <div class="form-group">
            <label for="class">班级</label>
            <select 
              id="class" 
              v-model="formData.class" 
              required
              :disabled="submitting"
            >
              <option value="">请选择班级</option>
              <option 
                v-for="classItem in classList" 
                :key="classItem.class" 
                :value="classItem.class"
              >
                {{ classItem.class }}班 - {{ classItem.headteacher }}
              </option>
            </select>
          </div>

          <!-- 通报类型 -->
          <div class="form-group">
            <label for="reportType">通报类型</label>
            <select 
              id="reportType" 
              v-model="formData.reportType" 
              required
              :disabled="submitting"
            >
              <option value="">请选择通报类型</option>
              <option 
                v-for="type in reportTypes" 
                :key="type.value" 
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <!-- 分数变动 -->
          <div class="form-group">
            <label for="scoreChange">分数变动</label>
            <input 
              id="scoreChange" 
              v-model.number="formData.scoreChange" 
              type="number" 
              min="-20" 
              max="20" 
              step="1"
              placeholder="输入分数变动（-20到+20）"
              required
              :disabled="submitting"
            />
            <small class="field-hint">
              负数表示扣分，正数表示加分
            </small>
          </div>

          <!-- 时间 -->
          <div class="form-group">
            <label for="reportTime">时间</label>
            <input 
              id="reportTime" 
              v-model="formData.reportTime" 
              type="datetime-local" 
              required
              :disabled="submitting"
            />
          </div>
        </div>

        <!-- 备注 -->
        <div class="form-group full-width">
          <label for="remark">备注</label>
          <textarea 
            id="remark" 
            v-model="formData.remark" 
            rows="4"
            placeholder="请详细描述通报事由..."
            required
            :disabled="submitting"
          ></textarea>
          <small class="field-hint">
            {{ formData.remark.length }}/500 字符
          </small>
        </div>

        <!-- 表单预览 -->
        <div v-if="showPreview" class="form-preview">
          <h4>通报预览</h4>
          <div class="preview-content">
            <div class="preview-item">
              <strong>班级：</strong>{{ getClassDisplay() }}
            </div>
            <div class="preview-item">
              <strong>通报类型：</strong>{{ getReportTypeDisplay() }}
            </div>
            <div class="preview-item" :class="{ 
              'score-positive': formData.scoreChange > 0,
              'score-negative': formData.scoreChange < 0 
            }">
              <strong>分数变动：</strong>
              {{ formData.scoreChange > 0 ? '+' : '' }}{{ formData.scoreChange }}
            </div>
            <div class="preview-item">
              <strong>时间：</strong>{{ formatDateTime(formData.reportTime) }}
            </div>
            <div class="preview-item">
              <strong>备注：</strong>{{ formData.remark }}
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button 
            type="button" 
            @click="togglePreview" 
            class="preview-btn"
            :disabled="!isFormValid || submitting"
          >
            {{ showPreview ? '隐藏预览' : '预览通报' }}
          </button>
          
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="!isFormValid || submitting"
          >
            {{ submitting ? '提交中...' : '提交通报' }}
          </button>
        </div>

        <!-- 成功/错误消息 -->
        <div v-if="message" class="message" :class="messageType">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 表单数据
const formData = ref({
  class: '',
  reportType: '',
  scoreChange: 0,
  remark: '',
  reportTime: ''
})

// 状态管理
const submitting = ref(false)
const showPreview = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 班级列表（基于class.json）
const classList = ref([
  { class: 1, headteacher: "王振宽" },
  { class: 2, headteacher: "郭宝伟" },
  { class: 3, headteacher: "张春水" },
  { class: 4, headteacher: "孙华义" },
  { class: 5, headteacher: "边海根" },
  { class: 6, headteacher: "王国华" },
  { class: 7, headteacher: "刘磊磊" },
  { class: 8, headteacher: "刘鹏欣" },
  { class: 9, headteacher: "陈常锋" },
  { class: 10, headteacher: "程猛猛" },
  { class: 15, headteacher: "谢媛" },
  { class: 16, headteacher: "刘世彬" },
  { class: 17, headteacher: "刘东良" },
  { class: 18, headteacher: "顾明立" },
  { class: 19, headteacher: "周殿勋" },
  { class: 21, headteacher: "王树琦" },
  { class: 22, headteacher: "袁义国" },
  { class: 24, headteacher: "王思程" }
])

// 通报类型列表
const reportTypes = ref([
  { value: 'discipline_violation', label: '违纪扣分' },
  { value: 'hygiene_deduction', label: '卫生扣分' },
  { value: 'late_absence', label: '迟到旷课' },
  { value: 'homework_issue', label: '作业问题' },
  { value: 'good_behavior', label: '表现加分' },
  { value: 'activity_participation', label: '活动加分' },
  { value: 'academic_excellence', label: '学习优秀' },
  { value: 'helping_others', label: '助人为乐' }
])

// 表单验证
const isFormValid = computed(() => {
  return formData.value.class !== '' &&
         formData.value.reportType !== '' &&
         formData.value.scoreChange !== 0 &&
         formData.value.remark.trim().length > 0 &&
         formData.value.reportTime !== '' &&
         formData.value.remark.length <= 500
})

// 初始化
onMounted(() => {
  // 设置默认时间为当前时间
  const now = new Date()
  const timezone = now.getTimezoneOffset() * 60000
  const localTime = new Date(now.getTime() - timezone)
  formData.value.reportTime = localTime.toISOString().slice(0, 16)
})

// 获取班级显示名称
const getClassDisplay = () => {
  const classItem = classList.value.find(c => c.class === Number(formData.value.class))
  return classItem ? `${classItem.class}班 - ${classItem.headteacher}` : ''
}

// 获取通报类型显示名称
const getReportTypeDisplay = () => {
  const type = reportTypes.value.find(t => t.value === formData.value.reportType)
  return type ? type.label : ''
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleString('zh-CN')
}

// 切换预览
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 提交表单
const handleSubmit = async () => {
  if (!isFormValid.value) return

  submitting.value = true
  message.value = ''

  try {
    // 模拟API调用
    console.log('提交通报数据:', formData.value)
    
    // 这里将来会调用实际的API
    // const response = await fetch('http://localhost:8080/api/inputdata', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData.value),
    // })

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 模拟成功响应
    message.value = '通报提交成功！'
    messageType.value = 'success'
    
    // 重置表单
    setTimeout(() => {
      resetForm()
    }, 2000)

  } catch (error) {
    console.error('提交失败:', error)
    message.value = '提交失败，请稍后重试'
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    class: '',
    reportType: '',
    scoreChange: 0,
    remark: '',
    reportTime: ''
  }
  showPreview.value = false
  message.value = ''
  
  // 重新设置默认时间
  const now = new Date()
  const timezone = now.getTimezoneOffset() * 60000
  const localTime = new Date(now.getTime() - timezone)
  formData.value.reportTime = localTime.toISOString().slice(0, 16)
}
</script>

<style scoped>
.submit-report-container {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.submit-header {
  text-align: center;
  margin-bottom: 2rem;
}

.submit-header h2 {
  color: #333;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}

.submit-header p {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.field-hint {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.form-preview {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.form-preview h4 {
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-item {
  font-size: 0.95rem;
  color: #333;
}

.preview-item strong {
  color: #666;
  min-width: 80px;
  display: inline-block;
}

.score-positive {
  color: #27ae60 !important;
}

.score-negative {
  color: #e74c3c !important;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.preview-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.preview-btn {
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e9ecef;
}

.preview-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #dee2e6;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.preview-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.message {
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .preview-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>