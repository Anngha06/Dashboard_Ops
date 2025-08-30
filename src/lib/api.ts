// src/lib/api.ts
import { mockApi } from './mockApi'
import type { RecordData, TabSchema } from '@/types'

const GAS_URL = import.meta.env.VITE_GAS_URL || ''
const headers = {'Content-Type': 'application/json'}
let ACTOR = 'system'
export const setActor = (name: string) => { ACTOR = name || 'system' }

async function safeJson(res: Response) {
  const t = await res.text()
  try { return JSON.parse(t) } catch { throw new Error('NON_JSON') }
}
const withAudit = (data: RecordData) => ({
  ...data,
  _by: data._by ?? ACTOR,
  _ts: data._ts ?? new Date().toISOString(),
})

export const api = {
  async tabs(){ if(!GAS_URL) return mockApi.tabs(); try{const r=await fetch(`${GAS_URL}?action=tabs`); const j=await safeJson(r); return j.tabs||[]}catch{return mockApi.tabs()}},
  async schema(tab?:string){ if(!GAS_URL) return mockApi.schema(tab); try{const url=tab?`${GAS_URL}?action=schema&tab=${encodeURIComponent(tab)}`:`${GAS_URL}?action=schema`; const r=await fetch(url); return await safeJson(r)}catch{return mockApi.schema(tab)}},
  async list(tab:string){ if(!GAS_URL) return mockApi.list(tab); try{const r=await fetch(`${GAS_URL}?action=list&tab=${encodeURIComponent(tab)}`); return await safeJson(r)}catch{return mockApi.list(tab)}},
  async create(tab:string,data:RecordData){ const body={action:'create',tab,data:withAudit(data)}; if(!GAS_URL) return mockApi.create(tab,body.data); try{const r=await fetch(GAS_URL,{method:'POST',headers,body:JSON.stringify(body)}); return await safeJson(r)}catch{return mockApi.create(tab,body.data)}},
  async update(tab:string,id:string,data:RecordData){ const body={action:'update',tab,id,data:withAudit(data)}; if(!GAS_URL) return mockApi.update(tab,id,body.data); try{const r=await fetch(GAS_URL,{method:'POST',headers,body:JSON.stringify(body)}); return await safeJson(r)}catch{return mockApi.update(tab,id,body.data)}},
  async remove(tab:string,id:string){ if(!GAS_URL) return mockApi.remove(tab,id); try{const r=await fetch(GAS_URL,{method:'POST',headers,body:JSON.stringify({action:'delete',tab,id})}); return await safeJson(r)}catch{return mockApi.remove(tab,id)}},
  async addTab(payload:{tab:string,columns:{column:string,type:string,enum_values?:string[]}[]}){ if(!GAS_URL) return mockApi.addTab(payload); try{const r=await fetch(GAS_URL,{method:'POST',headers,body:JSON.stringify({action:'addTab',...payload})}); return await safeJson(r)}catch{return mockApi.addTab(payload)}},
}
