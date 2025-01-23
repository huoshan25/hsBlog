module.exports = {
  apps: [{
    // 基础配置
    name: 'hs-blog',                        // 应用名称
    script: '.output/server/index.mjs',     // 启动脚本路径

    // 环境变量配置
    env: {
      NODE_ENV: 'production',
      NITRO_PORT: 3001,
      NUXT_PUBLIC_API_BASE_URL: 'https://hs-blog.top/api',
      NUXT_PUBLIC_SITE_URL: 'https://hs-blog.top'
    },

    // 进程配置
    instances: 1,                           // 实例数量
    autorestart: true,                      // 自动重启
    watch: false,                           // 文件变化监控
    max_memory_restart: '5',               // 内存超限重启

    // 日志配置
    error_file: 'logs/err.log',            // 错误日志路径
    out_file: 'logs/out.log',              // 输出日志路径
    log_date_format: 'YYYY-MM-DD HH:mm:ss',// 日志时间格式

    // 其他高级配置
    exec_mode: 'cluster',                   // 执行模式：cluster/fork
    increment_var : 'PORT',                 // 多实例时递增的环境变量
    restart_delay: 4000,                    // 重启延迟
    min_uptime: '30s'                       // 最小运行时间
  }]
}