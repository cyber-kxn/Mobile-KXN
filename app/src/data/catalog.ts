import type {
  LearningPath,
  Room,
  Badge,
  LeaderboardEntry,
} from '@/lib/types';

// ─── Original room catalogue ──────────────────────────────────────────────
// All content is original to NETHEX. Flags shown here are placeholders for the
// mock build; the real platform validates server-side hashes and never ships
// answers to the client.

export const ROOMS: Room[] = [
  {
    id: 'r-linux-recon',
    slug: 'linux-landing-zone',
    title: 'Linux Landing Zone',
    summary:
      'Get comfortable on the command line: navigation, permissions, processes, and your first real enumeration workflow.',
    kind: 'walkthrough',
    track: 'foundations',
    difficulty: 'intro',
    xp: 120,
    estMinutes: 35,
    tags: ['linux', 'cli', 'enumeration'],
    author: 'cipher',
    updated: '2026-05-02',
    lab: {
      id: 'lp-linux-single',
      name: 'Single Linux host',
      nodes: [{ hostname: 'forge', image: 'nethex/lab-linux-base', role: 'target' }],
      ttlSeconds: 3600,
      egress: 'none',
    },
    tasks: [
      {
        id: 't1',
        title: 'Orient yourself',
        body: '## Where am I?\nEvery engagement starts with situational awareness. Deploy the lab, drop into the terminal, and find your bearings.\n\nUse `whoami`, `id`, `pwd`, and `uname -a` to fingerprint the box.',
        suggestedCommands: [
          { label: 'Who am I', cmd: 'whoami' },
          { label: 'Kernel', cmd: 'uname -a' },
          { label: 'List home', cmd: 'ls -la ~' },
        ],
        questions: [
          {
            id: 'q1',
            prompt: 'What is the username of the account you are operating as?',
            kind: 'text',
            hint: 'Try the `whoami` command.',
            points: 20,
          },
          {
            id: 'q2',
            prompt: 'Read the flag in /home/operator/flag.txt',
            kind: 'flag',
            hint: 'Use `cat` to read files.',
            answerHash: 'sha256:placeholder',
            points: 40,
          },
        ],
      },
      {
        id: 't2',
        title: 'Permissions & SUID',
        body: '## Hunting privilege\nFind files with the SUID bit set — they run with the owner’s privileges and are a classic privilege-escalation vector.\n\n```bash\nfind / -perm -4000 -type f 2>/dev/null\n```',
        suggestedCommands: [
          { label: 'Find SUID', cmd: 'find / -perm -4000 -type f 2>/dev/null' },
        ],
        questions: [
          {
            id: 'q3',
            prompt: 'Which uncommon binary in /usr/local/bin has the SUID bit set?',
            kind: 'text',
            points: 60,
          },
        ],
      },
    ],
  },
  {
    id: 'r-web-injection',
    slug: 'injection-clinic',
    title: 'Injection Clinic',
    summary:
      'A hands-on tour of SQL injection and command injection against a deliberately vulnerable internal portal.',
    kind: 'challenge',
    track: 'web',
    difficulty: 'medium',
    xp: 260,
    estMinutes: 60,
    tags: ['sqli', 'owasp', 'command-injection', 'burp'],
    author: 'm0nde',
    updated: '2026-05-20',
    lab: {
      id: 'lp-web-portal',
      name: 'Web portal + DB',
      nodes: [
        { hostname: 'kali', image: 'nethex/lab-attacker', role: 'attacker' },
        { hostname: 'portal', image: 'nethex/lab-web-portal', role: 'target' },
        { hostname: 'db', image: 'nethex/lab-postgres', role: 'target' },
      ],
      ttlSeconds: 5400,
      egress: 'internal',
    },
    tasks: [
      {
        id: 't1',
        title: 'Map the attack surface',
        body: '## Recon the portal\nBrowse the application and catalogue every input. Authentication forms, search boxes, and URL parameters are all candidate sinks.',
        suggestedCommands: [
          { label: 'Dir brute', cmd: 'ffuf -u http://portal/FUZZ -w wordlist.txt' },
          { label: 'Curl login', cmd: "curl -s -d \"user=admin&pass=x\" http://portal/login" },
        ],
        questions: [
          {
            id: 'q1',
            prompt: 'How many hidden endpoints did the directory scan reveal?',
            kind: 'numeric',
            points: 50,
          },
        ],
      },
      {
        id: 't2',
        title: 'Break the login',
        body: '## Authentication bypass\nThe login query is unparameterized. Craft an input that always evaluates true.\n\n> Think about how `’ OR 1=1 -- ` changes the boolean logic of a `WHERE` clause.',
        questions: [
          {
            id: 'q2',
            prompt: 'Capture the admin flag from the dashboard after bypassing auth.',
            kind: 'flag',
            answerHash: 'sha256:placeholder',
            points: 110,
          },
        ],
      },
      {
        id: 't3',
        title: 'From SQLi to RCE',
        body: '## Stacked queries\nThe database user can write to the web root. Chain your injection into a file write to gain command execution.',
        questions: [
          {
            id: 'q3',
            prompt: 'What is the hostname of the database container? (command injection)',
            kind: 'text',
            points: 100,
          },
        ],
      },
    ],
  },
  {
    id: 'r-ad-foothold',
    slug: 'forest-foothold',
    title: 'Forest Foothold',
    summary:
      'Enumerate an Active Directory domain, abuse Kerberos, and escalate from a low-priv user to Domain Admin.',
    kind: 'network',
    track: 'active-directory',
    difficulty: 'hard',
    xp: 480,
    estMinutes: 150,
    tags: ['active-directory', 'kerberos', 'bloodhound', 'kerberoasting'],
    author: 'nyx',
    updated: '2026-06-01',
    lab: {
      id: 'lp-ad-forest',
      name: 'AD forest (DC + 2 workstations)',
      nodes: [
        { hostname: 'kali', image: 'nethex/lab-attacker', role: 'attacker' },
        { hostname: 'dc01', image: 'nethex/lab-windows-dc', role: 'target' },
        { hostname: 'ws01', image: 'nethex/lab-windows-ws', role: 'target' },
        { hostname: 'ws02', image: 'nethex/lab-windows-ws', role: 'pivot' },
      ],
      ttlSeconds: 7200,
      egress: 'internal',
    },
    tasks: [
      {
        id: 't1',
        title: 'Domain enumeration',
        body: '## Lay of the land\nWith valid low-priv creds, enumerate users, groups, and trust relationships. Feed the data into a graph to spot escalation paths.',
        suggestedCommands: [
          { label: 'Enum users', cmd: 'nxc smb dc01 -u svc -p Pass -- users' },
          { label: 'Collect', cmd: 'bloodhound-python -d corp.local -u svc -p Pass -c all' },
        ],
        questions: [
          {
            id: 'q1',
            prompt: 'How many users belong to the "Service Accounts" OU?',
            kind: 'numeric',
            points: 80,
          },
        ],
      },
      {
        id: 't2',
        title: 'Kerberoasting',
        body: '## Crack a service ticket\nRequest TGS tickets for SPN-bearing accounts and crack them offline.',
        questions: [
          {
            id: 'q2',
            prompt: 'Recover and submit the cracked service-account password.',
            kind: 'text',
            points: 200,
          },
        ],
      },
      {
        id: 't3',
        title: 'Domain Admin',
        body: '## Path to DA\nUse the recovered credentials and a delegation misconfiguration to reach Domain Admin and read the root flag.',
        questions: [
          {
            id: 'q3',
            prompt: 'Submit the Domain Admin flag from \\\\dc01\\C$\\root.txt',
            kind: 'flag',
            answerHash: 'sha256:placeholder',
            points: 200,
          },
        ],
      },
    ],
  },
  {
    id: 'r-soc-triage',
    slug: 'blue-pulse',
    title: 'Blue Pulse: Alert Triage',
    summary:
      'Step into the SOC. Triage a burst of alerts, pivot through logs, and separate true positives from noise.',
    kind: 'walkthrough',
    track: 'defensive',
    difficulty: 'easy',
    xp: 200,
    estMinutes: 50,
    tags: ['soc', 'siem', 'detection', 'logs'],
    author: 'aegis',
    updated: '2026-05-11',
    tasks: [
      {
        id: 't1',
        title: 'Read the timeline',
        body: '## Signal vs noise\nA SIEM dump is waiting. Reconstruct the kill chain from authentication, process, and network events.',
        questions: [
          {
            id: 'q1',
            prompt: 'What MITRE ATT&CK technique describes the initial access used?',
            kind: 'text',
            hint: 'Phishing attachment → T1566.x',
            points: 90,
          },
        ],
      },
      {
        id: 't2',
        title: 'Scope the blast radius',
        body: '## Containment\nIdentify every host the adversary touched after initial access so the response team can isolate them.',
        questions: [
          {
            id: 'q2',
            prompt: 'How many internal hosts show signs of lateral movement?',
            kind: 'numeric',
            points: 110,
          },
        ],
      },
    ],
  },
  {
    id: 'r-dfir-memory',
    slug: 'ghost-in-ram',
    title: 'Ghost in the RAM',
    summary:
      'Memory forensics from a compromised workstation: find the injected process, dump it, and recover the C2 config.',
    kind: 'challenge',
    track: 'dfir',
    difficulty: 'hard',
    xp: 420,
    estMinutes: 110,
    tags: ['forensics', 'volatility', 'memory', 'malware'],
    author: 'reliq',
    updated: '2026-06-05',
    tasks: [
      {
        id: 't1',
        title: 'Profile the capture',
        body: '## First pass\nLoad the memory image and identify the OS build and the suspicious processes.',
        questions: [
          {
            id: 'q1',
            prompt: 'What is the PID of the maliciously injected process?',
            kind: 'numeric',
            points: 150,
          },
        ],
      },
      {
        id: 't2',
        title: 'Recover the C2',
        body: '## Extract the config\nDump the process memory and carve out the command-and-control beacon configuration.',
        questions: [
          {
            id: 'q2',
            prompt: 'Submit the C2 domain found in the beacon config.',
            kind: 'flag',
            answerHash: 'sha256:placeholder',
            points: 270,
          },
        ],
      },
    ],
  },
  {
    id: 'r-llm-redteam',
    slug: 'prompt-breaker',
    title: 'Prompt Breaker',
    summary:
      'Red-team a deployed LLM application: bypass its guardrails, exfiltrate the system prompt, and abuse a tool-calling bug.',
    kind: 'ctf',
    track: 'ai-security',
    difficulty: 'medium',
    xp: 320,
    estMinutes: 75,
    tags: ['llm', 'prompt-injection', 'ai-security', 'owasp-llm'],
    author: 'vector',
    updated: '2026-06-10',
    lab: {
      id: 'lp-llm-app',
      name: 'Vulnerable LLM chat app',
      nodes: [
        { hostname: 'kali', image: 'nethex/lab-attacker', role: 'attacker' },
        { hostname: 'chatapp', image: 'nethex/lab-llm-app', role: 'target' },
      ],
      ttlSeconds: 3600,
      egress: 'internal',
    },
    tasks: [
      {
        id: 't1',
        title: 'Leak the system prompt',
        body: '## Guardrail bypass\nThe assistant has hidden instructions. Use indirect and direct prompt-injection techniques to surface them.',
        questions: [
          {
            id: 'q1',
            prompt: 'What is the secret codeword embedded in the system prompt?',
            kind: 'flag',
            answerHash: 'sha256:placeholder',
            points: 140,
          },
        ],
      },
      {
        id: 't2',
        title: 'Abuse the tool call',
        body: '## Confused deputy\nThe app exposes a `lookup` tool with no authorization check. Coerce the model into calling it with attacker-controlled arguments.',
        questions: [
          {
            id: 'q2',
            prompt: 'Retrieve the admin record exposed by the unauthenticated tool.',
            kind: 'flag',
            answerHash: 'sha256:placeholder',
            points: 180,
          },
        ],
      },
    ],
  },
  {
    id: 'r-cloud-iam',
    slug: 'cloud-keymaster',
    title: 'Cloud Keymaster',
    summary:
      'Escalate privileges in a misconfigured cloud account by chaining IAM policy mistakes into full account takeover.',
    kind: 'network',
    track: 'cloud',
    difficulty: 'hard',
    xp: 440,
    estMinutes: 120,
    tags: ['cloud', 'iam', 'privesc', 'metadata'],
    author: 'strato',
    updated: '2026-06-08',
    tasks: [
      {
        id: 't1',
        title: 'Steal the instance role',
        body: '## Metadata service\nAn SSRF on the front-end app lets you reach the instance metadata endpoint. Recover temporary credentials.',
        questions: [
          {
            id: 'q1',
            prompt: 'What is the role name attached to the compromised instance?',
            kind: 'text',
            points: 160,
          },
        ],
      },
      {
        id: 't2',
        title: 'Policy chaining',
        body: '## Escalate\nThe role can pass other roles. Chain `iam:PassRole` with a function deploy to assume an admin role.',
        questions: [
          {
            id: 'q2',
            prompt: 'Submit the account-takeover flag from the admin bucket.',
            kind: 'flag',
            answerHash: 'sha256:placeholder',
            points: 280,
          },
        ],
      },
    ],
  },
  {
    id: 'r-privesc-linux',
    slug: 'root-cause',
    title: 'Root Cause',
    summary:
      'A pure Linux privilege-escalation gauntlet: cron jobs, writable paths, capabilities, and kernel exploits.',
    kind: 'challenge',
    track: 'privesc',
    difficulty: 'medium',
    xp: 300,
    estMinutes: 80,
    tags: ['privesc', 'linux', 'cron', 'capabilities'],
    author: 'cipher',
    updated: '2026-05-28',
    lab: {
      id: 'lp-privesc',
      name: 'Hardened Linux target',
      nodes: [{ hostname: 'vault', image: 'nethex/lab-linux-privesc', role: 'target' }],
      ttlSeconds: 5400,
      egress: 'none',
    },
    tasks: [
      {
        id: 't1',
        title: 'Enumerate vectors',
        body: '## Surface area\nRun a structured enumeration pass and triage the most promising escalation vectors.',
        suggestedCommands: [
          { label: 'Sudo rights', cmd: 'sudo -l' },
          { label: 'Capabilities', cmd: 'getcap -r / 2>/dev/null' },
          { label: 'Cron', cmd: 'cat /etc/crontab' },
        ],
        questions: [
          {
            id: 'q1',
            prompt: 'Which binary has the cap_setuid capability?',
            kind: 'text',
            points: 120,
          },
        ],
      },
      {
        id: 't2',
        title: 'Become root',
        body: '## Exploit\nLeverage the capability you found to spawn a root shell and read the final flag.',
        questions: [
          {
            id: 'q2',
            prompt: 'Submit the contents of /root/root.txt',
            kind: 'flag',
            answerHash: 'sha256:placeholder',
            points: 180,
          },
        ],
      },
    ],
  },
];

