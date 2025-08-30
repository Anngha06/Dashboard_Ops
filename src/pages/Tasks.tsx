import Guard from '@/components/Guard'
import { useAuth } from '@/lib/auth'
import Kanban from '@/components/Kanban'
export default function Tasks(){const session=useAuth(s=>s.session)!;const canEdit=session.role!=='Viewer'&&session.role!=='InternChecker';return(<Guard area='Tasks'><div className='max-w-7xl mx-auto p-6'><div className='title mb-3'>Tasks</div><Kanban tab='tasks' canEdit={canEdit}/></div></Guard>)}