import { useMemo } from 'react'

export default function EventList({ events, selectedDate, availableUsers, onAddEvent, onEditEvent, onDeleteEvent }) {
  const headerText = useMemo(() => {
    if (!selectedDate) return 'すべての予定'
    const date = selectedDate
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日の予定`
  }, [selectedDate])

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.localeCompare(b.time)
    })
  }, [events])

  const getSharedWithNames = (userIds) => {
    return userIds
      .map((id) => {
        const user = availableUsers.find((u) => u.id === id)
        return user ? user.name : '不明'
      })
      .join(', ')
  }

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h3>{headerText}</h3>
        <button onClick={onAddEvent} className="btn-add">
          <span>+</span> 新しい予定
        </button>
      </div>

      {events.length === 0 ? (
        <div className="no-events">予定はありません</div>
      ) : (
        <div className="events">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className={`event-item ${event.shared ? 'shared' : 'personal'}`}
            >
              <div className="event-header">
                <div className="event-title">
                  {event.shared && <span className="share-icon">👥</span>}
                  {event.title}
                </div>
                <div className="event-actions">
                  <button
                    onClick={() => onEditEvent(event)}
                    className="btn-icon"
                    title="編集"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="btn-icon"
                    title="削除"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="event-details">
                {event.time && <div className="event-time">🕒 {event.time}</div>}
                {event.description && (
                  <div className="event-description">{event.description}</div>
                )}
                {event.shared && event.sharedWith.length > 0 && (
                  <div className="event-shared">
                    <strong>共有先:</strong> {getSharedWithNames(event.sharedWith)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
