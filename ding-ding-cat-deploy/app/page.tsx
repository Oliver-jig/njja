'use client'
import { useState, useRef } from 'react'

const FESTIVALS = [
  { id:'lunar',     label:'🧧 Lunar New Year', color:'#ef4444', glow:'rgba(239,68,68,0.2)',  dot:'#fca5a5', hint:'Red envelopes, lanterns, gold coins & fireworks', desc:'red lanterns, gold coins, fireworks, lucky symbols', picks:[['🏮 Lantern dance','dancing with red lanterns'],['🧧 Red envelope','holding a lucky red envelope'],['🐉 Lucky dragon','riding a golden dragon'],['🎆 Fireworks','watching fireworks'],['🍡 Tangyuan','eating tangyuan'],['👘 Cheongsam','wearing a cheongsam dress']] },
  { id:'christmas', label:'🎄 Christmas',       color:'#22c55e', glow:'rgba(34,197,94,0.2)',  dot:'#86efac', hint:'Christmas trees, santa hat, snow & presents',         desc:'Christmas tree, santa hat, snow, presents, reindeer', picks:[['🎅 Santa hat','wearing a santa hat'],['🎁 Gift','unwrapping a present'],['⛄ Snowman','building a snowman'],['🦌 Reindeer','riding Rudolph'],['🍪 Cookies','baking Christmas cookies'],['🎶 Caroling','singing carols']] },
  { id:'halloween', label:'🎃 Halloween',        color:'#f97316', glow:'rgba(249,115,22,0.2)', dot:'#fdba74', hint:'Pumpkins, witch hats, bats & spooky night',            desc:'jack-o-lantern, witch hat, bats, spooky night moon',  picks:[['🎃 Pumpkin','inside a glowing pumpkin'],['🧙 Witch','wearing a witch hat'],['🦇 Bats','flying with bat wings'],['👻 Ghost','dressed as a ghost'],['🕷 Spider','tangled in a spider web'],['🍬 Candy','trick or treating']] },
  { id:'valentine', label:'💝 Valentine',        color:'#ec4899', glow:'rgba(236,72,153,0.2)', dot:'#f9a8d4', hint:'Hearts, roses, love letters & romance',                desc:'hearts, roses, love letters, cupid arrow, romance',   picks:[['💌 Letter','writing a love letter'],['🌹 Roses','holding red roses'],['💘 Cupid','hit by cupid arrow'],['🍫 Chocolates','giving chocolates'],['🥂 Cheers','toasting champagne'],['💕 Hearts','floating with hearts']] },
  { id:'easter',    label:'🐣 Easter',           color:'#a78bfa', glow:'rgba(167,139,250,0.2)',dot:'#c4b5fd', hint:'Easter eggs, bunny ears, spring flowers & pastels',   desc:'Easter eggs, bunny ears, spring flowers, pastel colors',picks:[['🥚 Easter egg','decorating an Easter egg'],['🐰 Bunny','wearing bunny ears'],['🌸 Flowers','in cherry blossoms'],['🐤 Chick','holding a baby chick'],['🍭 Candy hunt','finding candy'],['🌈 Rainbow','hopping over rainbow']] },
]
const MSGS = ['Ding Ding is posing...','Adding festival magic...','Painting whiskers...','Almost ready!']

