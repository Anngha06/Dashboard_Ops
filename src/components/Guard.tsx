import { useAuth } from '@/lib/auth'
import { can, Area, Permission } from '@/lib/roles'
export default function Guard({area,need='Read',children}:{area:Area,need?:Permission,children:React.ReactNode}){const session=useAuth(s=>s.session);if(!session)return null;if(!can(session.role,area,need))return <div className='p-6 subtitle'>No access.</div>;return <>{children}</>}