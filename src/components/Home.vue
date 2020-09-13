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
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu 
        text-color="#fff" 
        background-color="#545c64" 
        active-text-color="#409eff" 
        unique-opened  
        :router="true" 
        :collapse="isCollapse" 
        :collapse-transition="false" 
        :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="items.id+''" v-for="items in menuList" :key="items.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{items.title}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="item.path" v-for="item in items.subMenuList" :key="item.id" @click="saveNavState(item.path)">
              <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.title}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 菜单列表
      menuList: [],
      // 伸缩
      isCollapse: false,
      // 默认路径
      activePath: '',
    }
  },
  created() {
      // 查询menuList
      this.getMenuList();
      // 取出session中的path 动态修改activePath
      this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // 安全退出
    logout() {
      // 清除session
      window.sessionStorage.clear();
      // 回到首页
      this.$router.push("/login");
    },
    // 获取导航菜单
    async getMenuList() {
      const {data:res} = await this.$http.get("menus");
      console.log(res);
      if (res.flag != 200) return this.$message.error("获取列表失败！！");// 访问失败的错误信息
      this.menuList = res.menus;// 数据回填
    },
    // 控制伸缩
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存路径
    saveNavState(val) {
      // activePath保存在session中
      window.sessionStorage.setItem("activePath",val); 
      this.activePath = val;
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
  align-items: center;
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
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer; // 显示小手
}
</style>