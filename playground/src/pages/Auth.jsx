import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Art from '../components/Art'
import { Page } from '../components/ui'
import { useApp } from '../lib/store'

// Demo auth: no password is stored or verified. Replace with Supabase Auth.
function AuthForm({ mode }) {
  const { login } = useApp(); const nav = useNavigate(); const { state } = useLocation()
  const [f, setF] = useState({ name: '', email: '', password: '', admin: false }); const [err, setErr] = useState({})
  const reg = mode === 'register'
  const submit = (e) => {
    e.preventDefault(); const er = {}
    if (reg && f.name.trim().length < 2) er.name = 'Enter a display name'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'
    if (f.password.length < 8) er.password = 'Use at least 8 characters'
    setErr(er); if (Object.keys(er).length) return
    login({ name: f.name.trim() || f.email.split('@')[0], email: f.email, role: f.admin ? 'admin' : 'user' })
    nav(state?.from || '/dashboard', { replace: true })
  }
  // Plain function (not a component) so inputs keep focus between renders.
  const field = (k, label, type = 'text', p = {}) => (
    <div key={k}><label className="label" htmlFor={k}>{label}</label><input id={k} type={type} className={`field ${err[k] ? '!border-red-500' : ''}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} {...p} />{err[k] && <p className="mt-1 text-xs text-red-400">{err[k]}</p>}</div>
  )
  return (
    <Page title={reg ? 'Create account' : 'Sign in'} wide>
      <div className="container-x grid min-h-[70vh] items-center gap-12 py-12 lg:grid-cols-2">
        <form onSubmit={submit} noValidate className="mx-auto w-full max-w-sm space-y-4">
          <h1 className="text-3xl font-bold">{reg ? 'Join PLAYGROUND' : 'Welcome back'}</h1>
          <p className="text-sm text-mute">{reg ? 'Save assets, track downloads and publish your work.' : 'Sign in to access downloads, favorites and your designs.'}</p>
          {reg && field('name', 'Display name', 'text', { autoComplete: 'nickname' })}
          {field('email', 'Email', 'email', { autoComplete: 'email' })}
          {field('password', 'Password', 'password', { autoComplete: reg ? 'new-password' : 'current-password' })}
          <label className="flex items-center gap-2 text-xs text-mute"><input type="checkbox" checked={f.admin} onChange={(e) => setF({ ...f, admin: e.target.checked })} className="accent-[#FF4D3D]" />Demo: sign in as admin (shows the Admin CMS)</label>
          <button className="btn btn-primary w-full h-11">{reg ? 'Create account' : 'Sign in'}</button>
          <p className="text-center text-sm text-mute">{reg ? 'Already have an account?' : 'New here?'} <Link to={reg ? '/login' : '/register'} state={state} className="text-accent hover:underline">{reg ? 'Sign in' : 'Create an account'}</Link></p>
        </form>
        <div className="hidden aspect-[4/5] max-h-[560px] overflow-hidden rounded-2xl border border-line lg:block"><Art kind="hood" seed={4} /></div>
      </div>
    </Page>
  )
}
export const Login = () => <AuthForm mode="login" />
export const Register = () => <AuthForm mode="register" />
