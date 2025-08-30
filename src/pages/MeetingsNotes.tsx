 // src/pages/MeetingsNotes.tsx
import Guard from '@/components/Guard'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Row = {
  id?: number | string
  date?: string
  type?: string
  participants?: string
  org?: string
  notes?: string
  next_actions?: string
  _by?: string
  _ts?: string
}

export default function MeetingsNotes() {
  const [rows, setRows] = useState<Row[]>([])
  const [form, setForm] = useState<Row>({
    type: 'Outreach',
    date: '',
    participants: '',
    org: '',
    notes: '',
    next_actions: '',
  })

  async function load() {
    const r = await api.list('meetings_notes')
    setRows(r.rows || [])
  }
  useEffect(() => { load() }, [])

  async function save() {
    await api.create('meetings_notes', form)
    setForm({ type: 'Outreach', date: '', participants: '', org: '', notes: '', next_actions: '' })
    await load()
  }

  async function remove(id?: string | number) {
    if (!id) return
    await api.remove('meetings_notes', String(id))
    await load()
  }

  return (
    <Guard area="MeetingsNotes">
      <div className="max-w-6xl mx-auto p-6 space-y-5">
        <div className="title">Meetings & Notes</div>

        {/* Inline form */}
        <div className="card grid sm:grid-cols-4 gap-3">
          <input
            className="input"
            type="date"
            value={form.date || ''}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            className="input"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>Outreach</option>
            <option>Internal</option>
            <option>Partner</option>
          </select>
          <input
            className="input sm:col-span-2"
            placeholder="Participants (comma-separated)"
            value={form.participants || ''}
            onChange={(e) => setForm({ ...form, participants: e.target.value })}
          />
          <input
            className="input"
            placeholder="Organization"
            value={form.org || ''}
            onChange={(e) => setForm({ ...form, org: e.target.value })}
          />
          <input
            className="input sm:col-span-3"
            placeholder="Notes"
            value={form.notes || ''}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <input
            className="input sm:col-span-3"
            placeholder="Next actions (links/tasks)"
            value={form.next_actions || ''}
            onChange={(e) => setForm({ ...form, next_actions: e.target.value })}
          />
          <div className="sm:col-span-1 flex justify-end">
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </div>

        {/* List as pills */}
        <div className="grid md:grid-cols-2 gap-3">
          {rows.map((r) => (
            <div key={r.id as any} className="pill">
              <div className="pill-title">{r.date || '—'} • {r.type || '—'}</div>
              <div className="pill-meta mt-1">
                {r.org || '—'} • {r.participants || '—'}
              </div>
              {r.notes && <div className="mt-2 text-sm">{r.notes}</div>}
              {r.next_actions && <div className="mt-1 text-xs subtitle">Next: {r.next_actions}</div>}
              <div className="mt-2 flex gap-2">
                <button className="badge" onClick={() => remove(r.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Guard>
  )
}
