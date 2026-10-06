import { useState } from 'react'
import { api } from './api'

export default function Login({ onLogin }) {
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const d = await api('/auth/login', { method: 'POST', body: f })
      localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(d.user))
      onLogin(d.user)
    } catch (e) { setErr(e.message) }
  }
  return (
    <div className="login">
      <form onSubmit={submit}>
        <h1>Sign in</h1>
        <p>Find out which teachers are in their cabin before you walk over.</p>
        <label>Email<input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label>Password<input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {err && <div className="err">{err}</div>}
        <button className="primary">Sign in</button>
      </form>
    </div>
  )
}