const roomById = Object.fromEntries(ROOMS.map((r) => [r.id, r]));
export const getRoom = (slug: string) => ROOMS.find((r) => r.slug === slug);
export const getRoomById = (id: string) => roomById[id];

// ─── Learning paths ───────────────────────────────────────────────────────
export const PATHS: LearningPath[] = [
  {
    id: 'p-foundations',
    slug: 'cyber-foundations',
    title: 'Cyber Foundations',
    tagline: 'From zero to operator',
    description:
      'Build the bedrock: Linux & Windows fluency, networking, scripting, and your first guided hacks. No prior experience required.',
    track: 'foundations',
    difficulty: 'intro',
    estHours: 24,
    accent: 'from-emerald-500/30 to-cyber/20',
    icon: 'terminal',
    modules: [
      {
        id: 'm1',
        title: 'Command Line & Linux',
        summary: 'Own the shell.',
        roomIds: ['r-linux-recon', 'r-privesc-linux'],
      },
      {
        id: 'm2',
        title: 'Defensive First Steps',
        summary: 'See both sides early.',
        roomIds: ['r-soc-triage'],
      },
    ],
  },
  {
    id: 'p-offense',
    slug: 'offensive-operator',
    title: 'Offensive Operator',
    tagline: 'Break in, move laterally, own the domain',
    description:
      'A full red-team pipeline: web exploitation, privilege escalation, and Active Directory attack paths against realistic networks.',
    track: 'offensive',
    difficulty: 'hard',
    estHours: 60,
    accent: 'from-violet/30 to-rose-500/20',
    icon: 'crosshair',
    modules: [
      {
        id: 'm1',
        title: 'Web Exploitation',
        summary: 'Attack modern web apps.',
        roomIds: ['r-web-injection'],
      },
      {
        id: 'm2',
        title: 'Privilege Escalation',
        summary: 'From user to root.',
        roomIds: ['r-privesc-linux'],
      },
      {
        id: 'm3',
        title: 'Active Directory',
        summary: 'Own the enterprise.',
        roomIds: ['r-ad-foothold'],
      },
    ],
  },
  {
    id: 'p-defense',
    slug: 'blue-team-analyst',
    title: 'Blue Team Analyst',
    tagline: 'Detect, respond, investigate',
    description:
      'Live the SOC analyst and incident-responder workflow: triage alerts, hunt threats, and perform memory & disk forensics.',
    track: 'defensive',
    difficulty: 'medium',
    estHours: 40,
    accent: 'from-cyber/30 to-blue-500/20',
    icon: 'shield',
    modules: [
      {
        id: 'm1',
        title: 'SOC Operations',
        summary: 'Triage at scale.',
        roomIds: ['r-soc-triage'],
      },
      {
        id: 'm2',
        title: 'Digital Forensics',
        summary: 'Follow the artifacts.',
        roomIds: ['r-dfir-memory'],
      },
    ],
  },
  {
    id: 'p-modern',
    slug: 'modern-frontiers',
    title: 'Modern Frontiers',
    tagline: 'AI, cloud & the new attack surface',
    description:
      'The cutting edge: red-teaming LLM applications, cloud IAM exploitation, container & Kubernetes security, and DevSecOps.',
    track: 'ai-security',
    difficulty: 'hard',
    estHours: 45,
    accent: 'from-fuchsia-500/30 to-cyber/20',
    icon: 'sparkles',
    modules: [
      {
        id: 'm1',
        title: 'AI / LLM Security',
        summary: 'Break the model.',
        roomIds: ['r-llm-redteam'],
      },
      {
        id: 'm2',
        title: 'Cloud Security',
        summary: 'Escalate in the cloud.',
        roomIds: ['r-cloud-iam'],
      },
    ],
  },
];

