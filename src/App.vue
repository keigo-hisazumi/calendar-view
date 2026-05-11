<script setup>
import { ref, computed } from 'vue'
import Calendar from './components/Calendar.vue'
import EventList from './components/EventList.vue'
import EventForm from './components/EventForm.vue'

// モックユーザーデータ
const availableUsers = [
  { id: 1, name: '田中太郎' },
  { id: 2, name: '佐藤花子' },
  { id: 3, name: '鈴木一郎' },
  { id: 4, name: '高橋美咲' }
]

// イベントデータ（ローカルストレージから読み込み）
const loadEvents = () => {
  const stored = localStorage.getItem('calendar-events')
  if (stored) {
    return JSON.parse(stored)
  }
  // サンプルデータ
  return [
    {
      id: 1,
      title: 'チームミーティング',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      description: '週次の進捗報告会',
      shared: true,
      sharedWith: [1, 2]
    },
    {
      id: 2,
      title: '昼食',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      description: 'レストランで友人と',
      shared: false,
      sharedWith: []
    }
  ]
}

const events = ref(loadEvents())
const selectedDate = ref(null)
const showEventForm = ref(false)
const editingEvent = ref(null)

// イベントを保存
const saveEvents = () => {
  localStorage.setItem('calendar-events', JSON.stringify(events.value))
}

// 選択された日付のイベント
const selectedDateEvents = computed(() => {
  if (!selectedDate.value) {
    return events.value
  }
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  return events.value.filter(event => event.date === dateStr)
})

// 日付選択ハンドラ
const handleDateSelected = (date) => {
  selectedDate.value = date
  showEventForm.value = false
  editingEvent.value = null
}

// 新規イベント追加
const handleAddEvent = () => {
  editingEvent.value = null
  showEventForm.value = true
}

// イベント編集
const handleEditEvent = (event) => {
  editingEvent.value = event
  showEventForm.value = true
}

// イベント削除
const handleDeleteEvent = (eventId) => {
  if (confirm('この予定を削除しますか？')) {
    events.value = events.value.filter(e => e.id !== eventId)
    saveEvents()
  }
}

// フォーム送信
const handleEventSubmit = (eventData) => {
  if (editingEvent.value) {
    // 編集
    const index = events.value.findIndex(e => e.id === editingEvent.value.id)
    if (index !== -1) {
      events.value[index] = eventData
    }
  } else {
    // 新規追加
    events.value.push(eventData)
  }
  saveEvents()
  showEventForm.value = false
  editingEvent.value = null
}

// フォームキャンセル
const handleEventCancel = () => {
  showEventForm.value = false
  editingEvent.value = null
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>📅 カレンダーアプリ</h1>
      <p class="subtitle">予定を共有して、チームワークを向上させましょう</p>
    </header>

    <main class="app-main">
      <div class="calendar-section">
        <Calendar
          :events="events"
          :selected-date="selectedDate"
          @date-selected="handleDateSelected"
        />
      </div>

      <div class="sidebar">
        <EventForm
          v-if="showEventForm"
          :event="editingEvent"
          :selected-date="selectedDate"
          :available-users="availableUsers"
          @submit="handleEventSubmit"
          @cancel="handleEventCancel"
        />

        <EventList
          v-else
          :events="selectedDateEvents"
          :selected-date="selectedDate"
          :available-users="availableUsers"
          @add-event="handleAddEvent"
          @edit-event="handleEditEvent"
          @delete-event="handleDeleteEvent"
        />
      </div>
    </main>

    <footer class="app-footer">
      <p>
        <strong>モックアプリ:</strong> このアプリケーションはデモンストレーション用です。
        データはブラウザのローカルストレージに保存されます。
      </p>
      <p class="tech-stack">
        🔧 Vue.js 3 + Vite | 📱 モバイル対応 | 🔮 将来的にSpring Bootと連携予定
      </p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.calendar-section {
  grid-column: 1;
}

.sidebar {
  grid-column: 2;
}

.app-footer {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-footer p {
  margin: 10px 0;
  line-height: 1.6;
}

.tech-stack {
  color: #7f8c8d;
  font-size: 0.95rem;
}

@media (max-width: 1024px) {
  .app-main {
    grid-template-columns: 1fr;
  }

  .sidebar {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .app {
    padding: 10px;
  }

  .app-header h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
