<template>
  <div>
    <!-- <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            v-if="$store.state.collapsed" @click="toggleCollapsed"/> -->
    <MenuFoldOutlined  v-if="$store.state.collapsed && collapsed " @click="toggleCollapsed"/>
    <MenuUnfoldOutlined  v-else-if="$store.state.collapsed && !collapsed" v-if="$store.state.collapsed" @click="toggleCollapsed"/>
    <a-drawer
        title="Nan's BBS"
        placement="left"
        :closable="false"
        :visible="visible"
        width="210"
        @close="onClose"
    >
      <IndexMenu/>
    </a-drawer>
  </div>
</template>

<script>
import IndexMenu from "@/components/index/head/IndexMenu";
import { MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons-vue';

export default {
  components: {IndexMenu,MenuFoldOutlined,MenuUnfoldOutlined,},

  data() {
    return {
      visible: false,
      collapsed: true,
    };
  },

  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      this.showDrawer();
    },

    showDrawer() {
      this.visible = true;
    },

    onClose() {
      this.visible = false;
    },
  },

};
</script>

<style scoped>

</style>
