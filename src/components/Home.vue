<template>
  <!-- 引入container布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>个人运动平台</span>
      </div>

      <el-button type="info" @click="logout">安全退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff">
          <!-- 一级菜单 -->
          <el-submenu :index="items.id+''" v-for="items in menuList" :key="items.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{items.title}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="item.id+''" v-for="item in items.subMenuList" :key="item.id">
              <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.title}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 菜单列表
      menuList:[],
    }
  },
  created() {
      // 查询menuList
      this.getMenuList();
  },
  methods: {
    // 安全退出
    logout() {
      window.sessionStorage.clear(); // 清楚session
      this.$router.push("/login"); // 回到首页
    },
    // 获取导航菜单
    async getMenuList() {
      const {data:res} = await this.$http.get("menus");
      console.log(res);
      if (res.flag != 200) return this.$message.error("获取列表失败！！");// 访问失败的错误信息
      this.menuList = res.menus;// 数据回填
    },
  },
};
</script>

<style lang="less" scoped>
// 布局器样式
.home-container {
  height: 100%;
}
// 头样式
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; // 左右贴边
  padding-left: 0%; // 左边界
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
// 侧边样式
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
// 主体样式
.el-main {
  background-color: #eaedf1;
}

img {
  width: 55px;
  height: 55px;
}
</style>