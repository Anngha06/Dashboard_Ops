 // src/components/Header.tsx
import ThemeToggle from '@/components/ThemeToggle'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'

export default function Header({onOpenSettings}:{onOpenSettings:()=>void}){
  const session=useAuth(s=>s.session)
  const logout=useAuth(s=>s.logout)
  async function onLogout(){
    if(session) await api.create('login_audit',{user:session.name,action:'logout'})
    logout()
  }
  return(
    <header className='sticky top-0 z-10 ml-sidebar'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-2'>
        <div className='kicker'>Workspace</div>
        <div className='ml-auto flex items-center gap-2'>
          <button className='btn' onClick={onOpenSettings} title='Settings'>Settings ⚙️</button>
          <ThemeToggle/>
          <div className='badge'>{session?.name} • {session?.role}</div>
          <button className='btn' onClick={onLogout}>Logout</button>
        </div>
      </div>
    </header>
  )
}
