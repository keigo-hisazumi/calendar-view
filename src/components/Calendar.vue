<template>
  <div class="calendar">
    <!-- カレンダーヘッダー -->
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-button">&lt;</button>
      <h2>{{ currentYear }}年 {{ currentMonth + 1 }}月</h2>
      <button @click="nextMonth" class="nav-button">&gt;</button>
    </div>

    <!-- 曜日ヘッダー -->
    <div class="weekdays">
      <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <!-- カレンダーグリッド -->
    <div class="calendar-grid">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'calendar-day',
          { 'other-month': !day.isCurrentMonth },
          { 'today': day.isToday },
          { 'selected': isSelected(day) },
          { 'has-events': day.events.length > 0 }
        ]"
        @click="selectDay(day)"
      >
        <div class="day-number">{{ day.date.getDate() }}</div>
        <div class="day-events">
          <div
            v-for="event in day.events.slice(0, 2)"
            :key="event.id"
            :class="['event-badge', event.shared ? 'shared' : 'personal']"
            :title="event.title"
          >
            {{ event.title }}
          </div>
          <div v-if="day.events.length > 2" class="more-events">
            +{{ day.events.length - 2 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  selectedDate: {
    type: Date,
    default: null
  }
})

const emit = defineEmits(['date-selected'])

const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const weekDays = ['日', '月', '火', '水', '木', '金', '土']

// カレンダーの日付を生成
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const prevLastDay = new Date(year, month, 0)
  
  const days = []
  const startDayOfWeek = firstDay.getDay()
  const totalDays = lastDay.getDate()
  const prevTotalDays = prevLastDay.getDate()
  
  // 前月の日付
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevTotalDays - i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date)
    })
  }
  
  // 当月の日付
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i)
    date.setHours(0, 0, 0, 0)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
      events: getEventsForDate(date)
    })
  }
  
  // 翌月の日付（6週間分表示するため）
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date)
    })
  }
  
  return days
})

// 指定日付のイベントを取得
const getEventsForDate = (date) => {
  return props.events.filter(event => {
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate.getTime() === date.getTime()
  })
}

// 日付が選択されているかチェック
const isSelected = (day) => {
  if (!props.selectedDate) return false
  const selected = new Date(props.selectedDate)
  selected.setHours(0, 0, 0, 0)
  return day.date.getTime() === selected.getTime()
}

// 前月へ移動
const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

// 翌月へ移動
const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

// 日付選択
const selectDay = (day) => {
  emit('date-selected', day.date)
}
</script>

<style scoped>
.calendar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #2c3e50;
}

.nav-button {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s;
}

.nav-button:hover {
  background: #2980b9;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  font-weight: bold;
  color: #7f8c8d;
  padding: 10px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  min-height: 100px;
  padding: 8px;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.calendar-day:hover {
  background: #f8f9fa;
  border-color: #3498db;
}

.calendar-day.other-month {
  opacity: 0.4;
}

.calendar-day.today {
  background: #e3f2fd;
  border-color: #2196f3;
}

.calendar-day.selected {
  background: #bbdefb;
  border-color: #1976d2;
}

.calendar-day.has-events {
  border-color: #9c27b0;
}

.day-number {
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-badge {
  font-size: 0.75rem;
  padding: 2px 5px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
}

.event-badge.personal {
  background: #3498db;
}

.event-badge.shared {
  background: #9c27b0;
}

.more-events {
  font-size: 0.7rem;
  color: #7f8c8d;
  text-align: center;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .calendar {
    padding: 10px;
  }

  .calendar-day {
    min-height: 60px;
    padding: 4px;
  }

  .day-number {
    font-size: 0.9rem;
  }

  .event-badge {
    font-size: 0.65rem;
    padding: 1px 3px;
  }
}
</style>
