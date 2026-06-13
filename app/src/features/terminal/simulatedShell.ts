// ─── Simulated shell ──────────────────────────────────────────────────────
// Drives the xterm.js terminal when no backend PTY is available, so the full
// terminal UX is demonstrable standalone. Mirrors a minimal Linux lab box.

interface FsNode {
  [key: string]: FsNode | string;
}

const FS: FsNode = {
  home: {
    operator: {
      'flag.txt': 'NETHEX{w3lc0me_t0_th3_r4ng3}',
      'notes.md': '# Recon notes\n- enumerate users\n- check SUID binaries\n',
      '.bashrc': '# operator shell config\n',
    },
  },
  etc: {
    passwd:
      'root:x:0:0:root:/root:/bin/bash\noperator:x:1000:1000:operator:/home/operator:/bin/bash\nsvc-web:x:1001:1001::/var/www:/usr/sbin/nologin\n',
    hostname: 'forge\n',
    crontab: '* * * * * root /usr/local/bin/backup.sh\n',
  },
  usr: { local: { bin: { 'netcheck': '<suid binary>', 'backup.sh': '#!/bin/bash\n' } } },
  var: { www: { html: { 'index.html': '<h1>Internal Portal</h1>' } } },
  root: {},
};

function resolve(path: string[]): FsNode | string | null {
  let node: FsNode | string = FS;
  for (const part of path) {
    if (typeof node === 'string') return null;
    if (!(part in node)) return null;
    node = node[part];
  }
  return node;
}

export class SimulatedShell {
  private cwd = ['home', 'operator'];
  private write: (s: string) => void;
  readonly host: string;

  constructor(write: (s: string) => void, host = 'forge') {
    this.write = write;
    this.host = host;
  }

  banner() {
    this.write(
      `\x1b[38;5;141m╔══════════════════════════════════════════╗\r\n` +
        `║  NETHEX cyber range — isolated lab shell  ║\r\n` +
        `╚══════════════════════════════════════════╝\x1b[0m\r\n` +
        `\x1b[90mEgress: \x1b[31mDROPPED\x1b[90m · Session is ephemeral · Type 'help'\x1b[0m\r\n\r\n`,
    );
  }

  prompt(): string {
    const path = '/' + this.cwd.join('/');
    const short = path.replace('/home/operator', '~');
    return `\x1b[38;5;141moperator@${this.host}\x1b[0m:\x1b[38;5;45m${short}\x1b[0m$ `;
  }

  exec(line: string): void {
    const [cmd, ...args] = line.trim().split(/\s+/);
    if (!cmd) return;
    const out = (s: string) => this.write(s + '\r\n');

    switch (cmd) {
      case 'help':
        out('Available: ls, cd, pwd, cat, whoami, id, uname, hostname, find, echo, clear, ps');
        break;
      case 'whoami':
        out('operator');
        break;
      case 'id':
        out('uid=1000(operator) gid=1000(operator) groups=1000(operator)');
        break;
      case 'hostname':
        out(this.host);
        break;
      case 'uname':
        out('Linux forge 6.6.0-nethex #1 SMP x86_64 GNU/Linux');
        break;
      case 'pwd':
        out('/' + this.cwd.join('/'));
        break;
      case 'echo':
        out(args.join(' '));
        break;
      case 'ps':
        out('  PID TTY          TIME CMD\r\n    1 ?        00:00:00 init\r\n  742 pts/0    00:00:00 bash\r\n  988 pts/0    00:00:00 ps');
        break;
      case 'ls': {
        const target = args[0] ? this.abs(args[0]) : this.cwd;
        const node = resolve(target);
        if (node === null) out(`ls: cannot access '${args[0]}': No such file or directory`);
        else if (typeof node === 'string') out(args[0] || '');
        else
          out(
            Object.keys(node)
              .map((k) => (typeof node[k] === 'string' ? k : `\x1b[38;5;45m${k}\x1b[0m`))
              .join('  '),
          );
        break;
      }
      case 'cd': {
        if (!args[0] || args[0] === '~') {
          this.cwd = ['home', 'operator'];
          break;
        }
        const target = this.abs(args[0]);
        const node = resolve(target);
        if (node === null || typeof node === 'string') out(`cd: ${args[0]}: No such file or directory`);
        else this.cwd = target;
        break;
      }
      case 'cat': {
        if (!args[0]) {
          out('cat: missing operand');
          break;
        }
        const node = resolve(this.abs(args[0]));
        if (node === null) out(`cat: ${args[0]}: No such file or directory`);
        else if (typeof node !== 'string') out(`cat: ${args[0]}: Is a directory`);
        else out(node);
        break;
      }
      case 'find': {
        // Simplified: surface the SUID demo result
        if (line.includes('4000')) out('/usr/local/bin/netcheck');
        else out('/home/operator\r\n/home/operator/flag.txt\r\n/home/operator/notes.md');
        break;
      }
      case 'clear':
        this.write('\x1b[2J\x1b[H');
        break;
      case 'sudo':
        out('\x1b[31m[sandbox] sudo is restricted in this demo shell.\x1b[0m');
        break;
      default:
        out(`${cmd}: command not found`);
    }
  }

  private abs(p: string): string[] {
    if (p.startsWith('/')) return p.split('/').filter(Boolean);
    const parts = [...this.cwd];
    for (const seg of p.split('/')) {
      if (seg === '' || seg === '.') continue;
      if (seg === '..') parts.pop();
      else parts.push(seg);
    }
    return parts;
  }
}
