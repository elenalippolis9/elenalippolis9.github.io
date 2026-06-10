const FS = {
  /* ── Root ── */
  '~': {
    type: 'dir',
    children: ['about', 'projects', 'writing'],
  },

  /* ── About ── */
  '~/about': {
    type: 'dir',
    children: ['bio.txt', 'stack.txt', 'now.txt'],
  },
  '~/about/bio.txt': {
    type: 'file',
    path: './content/about/bio.txt', 
  },
  '~/about/stack.txt': {
    type: 'file',
    path: './content/about/stack.txt',
  },
  '~/about/now.txt': {
    type: 'file',
    path: './content/about/now.txt',
  },

  /* ── Projects ── */
  '~/projects': {
    type: 'dir',
    children: ['neutrophil-segmentation.md', 'cell-timelapse.md'],
  },
  '~/projects/neutrophil-segmentation.md': {
    type: 'file',
    path: './content/projects/neutrophil-segmentation.md',
    link: 'https://github.com/elenalippolis9' // Keep external links if needed
  },
  '~/projects/cell-timelapse.md': {
    type: 'file',
    path: './content/projects/cell-timelapse.md',
  },

  /* ── Writing ── */
  '~/writing': {
    type: 'dir',
    children: [
      '2026-04-15_benchmarking-cell-segmentation.md',
      '2025-09-05_unibo-motorsport-web.md',
    ],
  },
  '~/writing/2026-04-15_benchmarking-cell-segmentation.md': {
    type: 'file',
    path: './content/writing/2026-04-15_benchmarking-cell-segmentation.md',
  },
  '~/writing/2025-09-05_unibo-motorsport-web.md': {
    type: 'file',
    path: './content/writing/2025-09-05_unibo-motorsport-web.md',
  },
};