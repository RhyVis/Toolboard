const toolRouter = [
  {
    path: '/codex',
    name: 'codex',
    component: () => import('@/views/tools/CodexView.vue')
  },
  {
    path: '/tarot',
    name: 'tarot',
    component: () => import('@/views/tools/TarotView.vue')
  },
  {
    path: '/spam',
    name: 'spam',
    component: () => import('@/views/tools/SpamView.vue')
  },
  {
    path: '/rept',
    name: 'rept',
    component: () => import('@/views/tools/RepeatView.vue')
  },
  {
    path: '/trans',
    name: 'trans',
    meta: { requireToken: true },
    component: () => import('@/views/tools/TransView.vue')
  }
]

export default toolRouter
