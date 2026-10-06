import { useState } from 'react'
import Login from './Login'
import Availability from './Availability'
import { Overview, Manage } from './Admin'
import Staff from './Staff'
import { Attendance, Marks } from './Student'

const NAV = {
  admin: [['overview', 'Overview'], ['teachers', 'Teachers'], ['students', 'Students'], ['subjects', 'Subjects'], ['cabins', 'Cabin status']],
  teacher: [['cabins', 'My cabin'], ['work', 'Attendance & marks']],
  student: [['cabins', "Who's in"], ['attendance', 'My attendance'], ['marks', 'My marks']],
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [page, setPage] = useState(null)
  if (!user) return <Login onLogin={setUser} />

  const nav = NAV[user.role]
  const current = page || nav[0][0]
  const logout = () => { localStorage.clear(); setUser(null) }
  const views = {
    overview: <Overview />,
    teachers: <Manage kind="teachers" />,
    students: <Manage kind="students" />,
    subjects: <Manage kind="subjects" />,
    cabins: <Availability role={user.role} />,
    work: <Staff />,
    attendance: <Attendance />,
    marks: <Marks />,
  }
  return (
    <div className="shell">
      <aside>
        <h1>College<br />Management</h1>
        <nav>
          {nav.map(([id, label]) => (
            <button key={id} className={id === current ? 'on' : ''} onClick={() => setPage(id)}>{label}</button>
          ))}
        </nav>
        <div className="me"><b>{user.name}</b><span>{user.role}</span><button onClick={logout}>Sign out</button></div>
      </aside>
      <main key={current}>{views[current]}</main>
    </div>
  )
}
