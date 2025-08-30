// src/lib/roles.ts
export type { Permission, Role } from '@/types'

export type Area =
  | 'Home' | 'LeadGeneration' | 'ColdCalling' | 'Content' | 'Campaigns'
  | 'Approvals' | 'Calendar' | 'MeetingsNotes' | 'People' | 'Integrations'
  | 'AdminAddTab' | 'Inbox' | 'Tasks' | 'Attendance' | 'Pipelines' | 'MyTasks'

export const permissionMatrix: Record<Area, Partial<Record<Role, Permission>>> = {
  Home:            { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  LeadGeneration:  { Admin:'CRUD', LeadGenOwner:'CRUD', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  ColdCalling:     { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'CRUD', ContentOwner:'Read', InternChecker:'CheckOnly', Viewer:'Read' },
  Content:         { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'CRUD', InternChecker:'Read', Viewer:'Read' },
  Campaigns:       { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  Approvals:       { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  Calendar:        { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  MeetingsNotes:   { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  People:          { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  Integrations:    { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  AdminAddTab:     { Admin:'CRUD' },
  Inbox:           { Admin:'CRUD', LeadGenOwner:'CRUD', ColdCallingOwner:'CRUD', ContentOwner:'CRUD', InternChecker:'Read', Viewer:'Read' },
  Tasks:           { Admin:'CRUD', LeadGenOwner:'CRUD', ColdCallingOwner:'CRUD', ContentOwner:'CRUD', InternChecker:'Read', Viewer:'Read' },
  Attendance:      { Admin:'CRUD', LeadGenOwner:'Read', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  Pipelines:       { Admin:'CRUD', LeadGenOwner:'CRUD', ColdCallingOwner:'Read', ContentOwner:'Read', InternChecker:'Read', Viewer:'Read' },
  MyTasks:         { Admin:'CRUD', LeadGenOwner:'CRUD', ColdCallingOwner:'CRUD', ContentOwner:'CRUD', InternChecker:'Read', Viewer:'Read' },
}

export const can = (role: Role, area: Area, need: Permission) => {
  const p = permissionMatrix[area]?.[role] || 'None'
  if (need === 'Read') return p !== 'None'
  if (need === 'CheckOnly') return p === 'CheckOnly' || p === 'CRUD'
  if (need === 'CRUD') return p === 'CRUD'
  return false
}
