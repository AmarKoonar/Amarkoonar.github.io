"use client";
import { useEffect, useRef, useState } from 'react';
import { execute, complete, HOME } from '@/lib/terminal.mjs';
import { useWorld } from './WorldContext';
import SnakeGame from './SnakeGame';
export default function Terminal(){
  const world=useWorld(),shell=world.shell.current;
  const [input,setInput]=useState(''), [revision,refresh]=useState(0), [pager,setPager]=useState(null),[page,setPage]=useState(0),[busy,setBusy]=useState(false);
  const field=useRef(), output=useRef(), historyIndex=useRef(shell.history.length), draft=useRef('');
  useEffect(()=>{if(world.program!=='snake'&&!pager&&!busy)field.current?.focus({preventScroll:true});},[world.program,pager,busy]);
  useEffect(()=>{if(output.current)output.current.scrollTop=output.current.scrollHeight;},[revision,world.program]);
  const add=(text,type)=>{if(text)shell.output.push({text,type});if(shell.output.length>150)shell.output.splice(0,shell.output.length-150);refresh(n=>n+1);};
  const submit=async(e)=>{e.preventDefault();if(busy||!input.trim())return;const line=input;setInput('');add(`amar@workspace:${shell.cwd.replace(HOME,'~')}$ ${line}`,'command');const result=execute(shell,line);historyIndex.current=shell.history.length;draft.current='';if(result.clear){shell.output=[];refresh(n=>n+1);}else if(result.pager){setPager(result.text.split('\n'));setPage(0);}else add(result.text);if(result.action){setBusy(true);try{add(await world.run(result.action,result.args));}finally{setBusy(false);field.current?.focus({preventScroll:true});}}};
  const exitProgram=()=>{world.setProgram(null);add('Process exited with code 0.');};
  const musicAction=async(action,args)=>{add(await world.musicControl(action,args));};
  return <div className="terminal" onKeyDown={e=>{
    if(e.key==='Escape'&&(world.program||pager)){e.preventDefault();e.stopPropagation();if(pager)setPager(null);else exitProgram();}
    if(pager){if(['q','Q'].includes(e.key)){setPager(null);e.preventDefault();}if([' ','ArrowDown','PageDown'].includes(e.key)){setPage(n=>Math.min(Math.max(0,pager.length-8),n+8));e.preventDefault();}if(['ArrowUp','PageUp'].includes(e.key)){setPage(n=>Math.max(0,n-8));e.preventDefault();}}
  }}>
    <header className="terminal-title"><span><i/><i/><i/></span><strong>amar@workspace: {world.program?world.program+'.exe':'~'}</strong>{world.program?<button onClick={exitProgram}>Exit program ↵</button>:<span>PortfolioOS</span>}</header>
    {world.program==='snake'?<div className="terminal-program"><SnakeGame/></div>:<>
      {world.program==='music'&&<div className="laptop-player"><div><small>SOURCE / LAPTOP</small><strong>Desk After Dark</strong><span>Original instrumental loop · {world.music}</span></div><div className={`equalizer ${world.music==='playing'?'playing':''}`} aria-hidden="true">{[0,1,2,3,4,5,6,7].map(i=><i key={i} style={{animationDelay:`${i*-.17}s`}}/>)}</div><button onClick={()=>musicAction(world.music==='playing'?'pause':'resume')}>{world.music==='playing'?'Pause':'Play'}</button><button onClick={()=>musicAction('stop')}>Stop</button><label>Volume <input type="range" min="0" max="100" value={world.volume} onChange={e=>musicAction('volume',[e.target.value])}/></label><button onClick={()=>musicAction('volume',[world.volume?0:35])}>{world.volume?'Mute':'Unmute'}</button></div>}
      {pager?<div className="terminal-pager" tabIndex={0} ref={el=>el?.focus({preventScroll:true})}><pre>{pager.slice(page,page+8).join('\n')}</pre><footer><button onClick={()=>setPage(n=>Math.max(0,n-8))}>↑ Previous</button><span>{page+1}–{Math.min(page+8,pager.length)} / {pager.length}</span><button onClick={()=>setPage(n=>Math.min(Math.max(0,pager.length-8),n+8))}>Next ↓</button><button onClick={()=>setPager(null)}>q · Exit</button></footer></div>:<><div className="terminal-output" ref={output} role="log" aria-live="polite" aria-label="Terminal output">{shell.output.map((entry,i)=><pre key={i} className={entry.type||''}>{entry.text}</pre>)}</div><form className="terminal-prompt" onSubmit={submit}><label htmlFor="terminal-input">amar<span>@workspace</span>:<b>{shell.cwd.replace(HOME,'~')}</b>$</label><div><input id="terminal-input" ref={field} value={input} onChange={e=>setInput(e.target.value)} spellCheck={false} autoComplete="off" autoCapitalize="off" aria-label="Terminal command" readOnly={busy} aria-busy={busy} onKeyDown={e=>{
        if(e.key==='Tab'){e.preventDefault();const c=complete(shell,input);setInput(c.line);if(c.matches.length>1)add(c.matches.join('  '));}
        if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex.current===shell.history.length)draft.current=input;historyIndex.current=Math.max(0,historyIndex.current-1);setInput(shell.history[historyIndex.current]||'');}
        if(e.key==='ArrowDown'){e.preventDefault();historyIndex.current=Math.min(shell.history.length,historyIndex.current+1);setInput(shell.history[historyIndex.current]??draft.current);}
        if(e.ctrlKey&&e.key.toLowerCase()==='l'){e.preventDefault();shell.output=[];refresh(n=>n+1);}
        if(e.ctrlKey&&e.key.toLowerCase()==='c'){e.preventDefault();setInput('');add('^C');}
      }}/>{!input&&<i className="terminal-cursor"/>}</div><button type="submit" aria-label="Run command">↵</button></form></>}
      <footer className="terminal-hints"><button onClick={()=>{setInput('help');field.current?.focus();}}>help</button><span>Tab complete · ↑↓ history</span><span>{busy?'RUNNING':world.music==='playing'?'♫ laptop playing':'LOCAL SESSION'}</span></footer>
    </>}
  </div>;
}
