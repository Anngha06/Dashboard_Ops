 // src/components/Kanban.tsx
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { RecordData } from '@/types'

const STATUSES = ['Backlog', 'In-Progress', 'Waiting', 'Review', 'Done'] as const

export default function Kanban({
  tab = 'tasks',
  canEdit,
  assignee,
}: {
  tab?: string
  canEdit: boolean
  assignee?: string
}) {
  const [rows, setRows] = useState<RecordData[]>([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('P2')

  async function load() {
    const res = await api.list(tab)
    let r = res.rows || []
    if (assignee) r = r.filter((x: any) => String(x.assignee || '') === assignee)
    setRows(r)
  }
  useEffect(() => {
    load()
  }, [tab, assignee])

  async function move(r: RecordData, status: string) {
    if (!canEdit) return
    const patch: any = { status }
    if (status === 'Done') patch.completed_at = new Date().toISOString()
    await api.update(tab, String(r.id), patch)
    await load()
  }

  async function add() {
    if (!canEdit || !title.trim()) return
    await api.create(tab, {
      task: title.trim(),
      status: 'Backlog',
      priority,
      created_at: new Date().toISOString(),
    })
    setTitle('')
    await load()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {canEdit && (
          <>
            <input
              className="input"
              placeholder="New task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>P0</option>
              <option>P1</option>
              <option>P2</option>
            </select>
            <button className="btn btn-primary" onClick={add}>
              + New Task
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {STATUSES.map((st) => (
          <div key={st} className="card">
            <div className="text-sm font-semibold mb-2 flex items-center justify-between">
              {st}
              <span className="badge">
                {rows.filter((r) => r.status === st).length}
              </span>
            </div>
            <div className="space-y-3 min-h-[220px]">
              {rows
                .filter((r) => r.status === st)
                .map((r) => (
                  <div key={r.id} className="pill">
                    <div className="pill-title">{(r as any).task || r.title}</div>
                    <div className="pill-meta mt-1">
                      {r.assignee ? `Assignee: ${r.assignee} • ` : ''}
                      Priority: {(r as any).priority || '—'}
                    </div>
                    {canEdit && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {STATUSES.filter((s) => s !== st).map((s) => (
                          <button
                            key={s}
                            className="badge"
                            onClick={() => move(r, s)}
                          >
                            Move to {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
