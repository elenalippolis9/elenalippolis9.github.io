/* ── terminal.js ────────────────────────────────────────────
   Depends on: FS (fs.js), #output, #input-field, #ps1-path
──────────────────────────────────────────────────────────── */

const outputEl  = document.getElementById('output');
const inputEl   = document.getElementById('input-field');
const ps1PathEl = document.getElementById('ps1-path');

let cwd     = '~';
let history = [];
let histIdx = -1;

/* ── Path resolution ──────────────────────────────────────── */
function resolve(target) {
  if (!target || target === '~') return '~';

  // handle multiple consecutive ..
  if (target === '..' || target === '../') {
    if (cwd === '~') return '~';
    const parts = cwd.split('/');
    parts.pop();
    return parts.join('/') || '~';
  }

  // absolute path
  if (target.startsWith('~/')) return target.replace(/\/+$/, '');

  // relative
  const base = cwd === '~' ? '~' : cwd;
  const joined = base + '/' + target;

  // resolve any .. segments
  const segments = joined.split('/');
  const resolved = [];
  for (const seg of segments) {
    if (seg === '..') resolved.pop();
    else if (seg !== '.') resolved.push(seg);
  }
  return resolved.join('/').replace(/\/+$/, '') || '~';
}

/* ── DOM helpers ──────────────────────────────────────────── */
function addLine(text, cls) {
  const d = document.createElement('div');
  d.className = 'line' + (cls ? ' ' + cls : '');
  // empty lines still take up space
  d.textContent = (text === '' || text == null) ? '\u00a0' : text;
  outputEl.appendChild(d);
}

function addBlank() { addLine(''); }

function addEcho(cmdText) {
  const row = document.createElement('div');
  row.className = 'echo-row';

  const ps = document.createElement('span');
  ps.className = 'ps1-echo ps1';
  ps.innerHTML =
    `<span class="host">elenalippolis</span>` +
    `<span class="sep">:</span>` +
    `<span class="path">${esc(cwd)}</span>` +
    `<span class="sigil"> $</span>`;

  const cmd = document.createElement('span');
  cmd.className = 'cmd-text';
  cmd.textContent = ' ' + cmdText;

  row.appendChild(ps);
  row.appendChild(cmd);
  outputEl.appendChild(row);
}

