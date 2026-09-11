export const HOME = '/home/amar';
export const commands = ['ls','cd','pwd','cat','less','more','head','tail','clear','echo','whoami','date','help','man','history','mkdir','tree','find','grep','which','uname','hostname','neofetch','reset','exit','music'];
export const programs = ['snake','explode','creative','coffee','music','oldsite'];
export function resolvePath(cwd, path = '.') {
  const absolute = path.startsWith('~') ? HOME + path.slice(1) : path.startsWith('/') ? path : cwd + '/' + path;
  const parts = []; for (const part of absolute.split('/')) { if (part === '..') parts.pop(); else if (part && part !== '.') parts.push(part); }
  return '/' + parts.join('/');
}
export function createShell({ about = [], languages = [], technologies = [], projects = [], contacts = [], coursework = [], resumeText } = {}) {
  const fs = { '/': null, '/home': null, [HOME]: null, [HOME+'/projects']: null };
  const resume = ['AMAR KOONAR', 'Computer Science student — Simon Fraser University', '', ...about, '', 'LANGUAGES', languages.join(', '), '', 'TOOLS', technologies.join(', '), '', 'PROJECTS', ...projects.map(p => `${p.title}\n${p.dis}\n${p.link}`), '', 'COURSEWORK', ...coursework.map(c => `${c.title}: ${c.description}`), '', 'CONTACT', ...contacts.map(c=>`${c.name}: ${c.link}`), '', 'Original resume: /Amars_Resume.pdf'].join('\n');
  fs[HOME+'/resume.txt'] = resumeText || resume; fs[HOME+'/about.txt'] = about.join('\n\n'); fs[HOME+'/contact.txt'] = contacts.map(c=>`${c.name}: ${c.link}`).join('\n');
  for (const p of projects) fs[HOME+'/projects/'+p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.txt'] = `${p.title}\n${p.dis}\n${p.tags.join(', ')}\n${p.link}${p.demoUrl ? '\n'+p.demoUrl : ''}`;
  for (const p of programs) fs[HOME+'/'+p+'.exe'] = '[PortfolioOS executable: '+p+']';
  return { cwd: HOME, fs, history: [], output: [{ text: 'PortfolioOS 1.0 / workspace\nWelcome, Amar. Type help to explore.', type: 'welcome' }] };
}
const manuals = {
  ls:'ls [path] — list a directory. -a and -l are accepted.', cd:'cd [path] — change directory. cd alone returns home; cd - returns to the previous directory.',
  cat:'cat FILE... — print text files.', less:'less FILE — page through a text file. Space/↓ advances; ↑ goes back; q exits.', more:'more FILE — page through a text file. Space advances; q exits.',
  head:'head [-n COUNT] FILE — first 10 lines by default.', tail:'tail [-n COUNT] FILE — last 10 lines by default.',
  mkdir:'mkdir [-p] PATH... — create virtual directories.', grep:'grep [-i] TEXT FILE... — find matching lines (literal text).', find:'find [PATH] [-name PATTERN] — find paths; * and ? wildcards supported.',
  music:'music [pause|resume|stop|volume 0–100] — control the laptop player.', reset:'reset — restore the entire desk, camera, programs, music and temporary effects. Your terminal files remain.',
  exit:'exit — return to the desk.', help:'help — commands and executable programs.', tree:'tree [PATH] — show directory descendants.', which:'which COMMAND — show its virtual location.',
};
export function tokenize(line) {
  if ((line.match(/"/g)||[]).length%2 || (line.match(/'/g)||[]).length%2) throw new Error('unclosed quote');
  return (line.match(/"[^"]*"|'[^']*'|[^\s]+/g)||[]).map(s=>s.replace(/^(["'])(.*)\1$/, '$2'));
}
export function execute(shell, line) {
  const result = { text: '', action: null }; const out = text => ({...result,text});
  if (!line.trim()) return result;
  shell.history.push(line); if(shell.history.length>200) shell.history.shift();
  let tokens; try { tokens = tokenize(line); } catch(e) { return out('workspace: '+e.message); }
  const [cmd,...args] = tokens; const path = p=>resolvePath(shell.cwd,p); const exists=p=>Object.hasOwn(shell.fs,p);
  const read=p=>{const full=path(p); if(!exists(full)) throw new Error(`${p}: No such file or directory`); if(shell.fs[full]===null) throw new Error(`${p}: Is a directory`); if(full.endsWith('.exe')) throw new Error(`${p}: executable binary`); return shell.fs[full];};
  const dir=p=>{const full=path(p); if(!exists(full)) throw new Error(`${p}: No such file or directory`); if(shell.fs[full]!==null) throw new Error(`${p}: Not a directory`); return full;};
  const entries=p=>Object.keys(shell.fs).filter(k=>k!==p && k.slice(0,k.lastIndexOf('/'))===(p==='/'?'':p)).sort();
  try {
    if(cmd.includes('/') && cmd.endsWith('.exe')) { const full=path(cmd), name=full.split('/').pop().slice(0,-4); if(!exists(full)||!programs.includes(name)) throw new Error(`${cmd}: No such executable`); return {...result, text:`Starting ${name}.exe...`, action:name}; }
    switch(cmd) {
      case 'help': return out('COMMANDS\n'+commands.join('  ')+'\n\nPROGRAMS (run from ~)\n./snake.exe     Play Snake\n./explode.exe   Desktop chaos\n./creative.exe  Grab and throw objects\n./coffee.exe    Brew far too much coffee\n./music.exe     Play Desk After Dark\n./oldsite.exe   Open the original portfolio\n\nTab autocomplete · ↑/↓ history · Ctrl+L clear\nman COMMAND for details · Escape exits programs\nReset View moves the camera; reset restores the whole world.');
      case 'man': return out(manuals[args[0]] || (commands.includes(args[0]) ? `${args[0]} — ${args[0]==='uname'?'simulated system information': 'PortfolioOS built-in command; accepts no required arguments.'}` : `No manual entry for ${args[0]||'(missing command)'}`));
      case 'pwd': return out(shell.cwd);
      case 'cd': {const next=dir(args[0]==='-' ? shell.previous||HOME : args[0]||HOME); shell.previous=shell.cwd;shell.cwd=next;return result;}
      case 'ls': {const p=dir(args.find(a=>!a.startsWith('-'))||'.'); return out(entries(p).map(k=>`${args.includes('-l')?(shell.fs[k]===null?'drwxr-xr-x':'-rw-r--r--')+' amar amar  ':''}${k.split('/').pop()}${shell.fs[k]===null?'/':''}`).join(args.includes('-l')?'\n':'  '));}
      case 'cat': case 'less': case 'more': {if(!args.length) throw new Error('missing file operand'); const text=args.map(read).join('\n');return {...result,text,pager:cmd!=='cat'};}
      case 'head': case 'tail': {let count=10, files=args;if(args[0]==='-n'){count=Number(args[1]);files=args.slice(2);} if(!Number.isInteger(count)||count<0) throw new Error('invalid line count');if(!files.length)throw new Error('missing file operand');return out(files.map(f=>{const lines=read(f).split('\n');return (cmd==='head'?lines.slice(0,count):count?lines.slice(-count):[]).join('\n');}).join('\n'));}
      case 'echo': return out(args.join(' ').replaceAll('$USER','amar').replaceAll('$HOME',HOME).replaceAll('$PWD',shell.cwd));
      case 'clear': return {...result,clear:true};
      case 'whoami': return out('amar');
      case 'hostname': return out('workspace');
      case 'date': return out(new Date().toString());
      case 'history': return out(shell.history.map((h,i)=>`${String(i+1).padStart(4)}  ${h}`).join('\n'));
      case 'uname': return out(args.includes('-a')?'PortfolioOS workspace 1.0 browser WebGL simulated GNU/Linux shell':'PortfolioOS');
      case 'neofetch': return out('   .----------.   amar@workspace\n  / WORKSPACE /|  OS: PortfolioOS (simulated)\n /___________/ |  Shell: workspace\n |    3D     | |  Engine: Three.js\n |  DESKTOP  | /  Framework: Next.js / React\n |___________|/   Physics: Rapier\n                  Graphics: WebGL');
      case 'mkdir': {const recursive=args.includes('-p'), names=args.filter(a=>a!=='-p');if(!names.length)throw new Error('missing operand');for(const name of names){const full=path(name);if(exists(full)){if(recursive&&shell.fs[full]===null)continue;throw new Error(name+': File exists');}const parts=full.split('/').filter(Boolean);let current='';for(let i=0;i<parts.length;i++){current+='/'+parts[i];if(exists(current)&&shell.fs[current]!==null)throw new Error(current+': Not a directory');if(!exists(current)){if(i<parts.length-1&&!recursive)throw new Error(name+': parent directory does not exist');shell.fs[current]=null;}}}return result;}
      case 'tree': {const p=dir(args[0]||'.');const rows=[p];function walk(root,indent){const list=entries(root);list.forEach((k,i)=>{const last=i===list.length-1;rows.push(indent+(last?'└── ':'├── ')+k.split('/').pop()+(shell.fs[k]===null?'/':''));if(shell.fs[k]===null)walk(k,indent+(last?'    ':'│   '));});}walk(p,'');return out(rows.join('\n'));}
      case 'find': {const p=dir(args[0]&&!args[0].startsWith('-')?args[0]:'.'), n=args.indexOf('-name'), glob=n>=0?args[n+1]:'*';if(!glob)throw new Error('missing pattern');const regex=new RegExp('^'+glob.replace(/[.+^${}()|[\]\\]/g,'\\$&').replaceAll('*','.*').replaceAll('?','.')+'$');return out(Object.keys(shell.fs).filter(k=>(k===p||k.startsWith(p==='/'?'/':p+'/'))&&regex.test(k.split('/').pop())).join('\n'));}
      case 'grep': {const insensitive=args[0]==='-i', rest=insensitive?args.slice(1):args, [needle,...files]=rest;if(needle===undefined||!files.length)throw new Error('usage: grep [-i] TEXT FILE...');return out(files.flatMap(f=>read(f).split('\n').filter(l=>(insensitive?l.toLowerCase():l).includes(insensitive?needle.toLowerCase():needle)).map(l=>(files.length>1?f+':':'')+l)).join('\n'));}
      case 'which': return out(args.map(c=>commands.includes(c)?'/usr/bin/'+c:exists(path(c))?path(c):exists(HOME+'/'+c)?HOME+'/'+c:c+': not found').join('\n'));
      case 'music': return {...result,action:'music-control',args};
      case 'reset': return {...result,text:'Restoring workspace... All objects, effects and programs reset.',action:'reset'};
      case 'exit': return {...result,action:'exit',text:'Session detached. See you at the desk.'};
      default: return out(`workspace: ${cmd}: command not found. Try help.`);
    }
  } catch(e) { return out(`${cmd}: ${e.message}`); }
}
export function complete(shell,line) {
  const words=line.split(/\s+/), token=words.pop()||'', start=words.join(' ')+(words.length?' ':'');
  const folder=token.includes('/')?token.slice(0,token.lastIndexOf('/')+1):'', partial=token.slice(folder.length), base=resolvePath(shell.cwd,folder||'.');
  const files=Object.keys(shell.fs).filter(k=>k.slice(0,k.lastIndexOf('/'))===(base==='/'?'':base)).map(k=>folder+k.split('/').pop()+(shell.fs[k]===null?'/':'')).filter(k=>k.slice(folder.length).startsWith(partial));
  const matches=[...new Set([...(!words.length&&!folder?commands.filter(c=>c.startsWith(token)):[]),...files])];
  return {line:matches.length===1?start+matches[0]+(matches[0].endsWith('/')?'':' '):line,matches};
}
