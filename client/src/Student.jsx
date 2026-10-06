import { useEffect, useState } from 'react'
import { api } from './api'

function useStudent(path) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    (async () => {
      try {
        const me = await api('/students/profile')
        setData(await Promise.all(path.map((p) => api(p.replace(':id', me._id)))))
      } catch (e) { setErr(e.message) }
    })()
  }, [])
  return [data, err]
}

export function Attendance() {
  const [d, err] = useStudent(['/attendance/student/:id/percentage', '/attendance/student/:id'])
  if (err) return <div className="err">{err}</div>
  if (!d) return <p className="sub">Loading...</p>
  const [pct, { attendance }] = d
  return (
    <>
      <h2>My attendance</h2>
      <div className="stats">
        <div><b>{pct.attendancePercentage}</b><span>Overall</span></div>
        <div><b>{pct.presentClasses}/{pct.totalClasses}</b><span>Classes attended</span></div>
      </div>
      <div className="scroll"><table>
        <thead><tr><th>Date</th><th>Subject</th><th>Teacher</th><th>Status</th></tr></thead>
        <tbody>{attendance.map((a) => (
          <tr key={a._id}><td>{new Date(a.date).toLocaleDateString()}</td><td>{a.subject?.subjectName}</td><td>{a.teacher?.user?.name}</td>
            <td className={a.status === 'Present' ? 'ok' : 'bad'}>{a.status}</td></tr>))}</tbody>
      </table>{!attendance.length && <p className="sub">No attendance has been recorded yet.</p>}</div>
    </>
  )
}

export function Marks() {
  const [d, err] = useStudent(['/marks/student/:id'])
  if (err) return <div className="err">{err}</div>
  if (!d) return <p className="sub">Loading...</p>
  const { marks } = d[0]
  return (
    <>
      <h2>My marks</h2>
      <div className="scroll"><table>
        <thead><tr><th>Subject</th><th>Exam</th><th>Marks</th><th>Out of</th><th>Teacher</th></tr></thead>
        <tbody>{marks.map((m) => (
          <tr key={m._id}><td>{m.subject?.subjectName}</td><td>{m.examType}</td><td>{m.marksObtained}</td><td>{m.totalMarks}</td><td>{m.teacher?.user?.name}</td></tr>))}</tbody>
      </table>{!marks.length && <p className="sub">No marks have been entered yet.</p>}</div>
    </>
  )
}
