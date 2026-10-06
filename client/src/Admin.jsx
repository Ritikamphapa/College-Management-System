import { useEffect, useState } from 'react'
import { api } from './api'

export function Overview() {
  const [d, setD] = useState(null)
  useEffect(() => { api('/dashboard/admin').then(setD).catch(() => {}) }, [])
  const items = [['Students', 'totalStudents'], ['Teachers', 'totalTeachers'], ['Subjects', 'totalSubjects'], ['Attendance records', 'totalAttendance'], ['Marks entered', 'totalMarks']]
  return (
    <>
      <h2>Overview</h2>
      <div className="stats">{items.map(([l, k]) => <div key={k}><b>{d ? d[k] : '-'}</b><span>{l}</span></div>)}</div>
    </>
  )
}

const KINDS = {
  teachers: {
    list: '/teachers', key: 'teachers', one: 'teacher',
    cols: [['Name', (r) => r.user?.name], ['Email', (r) => r.user?.email], ['Employee ID', (r) => r.employeeId], ['Department', (r) => r.department], ['Designation', (r) => r.designation]],
    fields: ['name', 'email', 'password', 'employeeId', 'department', 'designation', 'qualification', 'phone'],
  },
  students: {
    list: '/students', key: 'students', one: 'student',
    cols: [['Name', (r) => r.user?.name], ['Email', (r) => r.user?.email], ['Roll no.', (r) => r.rollNumber], ['Branch', (r) => r.branch], ['Sem', (r) => r.semester], ['Section', (r) => r.section]],
    fields: ['name', 'email', 'password', 'rollNumber', 'semester', 'branch', 'section', 'phone'],
  },
  subjects: {
    list: '/subjects', key: 'subjects', one: 'subject',
    cols: [['Code', (r) => r.subjectCode], ['Name', (r) => r.subjectName], ['Department', (r) => r.department], ['Sem', (r) => r.semester], ['Credits', (r) => r.credits], ['Teacher', (r) => r.teacher?.user?.name || 'Unassigned']],
    fields: ['subjectCode', 'subjectName', 'department', 'semester', 'credits'],
  },
}
const label = (f) => f.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())

export function Manage({ kind }) {
  const k = KINDS[kind]
  const [rows, setRows] = useState([])
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({})
  const [msg, setMsg] = useState('')
  const load = () => api(k.list).then((d) => setRows(d[k.key])).catch((e) => setMsg(e.message))
  useEffect(() => {
    load()
    if (kind === 'subjects') api('/teachers').then((d) => setTeachers(d.teachers)).catch(() => {})
  }, [])

  const run = async (fn, ok) => { try { await fn(); setMsg(ok); load() } catch (e) { setMsg(e.message) } }
  const add = (e) => { e.preventDefault(); run(async () => { await api(k.list, { method: 'POST', body: form }); setForm({}) }, `Added ${k.one}.`) }
  const remove = (r) => confirm(`Delete this ${k.one}?`) && run(() => api(`${k.list}/${r._id}`, { method: 'DELETE' }), `Deleted ${k.one}.`)
  const assign = (r, teacherId) => run(() => api(`/subjects/${r._id}/assign-teacher`, { method: 'PUT', body: { teacherId } }), 'Teacher assigned.')

  return (
    <>
      <h2>{label(kind)}</h2>
      <form className="panel grid" onSubmit={add}>
        <h3>Add {k.one}</h3>
        {k.fields.map((f) => (
          <label key={f}>{label(f)}
            <input type={f === 'password' ? 'password' : 'text'} required={!['phone', 'address'].includes(f)} value={form[f] || ''} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
          </label>
        ))}
        <button className="primary">Add {k.one}</button>
      </form>
      {msg && <div className="toast">{msg}</div>}
      <div className="scroll">
        <table>
          <thead><tr>{k.cols.map(([h]) => <th key={h}>{h}</th>)}{kind === 'subjects' && <th>Assign</th>}<th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id}>
                {k.cols.map(([h, fn]) => <td key={h}>{fn(r)}</td>)}
                {kind === 'subjects' && (
                  <td><select value="" onChange={(e) => e.target.value && assign(r, e.target.value)}>
                    <option value="">Choose teacher</option>
                    {teachers.map((t) => <option key={t._id} value={t._id}>{t.user?.name}</option>)}
                  </select></td>
                )}
                <td><button className="danger" onClick={() => remove(r)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="sub">Nothing here yet. Use the form above to add the first {k.one}.</p>}
      </div>
    </>
  )
}
