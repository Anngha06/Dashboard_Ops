// src/components/Login.tsx
import { useState } from 'react'
import { verifyLogin } from '@/config/credentials'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import { api, setActor } from '@/lib/api'

export default function Login(){
  const login=useAuth(s=>s.login)
  const theme=useTheme(s=>s.theme); const toggle=useTheme(s=>s.toggle)
  const[name,setName]=useState(''); const[password,setPassword]=useState(''); const[err,setErr]=useState('')

  const submit=async(e:React.FormEvent)=>{ 
    e.preventDefault(); 
    const hit=verifyLogin(name,password); 
    if(!hit){ setErr('Invalid credentials'); return } 
    login({name:hit.name,role:hit.role}); 
    setActor(hit.name); 
    await api.create('login_audit',{user:hit.name,action:'login'})
  }

  return(<div className='min-h-screen grid place-items-center'>
    <div className='relative w-full max-w-md'>
      <div className='absolute inset-0 blur-3xl opacity-40 bg-gradient-to-tr from-brand-400 via-brand-600 to-brand-800 rounded-3xl'></div>
      <div className='relative card'>
        <div className='flex items-center justify-between mb-4'><h1 className='text-2xl font-semibold'>AceInt • Virtual Office</h1><button className='btn' onClick={toggle}>{theme==='light'?'Light':'Dark'}</button></div>
        <form onSubmit={submit} className='space-y-4'>
          <div><label className='block text-sm mb-1'>Username (case-sensitive)</label><input className='input w-full' value={name} onChange={e=>setName(e.target.value)} required/></div>
          <div><label className='block text-sm mb-1'>Password</label><input className='input w-full' type='password' value={password} onChange={e=>setPassword(e.target.value)} required/></div>
          {err&&<div className='text-red-500 text-sm'>{err}</div>}
          <div className='flex items-center justify-between'><button className='btn btn-primary' type='submit'>Enter</button></div>
        </form>
      </div>
    </div>
  </div>)
}