export const getPath = (slug: string) => PATHS.find((p) => p.slug === slug);

// ─── Engagement data ──────────────────────────────────────────────────────
export const BADGES: Badge[] = [
  { id: 'b1', name: 'First Blood', description: 'Complete your first room.', icon: 'droplet', rarity: 'common' },
  { id: 'b2', name: 'Shell Seeker', description: 'Pop your first root shell.', icon: 'terminal', rarity: 'rare' },
  { id: 'b3', name: 'Domain Dominator', description: 'Reach Domain Admin in a network lab.', icon: 'network', rarity: 'epic' },
  { id: 'b4', name: 'Streak Keeper', description: 'Maintain a 7-day streak.', icon: 'flame', rarity: 'rare' },
  { id: 'b5', name: 'Mind the Model', description: 'Break an LLM guardrail.', icon: 'sparkles', rarity: 'epic' },
  { id: 'b6', name: 'Apex Operator', description: 'Finish an entire path.', icon: 'crown', rarity: 'legendary' },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, handle: 'zer0cool', xp: 48230, streak: 142, country: '🇸🇪' },
  { rank: 2, handle: 'nyx', xp: 44110, streak: 98, country: '🇩🇪' },
  { rank: 3, handle: 'm0nde', xp: 41880, streak: 211, country: '🇧🇷' },
  { rank: 4, handle: 'reliq', xp: 39450, streak: 64, country: '🇯🇵' },
  { rank: 5, handle: 'strato', xp: 36720, streak: 33, country: '🇨🇦' },
  { rank: 6, handle: 'aegis', xp: 33990, streak: 77, country: '🇮🇳' },
  { rank: 7, handle: 'vector', xp: 31200, streak: 45, country: '🇬🇧' },
  { rank: 8, handle: 'cipher', xp: 29870, streak: 120, country: '🇺🇸' },
];
