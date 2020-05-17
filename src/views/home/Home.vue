<template>
    <el-container class="home-container">
        <el-header class="header">
            <div>
                <img src="@/assets/image/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="warning" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!--侧边栏内容-->
            <el-aside :width="isCollapsed ? '64px': '200px'" class="aside">
                <!--插入定义的侧边栏组件-->
                <div class="toggle-button" @click="toggleClick">|||</div>
                <sub-nav :menuList="menuList" :collapse="isCollapsed"></sub-nav>
            </el-aside>
            <!--主题内容-->
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import SubNav from "../../components/SubNav";
    import { getMenuList } from '@/api/user'
    export default {
        name: "Home",
        components: {
            SubNav
        },
        data() {
            return {
                menuList: [],
                isCollapsed: false,
            }
        },
        created() {
            //请求数据
            this._getMenuList()
        },
        methods: {
            //退出登录
            logout() {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            //请求侧边栏menu数据
            _getMenuList() {
                getMenuList().then( res => {
                    // console.log(res)
                    this.menuList = res.data
                })
            },
            toggleClick() {
                this.isCollapsed = !this.isCollapsed
            }
        }
    }
</script>

<style scoped lang="less">
.home-container {
    height: 100%;
    color: #fff;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    > div {
        display: flex;
        align-items: center;
        > span {
            font-size: 20px;
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
    > .toggle-button {
        text-align: center;
        line-height: 24px;
        background-color: #4a5064;
        font-size: 12px;
        color: #fff;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
}
.el-main {
    background-color: #eaedf1;
    color: #000;
}
</style>