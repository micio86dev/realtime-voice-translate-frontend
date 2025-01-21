module.exports = {
  apps: [
    {
      name: "realtime-voice-translate",
      script: "server/entry.bun.js",
      interpreter: "bun",
      args: '--name="realtime-voice-translate" --watch',
      watch: ["./server", "./dist"],
    },
  ],

  deploy: {
    production: {
      user: "www-data",
      host: "139.59.143.5",
      ref: "origin/main",
      repo: "git@github.com:micio86dev/realtime-voice-translate-frontend.git",
      path: "/var/www/html/realtime-voice-translate",
      "pre-deploy-local": "",
      "post-deploy":
        "bun install && bun run build && pm2 reload ecosystem.config.cjs --env production",
      "pre-setup": "",
    },
  },
};
