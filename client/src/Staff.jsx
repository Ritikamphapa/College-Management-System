import { useEffect, useState } from 'react'
import { api } from './api'

const today = () => new Date().toISOString().slice(0, 10)

export default function Staff() {
  const [me, setMe] = useState(null)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [att, setAtt] = useState({ date: today(), status: 'Present' })
  const [mk, setMk] = useState({ examType: 'Assignment' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    Promise.all([api('/teachers/profile'), api('/students'), api('/subjects')])
      .then(([t, s, sub]) => { setMe(t); setStudents(s.students); setSubjects(sub.subjects) })
      .catch((e) => setMsg(e.message))
  }, [])

  const send = (path, body, ok) => async (e) => {
    e.preventDefault()
    try { await api(path, { method: 'POST', body: { ...body, teacherId: me._id } }); setMsg(ok) } catch (er) { setMsg(er.message) }
  }
  const pickers = (st, set) => (
    <>
      <label>Subject<select required value={st.subjectId || ''} onChange={(e) => set({ ...st, subjectId: e.target.value })}>
        <option value="">Choose</option>{subjects.map((s) => <option key={s._id} value={s._id}>{s.subjectName}</option>)}</select></label>
      <label>Student<select required value={st.studentId || ''} onChange={(e) => set({ ...st, studentId: e.target.value })}>
        <option value="">Choose</option>{students.map((s) => <option key={s._id} value={s._id}>{s.rollNumber} - {s.user?.name}</option>)}</select></label>
    </>
  )
  return (
    <>
      <h2>Attendance and marks</h2>
      {msg && <div className="toast">{msg}</div>}
      <div className="two">
        <form className="panel" onSubmit={send('/attendance', att, 'Attendance saved.')}>
          <h3>Mark attendance</h3>
          {pickers(att, setAtt)}
          <label>Date<input type="date" required value={att.date} onChange={(e) => setAtt({ ...att, date: e.target.value })} /></label>
          <label>Status<select value={att.status} onChange={(e) => setAtt({ ...att, status: e.target.value })}><option>Present</option><option>Absent</option></select></label>
          <button className="primary" disabled={!me}>Save attendance</button>
        </form>
        <form className="panel" onSubmit={send('/marks', { ...mk, marksObtained: +mk.marksObtained, totalMarks: +mk.totalMarks }, 'Marks saved.')}>
          <h3>Add marks</h3>
          {pickers(mk, setMk)}
          <label>Exam<select value={mk.examType} onChange={(e) => setMk({ ...mk, examType: e.target.value })}><option>Assignment</option><option>Mid Semester</option><option>End Semester</option></select></label>
          <label>Marks obtained<input type="number" min="0" required onChange={(e) => setMk({ ...mk, marksObtained: e.target.value })} /></label>
          <label>Total marks<input type="number" min="1" required onChange={(e) => setMk({ ...mk, totalMarks: e.target.value })} /></label>
          <button className="primary" disabled={!me}>Save marks</button>
        </form>
      </div>
    </>
  )
}
