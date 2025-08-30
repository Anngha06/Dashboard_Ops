import Guard from '@/components/Guard'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
export default function Inbox(){
  const session=useAuth(s=>s.session)!
  const[to,setTo]=useState('');const[task,setTask]=useState('');const[due,setDue]=useState('');const[link,setLink]=useState('');const[rows,setRows]=useState<any[]>([])
  async function load(){const res=await api.list('inbox');setRows(res.rows||[])};useEffect(()=>{load()},[])
  async function send(){if(!task||!to)return;await api.create('inbox',{from:session.name,to,task,due_date:due,link_to_record:link,status:'New'});setTask('');setDue('');setLink('');await load()}
  async function convert(r:any){await api.create('tasks',{task:r.task,assignee:r.to,due_date:r.due_date,status:'Backlog'});await api.update('inbox',String(r.id),{status:'Converted to Task'});await load()}
  return(<Guard area='Inbox'><div className='max-w-6xl mx-auto p-6 space-y-4'>
    <div className='title'>Inbox</div>
    <div className='card'><div className='grid sm:grid-cols-4 gap-2'>
      <input className='input' placeholder='To (user)' value={to} onChange={e=>setTo(e.target.value)}/>
      <input className='input sm:col-span-2' placeholder='Task' value={task} onChange={e=>setTask(e.target.value)}/>
      <input className='input' type='date' value={due} onChange={e=>setDue(e.target.value)}/>
      <input className='input sm:col-span-3' placeholder='Link to record (optional)' value={link} onChange={e=>setLink(e.target.value)}/>
      <div><button className='btn btn-primary w-full' onClick={send}>Assign</button></div>
    </div></div>
    <div className='grid md:grid-cols-2 gap-3'>
      {rows.map(r=>(<div key={r.id} className='pill'>
        <div className='pill-title'>{r.task}</div>
        <div className='pill-meta mt-1'>To: {r.to} • From: {r.from} • Due: {r.due_date||'—'} • {r.status}</div>
        <div className='mt-2 flex gap-2'><button className='badge' onClick={()=>convert(r)}>Convert to Task</button></div>
      </div>))}
    </div>
  </div></Guard>)
}
