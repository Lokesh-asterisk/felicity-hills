module.exports = {
  apps: [{
    name: 'felicity-hills',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_file: '.env.production',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
