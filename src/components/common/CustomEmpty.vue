<template>
  <div id="custom-empty">
    <div class="container">
      <div class="avatar">
        <a-avatar :size="50" style="background: #f0f2f5" />
        <div class="username">
          <p></p>
          <div></div>
        </div>
      </div>
      <div class="content"></div>
      <div class="comment">
        <p></p>
        <div></div>
      </div>
    </div>
    <br />
  </div>
</template>

<script setup></script>

<style scoped>
#custom-empty {
  background: #fff;
  padding: 20px;
}

#custom-empty .container {
  animation: skeleton-loading 1.2s ease-in-out infinite;
}

#custom-empty .avatar {
  display: flex;
  align-items: center;
}

#custom-empty .username {
  padding-left: 12px;
  width: 140px;
}

#custom-empty .username p,
#custom-empty .comment p {
  height: 12px;
  margin: 0 0 8px;
  background: #f0f2f5;
  border-radius: 4px;
}

#custom-empty .content {
  height: 90px;
  margin: 16px 0;
  background: #f0f2f5;
  border-radius: 4px;
}

#custom-empty .comment div {
  height: 12px;
  width: 60%;
  background: #f0f2f5;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}
</style>
