module.exports = {
  apps: [{
    name: 'realtime-voice-translate',
    script: 'server/entry.bun.js',
    args: '--name="realtime-voice-translate" --watch',
    watch: './dist'
  }],

  deploy: {
    production: {
      user: 'www-data',
      host: '139.59.143.5',
      ref: 'origin/main',
      repo: 'git@bitbucket.org:miciodev/realtime-voice-translate-frontend.git',
      path: '/var/www/html/realtime-voice-translate-frontend',
      'pre-deploy-local': '',
      'post-deploy': 'bun install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};