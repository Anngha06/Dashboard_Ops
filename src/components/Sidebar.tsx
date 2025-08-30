// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
const items=[{to:'/',label:'Home'},{to:'/inbox',label:'Inbox'},{to:'/tasks',label:'Tasks'},{to:'/todo',label:'My Tasks'},{to:'/attendance',label:'Attendance'},{to:'/lead',label:'Lead Generation'},{to:'/cold',label:'Cold Calling'},{to:'/content',label:'Content'},{to:'/pipelines',label:'Pipelines'},{to:'/campaigns',label:'Campaigns'},{to:'/calendar',label:'Calendar'},{to:'/meetings',label:'Meetings & Notes'},{to:'/people',label:'People'},{to:'/approvals',label:'Approvals'},{to:'/integrations',label:'Integrations'}]
export default function Sidebar(){
  const session=useAuth(s=>s.session)
  return(<aside className='sidebar fixed left-0 top-0 bottom-0 border-r'>
    <div className='px-4 py-5'>
      <div className='text-[18px] font-semibold'>AceInt • Virtual Office</div>
      <div className='subtitle mt-1'>Shades of white & blue</div>
    </div>
    <nav className='px-3 pb-24 space-y-1 overflow-y-auto h-[calc(100%-140px)]'>
      {items.map(i=>(<NavLink key={i.to} to={i.to} end className={({isActive})=>(isActive?'active':'')}>{i.label}</NavLink>))}
    </nav>
    <div className='absolute bottom-3 left-3 right-3'>
      <div className='badge w-full text-center'>{session?.name} • {session?.role}</div>
    </div>
  </aside>)
}
 