<template>
    <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            unique-opened
            :collapse="collapse"
            :collapse-transition="false"
            router
            :default-active="$route.path">
        <el-submenu :index="menu.id + ''" v-for="(menu,index) in menuList" :key="menu.id">
            <template slot="title">
                <i :class="icon[index]"></i>
                <span>{{menu.authName}}</span>
            </template>
                <el-menu-item :index="'/' + menuItem.path" v-for="menuItem in menu.children" :key="menuItem.id">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{menuItem.authName}}</span>
                    </template>
                </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        name: "SubNav",
        data() {
            return {
                icon: [
                    'iconfont icon-users',
                    'iconfont icon-tijikongjian',
                    'iconfont icon-shangpin',
                    'iconfont icon-danju',
                    'iconfont icon-baobiao'
                ]
            }
        },
        props: {
          menuList: {
              type: Array,
              default() {
                  return []
              }
          },
        collapse: {
            type: Boolean,
            default: false
        }
        },
        methods: {

        }
    }
</script>

<style scoped>
.el-menu {
    border-right: 0;
}
.iconfont {
    vertical-align: middle;
    margin-right: 10px;
}
</style>