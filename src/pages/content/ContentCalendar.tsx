 // src/pages/content/ContentCalendar.tsx
import Guard from '@/components/Guard';import SubTabs from '@/components/SubTabs';import Pills from '@/components/Pills';import { useAuth } from '@/lib/auth';import { useState } from 'react';
const tabs=['content_calendar','tasks','campaigns','info_needed','social_media','interns_hiring','expenses']; // attendance removed
export default function ContentCalendar(){
  const[t,setT]=useState(tabs[0]);const session=useAuth(s=>s.session)!;
  const canEdit=['Admin','ContentOwner'].includes(session.role);
  return(<Guard area='Content'><div className='max-w-6xl mx-auto p-6'><SubTabs items={tabs} value={t} onChange={setT}/><Pills tab={t} canEdit={canEdit}/></div></Guard>)
}