export default function Home() {
  const [fest, setFest] = useState(FESTIVALS[0])
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [msg, setMsg] = useState(MSGS[0])
  const timer = useRef<any>(null)

  const pick = (f: typeof FESTIVALS[0]) => { setFest(f); setOpen(false); setImage(null); setError(null); setPrompt('') }

  const generate = async (p?: string) => {
    const q = p || prompt; if (!q.trim()) return
    setLoading(true); setError(null); setImage(null); setMsg(MSGS[0])
    let i = 0; timer.current = setInterval(() => { i=(i+1)%MSGS.length; setMsg(MSGS[i]) }, 1800)
    try {
      const r = await fetch('/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt:q, festival:fest.label, festivalDesc:fest.desc }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      setImage(d.image)
    } catch(e:any) { setError(e.message) }
    finally { setLoading(false); clearInterval(timer.current) }
  }

  const S = { // shared styles
    page:   { minHeight:'100vh', background:'#111', padding:'40px 16px' } as React.CSSProperties,
    wrap:   { maxWidth:520, margin:'0 auto', display:'flex', flexDirection:'column' as const, gap:20 },
    label:  { fontSize:11, fontWeight:500, color:'#555', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:10 },
    canvas: { background:'#1a1a1a', border:`1.5px solid ${image||loading ? fest.color+'55' : '#2a2a2a'}`, borderRadius: image ? '14px 14px 0 0' : 14, minHeight:260, display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' as const, transition:'border-color 0.3s' },
  }

  return (
    <main style={S.page}>
      <div style={S.wrap}>
        <div>
          <h1 style={{fontSize:22,fontWeight:600,color:'#fff',marginBottom:4}}>🐱 Ding Ding Cat Sticker Generator</h1>
          <p style={{fontSize:13,color:'#555'}}>Describe a cat sticker and let AI bring it to life</p>
        </div>

        {/* Dropdown */}
        <div>
          <div style={S.label}>Festival style</div>
          <div style={{position:'relative'}}>
            <button onClick={()=>setOpen(!open)} style={{width:'100%',height:48,background:'#1e1e1e',border:`1.5px solid ${open?fest.color:'#2e2e2e'}`,borderRadius:open?'10px 10px 0 0':10,padding:'0 16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:14,fontWeight:500,color:'#fff'}}>{fest.label}</span>
              <span style={{color:'#555',fontSize:11,transform:open?'rotate(180deg)':'none',transition:'transform 0.2s',display:'inline-block'}}>▼</span>
            </button>
            {open && (
              <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:99,background:'#1a1a1a',border:`1.5px solid ${fest.color}`,borderTop:'none',borderRadius:'0 0 10px 10px',overflow:'hidden'}}>
                {FESTIVALS.map((f,i) => (
                  <button key={f.id} onClick={()=>pick(f)} style={{width:'100%',padding:'12px 16px',background:f.id===fest.id?f.color+'22':'transparent',border:'none',borderBottom:i<FESTIVALS.length-1?'1px solid #2a2a2a':'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontSize:14,color:f.id===fest.id?f.color:'#ccc',fontWeight:f.id===fest.id?600:400}}>{f.label}</span>
                    {f.id===fest.id && <span style={{color:fest.color}}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        <div style={{fontSize:12,padding:'8px 14px',borderRadius:8,background:fest.glow,color:fest.dot,border:`1px solid ${fest.color}33`}}>✨ {fest.hint}</div>

        {/* Input */}
        <div>
          <div style={S.label}>Describe your sticker</div>
          <div style={{display:'flex',gap:8}}>
            <input value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&generate()} onClick={()=>setOpen(false)}
              placeholder={`e.g. ${fest.picks[0][1]}`} disabled={loading}
              style={{flex:1,height:48,background:'#1e1e1e',border:'1.5px solid #2e2e2e',borderRadius:10,padding:'0 16px',fontSize:13,color:'#fff',outline:'none'}}/>
            <button onClick={()=>{setOpen(false);generate()}} disabled={loading||!prompt.trim()}
              style={{height:48,padding:'0 20px',borderRadius:10,border:'none',fontSize:13,fontWeight:600,color:'#fff',background:fest.color,boxShadow:`0 0 20px ${fest.glow}`,opacity:loading||!prompt.trim()?0.4:1,cursor:'pointer',whiteSpace:'nowrap'}}>
              {loading?'⏳':'✦'} Generate
            </button>
          </div>
        </div>

        {/* Quick picks */}
        <div>
          <div style={S.label}>Quick picks</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {fest.picks.map(([l,p])=>(
              <button key={l} onClick={()=>{setOpen(false);setPrompt(p as string);generate(p as string)}} disabled={loading}
                style={{padding:'5px 12px',borderRadius:20,border:'1px solid #2a2a2a',background:'#1a1a1a',color:'#666',fontSize:12,cursor:'pointer',opacity:loading?0.4:1}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={S.canvas} onClick={()=>setOpen(false)}>
          {!loading && !image && !error && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
              <span style={{fontSize:38,opacity:0.18}}>🐾</span>
              <p style={{fontSize:13,color:'#3a3a3a'}}>Your sticker will appear here</p>
            </div>
          )}
          {loading && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
              <div className="cat-bounce" style={{fontSize:50}}>🐱</div>
              <p style={{fontSize:13,fontWeight:500,color:fest.dot}}>{msg}</p>
              <div style={{display:'flex',gap:6}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:7,height:7,borderRadius:'50%',background:fest.dot,animation:`bounce-cat ${0.8}s ease-in-out ${i*0.15}s infinite`}}/>
                ))}
              </div>
            </div>
          )}
          {error && !loading && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
              <span style={{fontSize:32}}>😿</span>
              <p style={{fontSize:13,color:'#f87171'}}>{error}</p>
              <button onClick={()=>setError(null)} style={{padding:'6px 16px',borderRadius:8,border:'1px solid #333',background:'transparent',color:'#888',cursor:'pointer',fontSize:12}}>Try again</button>
            </div>
          )}
          {image && !loading && (
            <img src={image} alt="sticker" className="sticker-pop" style={{maxHeight:260,objectFit:'contain',borderRadius:12}}/>
          )}
        </div>

        {/* Download bar */}
        {image && !loading && (
          <div style={{display:'flex',gap:8,background:'#1a1a1a',border:`1.5px solid ${fest.color}55`,borderTop:'1px solid #2a2a2a',borderRadius:'0 0 14px 14px',padding:'12px 16px',marginTop:-20}}>
            <button onClick={()=>{const a=document.createElement('a');a.href=image;a.download=`ding-ding-${fest.id}-${Date.now()}.png`;a.click()}}
              style={{flex:1,height:42,borderRadius:10,border:'none',background:fest.color,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',boxShadow:`0 0 12px ${fest.glow}`}}>
              ↓ Download sticker
            </button>
            <button onClick={()=>{setImage(null);setPrompt('');setError(null)}}
              style={{padding:'0 16px',height:42,borderRadius:10,border:'1.5px solid #333',background:'transparent',color:'#777',fontSize:13,cursor:'pointer'}}>
              ↺ New
            </button>
          </div>
        )}

        <p style={{textAlign:'center',fontSize:11,color:'#2a2a2a',paddingBottom:8}}>Made with 💕 by tramplus · Powered by Gemini Nano Banana 2</p>
      </div>
    </main>
  )
}
