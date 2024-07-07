module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复
        'docs', // 文档变更
        'style', // 样式（空白、格式、缺少分号等）
        'refactor', // 代码重构
        'perf', // 性能优化
        'test', // 增加测试
        'build', // 构建过程或辅助工具的变动
        'ci', // CI 配置文件和脚本变动
        'chore', // 其他不修改 src 或者测试文件的更改
        'revert', // 回滚 commit
      ],
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [0], // 不强制 subject 的大小写
  },
};
