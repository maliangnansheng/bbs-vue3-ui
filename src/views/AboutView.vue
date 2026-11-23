<template>
  <AppLayout :max-width="800">
    <div class="about-view">
      <section class="about-section">
        <div class="about-block">
          <div class="about-title">我们的使命</div>
          <div class="about-sub">南生论坛，个人程序人生的点滴记录和时光储备。淡泊明志，宁静致远。珍惜原创，矢志不渝。</div>
        </div>

        <div class="about-block">
          <div class="about-title">我们的愿景</div>
          <div class="about-sub">
            让所有迷失方向的同学找到前进的小路<br />
            让需要提升技术的同学能有所收获<br />
            让同学们有一个学习知识、分享技术的地方
          </div>
        </div>

        <div class="about-block">
          <div class="about-title">作者</div>
          <div class="about-sub">马亮南生（maliangnansheng）</div>
          <img title="微信" src="https://aid.nansin.top/default/wx-mlns.png" width="50%" alt="微信" />
          <img title="QQ" src="https://aid.nansin.top/default/qq-mlns.jpg" width="50%" alt="QQ" />
        </div>

        <div class="about-block">
          <div class="about-title">源码地址</div>
          <div class="about-sub">
            后端源码(GitHub)：
            <a target="_blank" rel="noopener" href="https://github.com/maliangnansheng/bbs-springboot">bbs-springboot</a>
          </div>
          <div class="about-sub">
            前端源码(GitHub)：
            <a target="_blank" rel="noopener" href="https://github.com/maliangnansheng/bbs-vue-ui">bbs-vue-ui</a>
          </div>
          <div class="about-sub">
            后端源码(Gitee)：
            <a target="_blank" rel="noopener" href="https://gitee.com/maliangnansheng/bbs-springboot">bbs-springboot</a>
          </div>
          <div class="about-sub">
            前端源码(Gitee)：
            <a target="_blank" rel="noopener" href="https://gitee.com/maliangnansheng/bbs-vue-ui">bbs-vue-ui</a>
          </div>
        </div>

        <div class="about-block">
          <div class="about-title">学习路线</div>
          <div class="about-sub">
            <a target="_blank" rel="noopener" href="https://bbs.nansin.top/detail/158">Java学习路线</a>
            <br />
            <a target="_blank" rel="noopener" href="https://bbs.nansin.top/detail/159">前端学习路线</a>
          </div>
        </div>

        <div class="about-block">
          <div class="about-title">信息统一整理</div>
          <div class="about-sub">
            设计文档(论文)：
            <a
              target="_blank"
              rel="noopener"
              href="https://76.nansin.top/doc/%E5%8D%97%E7%94%9F%E8%AE%BA%E5%9D%9B%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0.doc"
            >
              南生论坛设计文档
            </a>
          </div>
          <div class="about-sub">
            日常迭代：
            <a target="_blank" rel="noopener" href="https://bbs.nansin.top/detail/122">南生论坛日常迭代</a>
          </div>
          <div class="about-sub about-warning">
            【商用】需看：
            <a target="_blank" rel="noopener" href="https://bbs.nansin.top/detail/171">南生运营的理念</a>
          </div>
          <div class="about-sub">
            安装部署教程：
            <br />
            <a target="_blank" rel="noopener" href="https://bbs.nansin.top/detail/44">【后端】安装部署教程</a>
            <br />
            <a target="_blank" rel="noopener" href="https://bbs.nansin.top/detail/45">【前端】安装部署教程</a>
          </div>
          <div class="about-sub">
            视频教程：
            <br />
            <a target="_blank" rel="noopener" href="https://www.bilibili.com/video/BV1pK411C7T4">南生论坛代码讲解视频</a>
            <br />
            <a target="_blank" rel="noopener" href="https://www.bilibili.com/video/BV1he4y1C7rk">南生论坛使用指南视频</a>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<style lang="less" scoped>
.about-view {
  width: 100%;
}

.about-section {
  padding: 30px;
  background: #fff;
}

.about-block {
  margin-bottom: 18px;
}

.about-title {
  font-size: 30px;
  font-weight: 700;
}

.about-sub {
  margin: 10px 0;
  color: #999;
  font-size: 16px;
  line-height: 1.8;
}

.about-warning {
  color: #cb2222;
}
</style>
