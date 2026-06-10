import { useState, useMemo } from 'react'

const weekDays = ['日', '月', '火', '水', '木', '金', '土']

export default function Calendar({ events, selectedDate, onDateSelected }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate.getTime() === date.getTime()
    })
  }

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const prevLastDay = new Date(currentYear, currentMonth, 0)

    const days = []
    const startDayOfWeek = firstDay.getDay()
    const totalDays = lastDay.getDate()
    const prevTotalDays = prevLastDay.getDate()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevTotalDays - i)
      date.setHours(0, 0, 0, 0)
      days.push({ date, isCurrentMonth: false, isToday: false, events: getEventsForDate(date) })
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i)
      date.setHours(0, 0, 0, 0)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        events: getEventsForDate(date),
      })
    }

    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i)
      date.setHours(0, 0, 0, 0)
      days.push({ date, isCurrentMonth: false, isToday: false, events: getEventsForDate(date) })
    }

    return days
  }, [currentYear, currentMonth, events])

  const isSelected = (day) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)
    return day.date.getTime() === selected.getTime()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={previousMonth} className="nav-button">&lt;</button>
        <h2>{currentYear}年 {currentMonth + 1}月</h2>
        <button onClick={nextMonth} className="nav-button">&gt;</button>
      </div>

      <div className="weekdays">
        {weekDays.map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const classes = [
            'calendar-day',
            !day.isCurrentMonth ? 'other-month' : '',
            day.isToday ? 'today' : '',
            isSelected(day) ? 'selected' : '',
            day.events.length > 0 ? 'has-events' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={index}
              className={classes}
              onClick={() => onDateSelected(day.date)}
            >
              <div className="day-number">{day.date.getDate()}</div>
              <div className="day-events">
                {day.events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`event-badge ${event.shared ? 'shared' : 'personal'}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="more-events">+{day.events.length - 2}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