function scrollToBottom() {
  outputEl.scrollTop = outputEl.scrollHeight;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ── Commands ─────────────────────────────────────────────── */
const CMDS = {

  help() {
    addBlank();
    addLine('commands', 'green');
    addBlank();
    addLine('  ls [path]     list directory');
    addLine('  cd <dir>      change directory  (cd .. to go up, cd ~ for root)');
    addLine('  cat <file>    print file contents');
    addLine('  open <file>   open a link in the browser');
    addLine('  pwd           print working directory');
    addLine('  clear         clear the terminal');
    addLine('  whoami        about this site');
    addBlank();
    addLine('  tab    autocomplete        ↑ ↓   command history', 'dim');
    addLine('  ctrl+l clear               ctrl+c cancel input', 'dim');
    addBlank();
  },

  ls(args) {
    const path = args[0] ? resolve(args[0]) : cwd;
    const node = FS[path];

    if (!node) {
      addLine(`ls: cannot access '${args[0]}': no such file or directory`, 'err');
      return;
    }
    if (node.type === 'file') {
      addLine(path.split('/').pop());
      return;
    }

    addBlank();
    node.children.forEach(name => {
      const childPath = (path === '~') ? '~/' + name : path + '/' + name;
      const child = FS[childPath];
      const isDir = child && child.type === 'dir';
      addLine(isDir ? name + '/' : name, isDir ? 'dir' : '');
    });
    addBlank();
  },

  cd(args) {
    const target = args[0];
    if (!target || target === '~') {
      cwd = '~';
      ps1PathEl.textContent = '~';
      return;
    }
    const path = resolve(target);
    const node = FS[path];
    if (!node) {
      addLine(`cd: ${target}: no such file or directory`, 'err');
      return;
    }
    if (node.type === 'file') {
      addLine(`cd: ${target}: not a directory`, 'err');
      return;
    }
    cwd = path;
    ps1PathEl.textContent = cwd;
  },

  cat(args) {
    if (!args[0]) { addLine('usage: cat <file>', 'dim'); return; }
    const path = resolve(args[0]);
    const node = FS[path];
    if (!node) {
      addLine(`cat: ${args[0]}: no such file or directory`, 'err');
      return;
    }
    if (node.type === 'dir') {
      addLine(`cat: ${args[0]}: is a directory  (use ls to list it)`, 'err');
      return;
    }
    addBlank();
    node.content.split('\n').forEach(line => addLine(line));
    addBlank();
  },

  open(args) {
    if (!args[0]) { addLine('usage: open <file>', 'dim'); return; }
    const path = resolve(args[0]);
    const node = FS[path];
    if (!node) {
      addLine(`open: ${args[0]}: no such file or directory`, 'err');
      return;
    }
    if (!node.link) {
      addLine(`open: no URL in this file  (try cat to read it)`, 'dim');
      return;
    }
    addLine(`opening ${node.link}`, 'dim');
    window.open(node.link, '_blank', 'noopener noreferrer');
  },

  pwd() {
    addLine(cwd);
  },

  whoami() {
    addBlank();
    addLine('elenalippolis — computer scientist and bioinformatician', 'green');
    addBlank();
    addLine('this is an interactive terminal. navigate like a filesystem:');
    addBlank();
    addLine('  ls              see what is here');
    addLine('  cd about        read about me');
    addLine('  cd projects     things i have built');
    addLine('  cd writing      things i have written');
    addLine('  cd contact      get in touch');
    addBlank();
  },

  clear() {
    outputEl.innerHTML = '';
  },
};

/* ── Tab autocomplete ─────────────────────────────────────── */
function autocomplete(val) {
  const parts = val.trimStart().split(/\s+/);

  // complete command name
  if (parts.length === 1) {
    const matches = Object.keys(CMDS).filter(c => c.startsWith(parts[0]));
    if (matches.length === 1) return matches[0] + ' ';
    if (matches.length > 1) {
      addBlank();
      addLine(matches.join('   '), 'dim');
    }
    return null;
  }

  // complete argument (filename in cwd)
  const partial = parts[parts.length - 1];
  const node = FS[cwd];
  if (!node || node.type !== 'dir') return null;

  const matches = node.children.filter(name => name.startsWith(partial));
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    return parts.join(' ');
  }
  if (matches.length > 1) {
    addBlank();
    addLine(matches.join('   '), 'dim');
    scrollToBottom();
  }
  return null;
}

/* ── Run a command string ─────────────────────────────────── */
function run(line) {
  const trimmed = line.trim();
  addEcho(trimmed);

  if (!trimmed) { scrollToBottom(); return; }

  history.unshift(trimmed);
  histIdx = -1;

  const [cmd, ...args] = trimmed.split(/\s+/);

  if (CMDS[cmd]) {
    CMDS[cmd](args);
  } else {
    addLine(`${cmd}: command not found  (type 'help' for commands)`, 'err');
  }

  scrollToBottom();
}

/* ── Input event listeners ────────────────────────────────── */
inputEl.addEventListener('keydown', e => {
  switch (e.key) {
    case 'Enter': {
      const val = inputEl.value;
      inputEl.value = '';
      run(val);
      break;
    }
    case 'ArrowUp': {
      e.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        inputEl.value = history[histIdx];
        // move cursor to end
        setTimeout(() => inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length), 0);
      }
      break;
    }
    case 'ArrowDown': {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        inputEl.value = history[histIdx];
      } else {
        histIdx = -1;
        inputEl.value = '';
      }
      break;
    }
    case 'Tab': {
      e.preventDefault();
      const completed = autocomplete(inputEl.value);
      if (completed) inputEl.value = completed;
      scrollToBottom();
      break;
    }
    case 'c': {
      if (e.ctrlKey) { inputEl.value = ''; addEcho('^C'); addBlank(); scrollToBottom(); }
      break;
    }
    case 'l': {
      if (e.ctrlKey) { e.preventDefault(); CMDS.clear(); }
      break;
    }
  }
});

/* Keep focus on input when clicking anywhere */
document.getElementById('terminal').addEventListener('click', () => inputEl.focus());

/* On mobile, re-scroll when the keyboard pops open */
inputEl.addEventListener('focus', () => {
  setTimeout(scrollToBottom, 300);
});

/* ── Boot sequence ────────────────────────────────────────── */
(function boot() {
  addLine('');
  addLine('elenalippolis9.github.io', 'green');
  addLine('─'.repeat(40), 'dim');
  addLine('');
  addLine("type 'help' for commands, or just try 'ls'");
  addLine('');
  inputEl.focus();
})();
