import { Role } from '@/types'
export type Credential={name:string;password:string;role:Role}
export const CREDENTIALS:Credential[]=[
  {name:'Anngha',password:'Admin@123',role:'Admin'},
  {name:'Shruti',password:'Admin@456',role:'Admin'},
  {name:'Prisha',password:'Lead2025!',role:'LeadGenOwner'},
  {name:'Shriya',password:'Cold2025!',role:'ColdCallingOwner'},
  {name:'Anshita',password:'Content2025!',role:'ContentOwner'},
  {name:'Sejal',password:'ContentX2025!',role:'ContentOwner'},
  {name:'Intern',password:'2025',role:'InternChecker'},
  {name:'Viewer',password:'Readonly',role:'Viewer'}
]
export const verifyLogin=(n:string,p:string)=>CREDENTIALS.find(c=>c.name===n&&c.password===p)||null
