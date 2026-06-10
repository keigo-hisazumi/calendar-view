import { useState, useEffect } from 'react'

const initFormData = (event, selectedDate) => {
  if (event) {
    return {
      title: event.title,
      date: event.date,
      time: event.time || '',
      description: event.description || '',
      shared: event.shared || false,
      sharedWith: event.sharedWith || [],
    }
  }
  const dateStr = selectedDate
    ? selectedDate.toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]
  return { title: '', date: dateStr, time: '', description: '', shared: false, sharedWith: [] }
}

export default function EventForm({ event, selectedDate, availableUsers, onSubmit, onCancel }) {
  const isEdit = !!event
  const [formData, setFormData] = useState(() => initFormData(event, selectedDate))

  useEffect(() => {
    setFormData(initFormData(event, selectedDate))
  }, [event, selectedDate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSharedWithChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
    setFormData((prev) => ({ ...prev, sharedWith: selected }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ id: event?.id || Date.now(), ...formData })
  }

  return (
    <div className="event-form">
      <h3>{isEdit ? '予定を編集' : '新しい予定'}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">タイトル *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="予定のタイトルを入力"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">日付 *</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">時間</label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">説明</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="予定の詳細を入力"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="shared"
              checked={formData.shared}
              onChange={handleChange}
            />
            他のユーザーと共有
          </label>
        </div>

        {formData.shared && (
          <div className="form-group">
            <label htmlFor="shared-with">共有ユーザー</label>
            <select
              id="shared-with"
              multiple
              size={4}
              value={formData.sharedWith.map(String)}
              onChange={handleSharedWithChange}
            >
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <small>複数選択可能（Ctrl/Cmdキーを押しながら選択）</small>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? '更新' : '追加'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
