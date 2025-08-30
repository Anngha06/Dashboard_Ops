const QUOTES=[
  'The best way to predict the future is to create it. — Peter Drucker',
  'Action is the foundational key to all success. — Pablo Picasso',
  'Make it simple. Make it memorable. Make it inviting to look at. — Leo Burnett',
  'Well begun is half done. — Aristotle',
  'What gets measured gets managed. — Peter Drucker'
]

export default function QuoteModal({open,onClose}:{open:boolean,onClose:()=>void}){
  const q=QUOTES[Math.floor(Math.random()*QUOTES.length)]
  if(!open) return null
  return (
    <div className="fixed inset-0 backdrop grid place-items-center p-6">
      <div className="modal w-full max-w-xl p-6">
        <div className="text-lg font-semibold mb-2">Welcome</div>
        <div className="text-[15px] mb-4">{q}</div>
        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={onClose}>Start</button>
        </div>
      </div>
    </div>
  )
}
