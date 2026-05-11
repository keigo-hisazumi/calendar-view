<template>
  <div class="event-form">
    <h3>{{ isEdit ? '予定を編集' : '新しい予定' }}</h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">タイトル *</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="予定のタイトルを入力"
          required
        />
      </div>

      <div class="form-group">
        <label for="date">日付 *</label>
        <input
          id="date"
          v-model="formData.date"
          type="date"
          required
        />
      </div>

      <div class="form-group">
        <label for="time">時間</label>
        <input
          id="time"
          v-model="formData.time"
          type="time"
        />
      </div>

      <div class="form-group">
        <label for="description">説明</label>
        <textarea
          id="description"
          v-model="formData.description"
          placeholder="予定の詳細を入力"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label>
          <input
            v-model="formData.shared"
            type="checkbox"
          />
          他のユーザーと共有
        </label>
      </div>

      <div v-if="formData.shared" class="form-group">
        <label for="shared-with">共有ユーザー</label>
        <select
          id="shared-with"
          v-model="formData.sharedWith"
          multiple
          size="4"
        >
          <option v-for="user in availableUsers" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
        <small>複数選択可能（Ctrl/Cmdキーを押しながら選択）</small>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          {{ isEdit ? '更新' : '追加' }}
        </button>
        <button type="button" @click="handleCancel" class="btn btn-secondary">
          キャンセル
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  selectedDate: {
    type: Date,
    default: null
  },
  availableUsers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = ref(!!props.event)

// フォームデータの初期化
const initFormData = () => {
  if (props.event) {
    return {
      title: props.event.title,
      date: props.event.date,
      time: props.event.time || '',
      description: props.event.description || '',
      shared: props.event.shared || false,
      sharedWith: props.event.sharedWith || []
    }
  } else {
    const dateStr = props.selectedDate
      ? props.selectedDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    
    return {
      title: '',
      date: dateStr,
      time: '',
      description: '',
      shared: false,
      sharedWith: []
    }
  }
}

const formData = ref(initFormData())

// イベントが変更されたらフォームをリセット
watch(() => props.event, () => {
  isEdit.value = !!props.event
  formData.value = initFormData()
})

watch(() => props.selectedDate, (newDate) => {
  if (newDate && !props.event) {
    formData.value.date = newDate.toISOString().split('T')[0]
  }
})

const handleSubmit = () => {
  emit('submit', {
    id: props.event?.id || Date.now(),
    ...formData.value
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.event-form {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-form h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="time"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input[type="text"]:focus,
.form-group input[type="date"]:focus,
.form-group input[type="time"]:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

.form-group select {
  height: auto;
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

@media (max-width: 768px) {
  .event-form {
    padding: 15px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
