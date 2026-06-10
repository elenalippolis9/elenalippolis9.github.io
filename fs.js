/* ── Virtual filesystem ─────────────────────────────────────
   Each key is an absolute path starting with ~
   type: 'dir'  → children: [names]
   type: 'file' → content: string, link?: string (optional URL)
──────────────────────────────────────────────────────────── */

const FS = {

  /* ── Root ── */
  '~': {
    type: 'dir',
    children: ['about', 'projects', 'writing', 'contact'],
  },

  /* ── About ── */
  '~/about': {
    type: 'dir',
    children: ['bio.txt', 'stack.txt', 'now.txt'],
  },
  '~/about/bio.txt': {
    type: 'file',
    content:
`I build tools for developers, obsess over system design,
and occasionally write about things I've learned.

Currently working on distributed systems at SomeCompany.
Previously at OtherPlace.

Based in Berlin. Originally from Somewhere.`,
  },
  '~/about/stack.txt': {
    type: 'file',
    content:
`languages   Go, Rust, TypeScript, Python, SQL
infra        Kubernetes, Terraform, AWS, Postgres, Redis
interests    distributed systems, compilers, unix philosophy
currently    learning eBPF, reading DDIA for the third time`,
  },
  '~/about/now.txt': {
    type: 'file',
    content:
`Updated: 2025-11-01

- Building an open-source observability tool
- Reading "Designing Data-Intensive Applications" (again)
- Trying to run 3x per week with mixed success`,
  },

  /* ── Projects ── */
  '~/projects': {
    type: 'dir',
    children: ['project-one', 'project-two', 'project-three'],
  },
  '~/projects/project-one': {
    type: 'dir',
    children: ['readme.md', 'link.txt'],
  },
  '~/projects/project-one/readme.md': {
    type: 'file',
    content:
`project-one  ★ 312

A CLI tool that does something genuinely useful.
Describe it in one punchy sentence here.

tags: go, cli, open-source`,
  },
  '~/projects/project-one/link.txt': {
    type: 'file',
    content: `https://github.com/yourname/project-one`,
    link: 'https://github.com/yourname/project-one',
  },

  '~/projects/project-two': {
    type: 'dir',
    children: ['readme.md', 'link.txt'],
  },
  '~/projects/project-two/readme.md': {
    type: 'file',
    content:
`project-two  ★ 89

Another project worth mentioning. What does it do?

tags: rust, wasm`,
  },
  '~/projects/project-two/link.txt': {
    type: 'file',
    content: `https://github.com/yourname/project-two`,
    link: 'https://github.com/yourname/project-two',
  },

  '~/projects/project-three': {
    type: 'dir',
    children: ['readme.md'],
  },
  '~/projects/project-three/readme.md': {
    type: 'file',
    content:
`project-three  ★ 44

Smaller experiment or library. Still worth shipping.

tags: typescript, node`,
  },

  /* ── Writing ── */
  '~/writing': {
    type: 'dir',
    children: [
      '2025-11-03_rust-rewrite.md',
      '2025-09-17_cli-design.md',
      '2025-07-02_boring-tech.md',
      '2025-04-12_postgres-lessons.md',
    ],
  },
  '~/writing/2025-11-03_rust-rewrite.md': {
    type: 'file',
    content:
`Why I rewrote my side project in Rust
Published: 2025-11-03

Six months ago I rewrote a Go service in Rust. Here is
what I actually learned beyond the obvious perf numbers.

https://yourname.github.io/writing/rust-rewrite`,
    link: 'https://yourname.github.io/writing/rust-rewrite',
  },
  '~/writing/2025-09-17_cli-design.md': {
    type: 'file',
    content:
`Notes on designing CLIs that don't suck
Published: 2025-09-17

Good CLIs feel like they were designed by someone who
actually uses the terminal. Most aren't.

https://yourname.github.io/writing/cli-design`,
    link: 'https://yourname.github.io/writing/cli-design',
  },
  '~/writing/2025-07-02_boring-tech.md': {
    type: 'file',
    content:
`The case for boring technology
Published: 2025-07-02

Postgres. Redis. nginx. The boring choices that let you
focus on the actual problem.`,
  },
  '~/writing/2025-04-12_postgres-lessons.md': {
    type: 'file',
    content:
`What Postgres taught me about system design
Published: 2025-04-12

Five years of using Postgres as my default database,
and what I've learned about thinking in sets and constraints.`,
  },

  /* ── Contact ── */
  '~/contact': {
    type: 'dir',
    children: ['email.txt', 'links.txt'],
  },
  '~/contact/email.txt': {
    type: 'file',
    content: `you@example.com`,
    link: 'mailto:you@example.com',
  },
  '~/contact/links.txt': {
    type: 'file',
    content:
`github    https://github.com/yourname
linkedin  https://linkedin.com/in/yourname
twitter   https://twitter.com/yourname`,
  },
};
