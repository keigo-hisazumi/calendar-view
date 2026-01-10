<template>
  <div class="event-list">
    <div class="event-list-header">
      <h3>{{ headerText }}</h3>
      <button @click="$emit('add-event')" class="btn-add">
        <span>+</span> 新しい予定
      </button>
    </div>

    <div v-if="events.length === 0" class="no-events">
      予定はありません
    </div>

    <div v-else class="events">
      <div
        v-for="event in sortedEvents"
        :key="event.id"
        :class="['event-item', event.shared ? 'shared' : 'personal']"
      >
        <div class="event-header">
          <div class="event-title">
            <span v-if="event.shared" class="share-icon">👥</span>
            {{ event.title }}
          </div>
          <div class="event-actions">
            <button @click="$emit('edit-event', event)" class="btn-icon" title="編集">
              ✏️
            </button>
            <button @click="$emit('delete-event', event.id)" class="btn-icon" title="削除">
              🗑️
            </button>
          </div>
        </div>

        <div class="event-details">
          <div v-if="event.time" class="event-time">
            🕒 {{ event.time }}
          </div>
          <div v-if="event.description" class="event-description">
            {{ event.description }}
          </div>
          <div v-if="event.shared && event.sharedWith.length > 0" class="event-shared">
            <strong>共有先:</strong> {{ getSharedWithNames(event.sharedWith) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => []
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

defineEmits(['add-event', 'edit-event', 'delete-event'])

// ヘッダーテキスト
const headerText = computed(() => {
  if (!props.selectedDate) {
    return 'すべての予定'
  }
  const date = props.selectedDate
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日の予定`
})

// 時間順にソート
const sortedEvents = computed(() => {
  return [...props.events].sort((a, b) => {
    if (!a.time && !b.time) return 0
    if (!a.time) return 1
    if (!b.time) return -1
    return a.time.localeCompare(b.time)
  })
})

// 共有ユーザー名を取得
const getSharedWithNames = (userIds) => {
  return userIds
    .map(id => {
      const user = props.availableUsers.find(u => u.id === id)
      return user ? user.name : '不明'
    })
    .join(', ')
}
</script>

<style scoped>
.event-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.event-list-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-add {
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-add:hover {
  background: #229954;
}

.btn-add span {
  font-size: 1.2rem;
}

.no-events {
  text-align: center;
  padding: 40px 20px;
  color: #95a5a6;
  font-size: 1.1rem;
}

.events {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-item {
  border-left: 4px solid #3498db;
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: transform 0.2s;
}

.event-item:hover {
  transform: translateX(5px);
}

.event-item.shared {
  border-left-color: #9c27b0;
  background: #f3e5f5;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.event-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.share-icon {
  font-size: 1rem;
}

.event-actions {
  display: flex;
  gap: 5px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.btn-icon:hover {
  opacity: 1;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-time {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.event-description {
  color: #555;
  line-height: 1.5;
}

.event-shared {
  color: #9c27b0;
  font-size: 0.9rem;
  padding-top: 5px;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .event-list {
    padding: 15px;
  }

  .event-list-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .event-item:hover {
    transform: none;
  }
}
</style>
