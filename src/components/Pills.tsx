 // src/components/Pills.tsx
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import type { TabSchema, RecordData } from '@/types'

const HIDDEN = new Set(['id', '_by', '_ts']) // never editable

function pickLabel(r: RecordData) {
  return (
    (r as any).title ||
    (r as any).name ||
    (r as any).campaign_name ||
    (r as any).society_name ||
    (r as any).org ||
    `Record #${(r as any).id ?? ''}`
  )
}

export default function Pills({ tab, canEdit }: { tab: string; canEdit: boolean }) {
  const [schema, setSchema] = useState<TabSchema | null>(null)
  const [rows, setRows] = useState<RecordData[]>([])
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<RecordData | null>(null)
  const [form, setForm] = useState<RecordData>({})

  async function load() {
    const sc = (await api.schema(tab)) as TabSchema
    setSchema(sc)
    const res = await api.list(tab)
    setRows(res.rows || [])
  }
  useEffect(() => {
    load()
  }, [tab])

  const fields = useMemo(
    () =>
      (schema?.columns || []).filter(
        (c) => !HIDDEN.has(c.column) && c.type !== 'Auto'
      ),
    [schema]
  )

  const openNew = () => {
    setForm({})
    setDetail(null)
    setOpen(true)
  }
  const openDetail = (r: RecordData) => {
    setDetail(r)
    setOpen(true)
  }
  const del = async (r: RecordData) => {
    if (!r.id) return
    await api.remove(tab, String(r.id))
    await load()
  }
  const save = async () => {
    await api.create(tab, form) // _by and _ts are auto-stamped in api.ts / Apps Script
    setOpen(false)
    await load()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="title">{tab}</div>
          <div className="subtitle">Click a card to view</div>
        </div>
        {canEdit && (
          <button className="btn btn-primary" onClick={openNew}>
            Add
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {rows.map((r, i) => (
          <div key={i} className="pill" onClick={() => openDetail(r)}>
            <div className="pill-title">{pickLabel(r)}</div>
            <div className="pill-meta mt-1">
              {Object.entries(r)
                .filter(([k]) => !HIDDEN.has(k))
                .slice(0, 4)
                .map(([k, v]) => `${k}: ${String(v)}`)
                .join('  •  ')}
            </div>
            {canEdit && r.id && (
              <div className="mt-2">
                <button
                  className="badge"
                  onClick={(e) => {
                    e.stopPropagation()
                    del(r)
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 backdrop grid place-items-center p-6">
          <div className="modal w/full max-w-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="title">{detail ? 'Record' : 'New record'}</div>
              <button className="btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            {detail ? (
              <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
                {Object.entries(detail).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs mb-1">{k}</div>
                    <div className="input w-full">{String(v)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
                  {fields.map((c) => (
                    <div key={c.column}>
                      <label className="block text-xs mb-1">{c.column}</label>
                      {c.type === 'Enum' && c.enum_values ? (
                        <select
                          className="input w-full"
                          onChange={(e) =>
                            setForm({ ...form, [c.column]: e.target.value })
                          }
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {c.enum_values.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="input w-full"
                          onChange={(e) =>
                            setForm({ ...form, [c.column]: e.target.value })
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button className="btn" onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={save}>
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
