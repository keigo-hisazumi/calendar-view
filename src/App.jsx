import { useState, useMemo } from 'react'
import Calendar from './components/Calendar.jsx'
import EventList from './components/EventList.jsx'
import EventForm from './components/EventForm.jsx'

const availableUsers = [
  { id: 1, name: '田中太郎' },
  { id: 2, name: '佐藤花子' },
  { id: 3, name: '鈴木一郎' },
  { id: 4, name: '高橋美咲' },
]

const loadEvents = () => {
  const stored = localStorage.getItem('calendar-events')
  if (stored) {
    return JSON.parse(stored)
  }
  return [
    {
      id: 1,
      title: 'チームミーティング',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      description: '週次の進捗報告会',
      shared: true,
      sharedWith: [1, 2],
    },
    {
      id: 2,
      title: '昼食',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      description: 'レストランで友人と',
      shared: false,
      sharedWith: [],
    },
  ]
}

export default function App() {
  const [events, setEvents] = useState(loadEvents)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const saveEvents = (newEvents) => {
    localStorage.setItem('calendar-events', JSON.stringify(newEvents))
  }

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return events
    const dateStr = selectedDate.toISOString().split('T')[0]
    return events.filter((e) => e.date === dateStr)
  }, [events, selectedDate])

  const handleDateSelected = (date) => {
    setSelectedDate(date)
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowEventForm(true)
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('この予定を削除しますか？')) {
      const newEvents = events.filter((e) => e.id !== eventId)
      setEvents(newEvents)
      saveEvents(newEvents)
    }
  }

  const handleEventSubmit = (eventData) => {
    let newEvents
    if (editingEvent) {
      newEvents = events.map((e) => (e.id === editingEvent.id ? eventData : e))
    } else {
      newEvents = [...events, eventData]
    }
    setEvents(newEvents)
    saveEvents(newEvents)
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const handleEventCancel = () => {
    setShowEventForm(false)
    setEditingEvent(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 カレンダーアプリ</h1>
        <p className="subtitle">予定を共有して、チームワークを向上させましょう</p>
      </header>

      <main className="app-main">
        <div className="calendar-section">
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateSelected={handleDateSelected}
          />
        </div>

        <div className="sidebar">
          {showEventForm ? (
            <EventForm
              event={editingEvent}
              selectedDate={selectedDate}
              availableUsers={availableUsers}
              onSubmit={handleEventSubmit}
              onCancel={handleEventCancel}
            />
          ) : (
            <EventList
              events={selectedDateEvents}
              selectedDate={selectedDate}
              availableUsers={availableUsers}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          <strong>モックアプリ:</strong>{' '}
          このアプリケーションはデモンストレーション用です。データはブラウザのローカルストレージに保存されます。
        </p>
        <p className="tech-stack">
          🔧 React 18 + Vite | 📱 モバイル対応 | 🔮 将来的にSpring Bootと連携予定
        </p>
      </footer>
    </div>
  )
}
