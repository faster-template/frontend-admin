<div align="center">
  <h1>faster-template快速模板管理端</h1>
  <h2>⭐️后端项目 <a href="https://github.com/heifengli001/faster-template-backend-with-nestjs">faster-template-backend-with-nestjs</a>⭐️</h2>
</div>

## 🤖 简介
该项目是后端[faster-template-backend-with-nestjs](https://github.com/heifengli001/faster-template-backend-with-nestjs)的前端实现，
关于后端服务已有能力可前往查看已支持的功能

## 🎯 目标
 做一个开箱即用的快速开发模板。前端开发人员无需关注底层建设，只需要关心新增业务。

相比ServerLess，它的后台部分不会因为过多因素而导致臃肿和冗余，完全贴近国内前端开发人员习惯，支持迅速接入微信登录，云OSS。

模板底层已实现JWT,CSRF,XSS,CORS，配置清晰，模块明确。

将全面使用NodeJS(NestJS)+TypeScript 进行后台动能开发。

## 说明：
### 精简内容
该前端项目使用`Arco-pro` 的simple模板初始化。为保证项目足够轻巧而不臃肿，已将`arco`中部分内容进行删除，但仍有许多多余内容需要清理及优化，目前仍在持续进行中。

Done:
+ 多语言不再持续支持
+ 切换主题不再支持

Todo:
+ 角色权限将使用其他方式实现
+ Axios将修改为建立单例而不是在原生axios上增加
+ more ... 

### 还在初期
该前端项目目前只是初版，仍有较多优化地方请勿直接使用。更多功能的前端实现扔在持续迭代。前端项目将和后端项目一起逐步迭代，但仍然优先后端项目的功能实现为主。

## 已实现功能
+ 用户登录及个人设置
+ 内容管理
    + 用户互动(评论，赞)
+ 草稿箱
+ 素材管理
    + 媒体资源上传及默认压缩
+ 分类管理
+ 底层安全支持（CSRF/XSS/CORS）

## 待实现
+ 角色及权限重新调整
+ 用户管理
+ 微信小程序登录接入（公众号认证已接入）
+ More ... 

## 技术栈
+ Vue3 + pinia + TypeScript
+ UI: Arco


## 在线Demo
🚀后端服务项目：https://github.com/heifengli001/faster-template-backend-with-nestjs

+ 地址：https://ft.heifengli.top
+ 用户名：admin
+ 密码：Admin123

### 登录
<div align="center">
<img src="https://qiniu.ruashi.cn/Xnip2024-07-04_19-29-07.jpg" /></div>

### 内页
<div align="center">
<img src="https://qiniu.ruashi.cn/Xnip2024-07-04_19-34-44.jpg" />
</div>

---

## 部署

参考文章：[【NestJS应用从0到1】11.部署及git-hook自动部署](https://juejin.cn/post/7387291151735275529)

上面文章是部署NestJS后端应用程序，前端和NestJS的流程类似，但最终打包前端只需要静态托管，无需启动服务

如果你也刚好是使用webhook自动部署，在deploy文件夹下已经准备好了`webhook脚本`以及`服务重启`脚本