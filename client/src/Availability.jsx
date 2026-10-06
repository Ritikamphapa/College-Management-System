import { useEffect, useRef, useState } from 'react'
import { api } from './api'

export default function Availability({ role }) {
  const [list, setList] = useState([])
  const [toast, setToast] = useState('')
  const prev = useRef(null)

  const load = async () => {
    try {
      const { teachers } = await api('/availability')
      if (prev.current) {
        teachers.forEach((t) => {
          if (t.following && t.isPresent && prev.current[t.teacherId] === false) {
            const msg = `${t.name} is now in the cabin`
            setToast(msg); setTimeout(() => setToast(''), 6000)
            if ('Notification' in window && Notification.permission === 'granted') new Notification(msg, { body: t.note || '' })
          }
        })
      }
      prev.current = Object.fromEntries(teachers.map((t) => [t.teacherId, t.isPresent]))
      setList(teachers)
    } catch (e) { setToast(e.message) }
  }
  useEffect(() => { load(); const id = setInterval(load, 15000); return () => clearInterval(id) }, [])

  const follow = async (id) => {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
    await api(`/availability/${id}/follow`, { method: 'POST' }); load()
  }
  const sorted = [...list].sort((a, b) => b.isPresent - a.isPresent || a.name.localeCompare(b.name))

  return (
    <>
      <h2>{role === 'teacher' ? 'My cabin' : 'Cabin status'}</h2>
      {role === 'teacher' && <Toggle onChange={load} />}
      {toast && <div className="toast">{toast}</div>}
      <p className="sub">{list.filter((t) => t.isPresent).length} of {list.length} teachers in their cabin. Updates every 15 seconds.</p>
      <div className="doors">
        {sorted.map((t) => (
          <div key={t.teacherId} className={'door ' + (t.isPresent ? 'in' : 'out')}>
            <div className="lamp" />
            <div className="who"><b>{t.name}</b><span>{t.designation}, {t.department}</span></div>
            <div className="state">
              {t.isPresent ? 'In cabin' : 'Away'}
              {t.isPresent && t.note && <em>{t.note}</em>}
              {t.isPresent && <em>since {new Date(t.since).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</em>}
            </div>
            {role === 'student' && (
              <button className="ghost" onClick={() => follow(t.teacherId)}>
                {t.following ? (t.isPresent ? 'Stop alerts' : 'Cancel alert') : t.isPresent ? '' : 'Alert me'}
              </button>
            )}
          </div>
        ))}
        {!list.length && <p className="sub">No teachers have been added yet.</p>}
      </div>
    </>
  )
}

function Toggle({ onChange }) {
  const [note, setNote] = useState('')
  const [hours, setHours] = useState(4)
  const [on, setOn] = useState(false)
  const [msg, setMsg] = useState('')
  const set = async (isPresent) => {
    try {
      await api('/availability/me', { method: 'PUT', body: { isPresent, note, hours } })
      setOn(isPresent)
      setMsg(isPresent ? `Students can see you're in. This ends automatically in ${hours} h.` : 'Marked as away.')
      onChange()
    } catch (e) { setMsg(e.message) }
  }
  return (
    <div className="panel">
      <h3>{on ? 'You are marked as in your cabin' : 'Let students know you are in'}</h3>
      <div className="row">
        <input placeholder="Optional note, e.g. Room 204, signatures till 4 PM" value={note} onChange={(e) => setNote(e.target.value)} />
        <select value={hours} onChange={(e) => setHours(+e.target.value)}>
          {[1, 2, 3, 4, 6, 8].map((h) => <option key={h} value={h}>for {h} h</option>)}
        </select>
        {on ? <button onClick={() => set(false)}>Mark as away</button> : <button className="primary" onClick={() => set(true)}>I'm in my cabin</button>}
      </div>
      {msg && <p className="sub">{msg}</p>}
    </div>
  )
}
