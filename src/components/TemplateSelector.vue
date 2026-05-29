<template>
  <div class="template-selector-overlay" @click.self="$emit('close')">
    <div class="template-selector">
      <div class="template-selector-header">
        <h3>テンプレートから選択</h3>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <div v-if="templates.length === 0" class="empty-state">
        <p>テンプレートがありません。</p>
        <p class="hint">予定フォームの「テンプレートとして保存」ボタンで追加できます。</p>
      </div>

      <ul v-else class="template-list">
        <li
          v-for="template in templates"
          :key="template.id"
          class="template-item"
        >
          <div class="template-info" @click="$emit('apply', template)">
            <span class="template-title">{{ template.title }}</span>
            <span v-if="template.time" class="template-meta">{{ template.time }}</span>
            <span v-if="template.description" class="template-desc">{{ template.description }}</span>
          </div>
          <button class="btn-delete" title="削除" @click="deleteTemplate(template.id)">🗑</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  templates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['apply', 'close', 'delete'])

const deleteTemplate = (id) => {
  if (confirm('このテンプレートを削除しますか？')) {
    emit('delete', id)
  }
}
</script>

<style scoped>
.template-selector-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.template-selector {
  background: white;
  border-radius: 12px;
  padding: 20px;
  min-width: 320px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.template-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.template-selector-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #7f8c8d;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f0f0f0;
}

.empty-state {
  text-align: center;
  padding: 24px 0;
  color: #7f8c8d;
}

.empty-state .hint {
  font-size: 0.85rem;
  margin-top: 8px;
}

.template-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 360px;
  overflow-y: auto;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.template-item:hover {
  background: #f4f8fb;
}

.template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.template-title {
  font-weight: 600;
  color: #2c3e50;
}

.template-meta {
  font-size: 0.82rem;
  color: #3498db;
}

.template-desc {
  font-size: 0.82rem;
  color: #7f8c8d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.btn-delete:hover {
  background: #fdecea;
}
</style>
