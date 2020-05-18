<template>
    <div>
        <!--面包屑插件-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片插件-->
        <el-table :data="rightList" border stripe style="width: 70%">
            <el-table-column type="index" ></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { getRightsListData } from '@/api/rights'
    export default {
        name: "Rights",
        data() {
            return {
                rightList: [],
            }
        },
        created() {
            this.getRightList()
        },
        methods: {
            getRightList() {
                getRightsListData('list').then(res => {
                    this.rightList = res.data
                    // console.log(this.rightList)
                    this.total = this.rightList.length
                })
            },
        }
    }
</script>

<style scoped>

</style>