import { useState } from 'react'
import Guard from '@/components/Guard'
import { api } from '@/lib/api'
import { ColumnType } from '@/types'
const TYPES:ColumnType[]=['Text','LongText','Integer','Decimal','Currency','Date','DateTime','Email','Phone','URL','Enum','MultiSelect','User','Checkbox','FileRef','Formula','Auto']
export default function SettingsDrawer({open,onClose}:{open:boolean,onClose:()=>void}){
  const[tab,setTab]=useState('');const[cols,setCols]=useState<{column:string,type:ColumnType,enum_values?:string[]}[]>([{column:'id',type:'Auto'},{column:'_by',type:'Auto'},{column:'_ts',type:'Auto'}]);
  const addCol=()=>setCols([...cols,{column:'',type:'Text'}]);
  const save=async()=>{await api.addTab({tab,columns:cols});alert('Tab created');setTab('');setCols([{column:'id',type:'Auto'},{column:'_by',type:'Auto'},{column:'_ts',type:'Auto'}])};
  return(<div className={`fixed inset-0 ${open?'':'pointer-events-none'}`}>
    <div className={`absolute inset-0 backdrop ${open?'opacity-100':'opacity-0'} transition`} onClick={onClose}></div>
    <div className={`absolute right-0 top-0 bottom-0 w-[520px] p-4 drawer transition transform ${open?'translate-x-0':'translate-x-full'}`}>
      <div className='flex items-center justify-between mb-3'><div className='title'>Settings</div><button className='btn' onClick={onClose}>Close</button></div>
      <Guard area='AdminAddTab' need='CRUD'>
        <div className='card'>
          <div className='text-[15px] font-semibold mb-2'>Add Tab & Schema</div>
          <div className='grid grid-cols-3 gap-3'>
            <div className='col-span-3'><label className='block text-xs mb-1'>Tab name</label><input className='input w-full' value={tab} onChange={e=>setTab(e.target.value)} placeholder='e.g., Vendors'/></div>
            {cols.map((c,i)=>(<div key={i} className='col-span-3 grid grid-cols-3 gap-2'>
              <input className='input' placeholder='column' value={c.column} onChange={e=>{const a=[...cols];a[i].column=e.target.value;setCols(a)}}/>
              <select className='input' value={c.type} onChange={e=>{const a=[...cols];a[i].type=e.target.value as ColumnType;setCols(a)}}>{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
              <input className='input' placeholder='enum values (comma)' value={(c.enum_values||[]).join(',')} onChange={e=>{const a=[...cols];a[i].enum_values=e.target.value?e.target.value.split(',').map(s=>s.trim()):undefined;setCols(a)}}/>
            </div>))}
            <div className='col-span-3 flex gap-2'><button className='btn' onClick={addCol}>Add column</button><button className='btn btn-primary' onClick={save}>Create</button></div>
          </div>
        </div>
      </Guard>
    </div>
  </div>)
}
