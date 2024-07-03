<template>
  <div class="home-container">
    <h1>你好,</h1>
    <h2>这是一个快速模板, 它分为两部分：</h2>
    <h3>1. 🚀 后台服务：使用NestJS + TypeORM(MySql) + TypeScript 的后端快速模板</h3>
    <h3>2. ⭐️ 管理前端：使用Vue3 + TypeScript + Arco 的管理页面（就是现在看到的这个页面）</h3>
    <div style="font-size: 18px; line-height: 32px; font-weight: bolder">为什么要做这个？</div>
    <div style="line-height: 24px"
      ><strong>自己想搞事，但是没找到那么合适的开源框架。</strong>
      因为想做一个垂直领域的知识小型论坛，能够支持微信及小程序登录，以及我有一些自定义的需求以及内容结构，
      无法直接使用一些开源的博客及论坛应用。在开源市场找了很久，
      之前有考虑一些低代码serverLess的平台,比如说strapi还有一些类似的，确实能够0代码搭出一个后端服务，但是接口很难用，而且类型要求不严格，
      很多时候在尝试新增功能时需要debugger到底层才知道需要传值内容及类型。</div
    ><div style="line-height: 24px; margin-top: 20px"
      ><strong>学习及深度使用NestJS+TypeScript。</strong>
      前段时间找工作找了一个多月。虽然有几个Offer但还是觉得没那么合适。现在互联网寒潮席卷，我不想就每天守着boss刷新简历，然后看着已读不回的消息暗自神伤。
      刚好有完全自由的时间，没有太多的打扰因素，是一个较好的学习时期，这样也有事做不会因为工作问题而陷入内耗及焦虑中。</div
    >
    <a-divider></a-divider>
    <h2>学习及使用</h2>
    <div>
      前端是需要搭配NestJS后台使用，前端已经实现了后台管理的部分基础功能：如文章，评论，点赞，分类，个人信息变更，登录</div
    >
    <div
      >后端NestJs服务：<a href="https://github.com/heifengli001/faster-template-backend-with-nestjs"
        >faster-template-backend-with-nestjs</a
      ></div
    >
    <div
      >前端管理页面：<a
        href="https://github.com/heifengli001/faster-template-frontend-admin-with-arco"
        >faster-template-frontend-admin-with-arco</a
      ></div
    >
    <div>后端服务以及前端页面已经提交到Github,如果你觉得有帮助，感谢Star⭐️</div>
    <a-divider></a-divider>
    <h2>遗留问题</h2>
    <div style="line-height: 24px"
      >因为该前端页面是使用Arco的Simple-template。 <br />1.一些基础功能还需要继续改进，
      如缓存管理，axios抽离单例。
      <br />
      2. 我去掉了Arco上绝大多数页面，在代码中可能还会存在一些去除模块的残留内容。
      <br />
      3. 我去除了多语言切换，目前仅在menu是使用多语言，其他地方不再使用多语言。
      <br />
      4. TypeScript 暂未优化完全。因为前段时间都在做后台功能，所以前端项目就比较糙了点。
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .home-container {
    margin: 0 20px;
    padding: 10px 20px;
    background-color: #ffffff;
    height: 100%;
    div {
      line-height: 24px;
    }
  }
</style>
