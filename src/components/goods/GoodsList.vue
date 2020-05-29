<template>
  <div>
    <!--面包屑插件-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <!-- 头部搜索、添加区 -->
      <el-row  :gutter="20">
          <!--搜索栏 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
             v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
            <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区 -->
      <el-table :data="goodsList" stripe border>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price" width="120"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="96"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="96">
              <template slot-scope="scope">
                {{scope.row.add_time*1000 | timeFmt}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="130">
              <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              </template>
          </el-table-column>

      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getGoodsListData} from '@/api/goods'
export default {
  name: "GoodsList",
  data() {
    return {
        queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 10
        },
        total: 0,
        goodsList: [],
        select: ''
    };
  },
  created() {
      this.getGoodsList()
  },
  methods: {
    //   获取商品列表
      getGoodsList() {
          getGoodsListData(this.queryInfo).then(res => {
              console.log(res.data);
              this.total = res.data.total
              this.goodsList = res.data.goods
          })
      },
      handleSizeChange(newSize) {
          this.queryInfo.pagesize = newSize;
          this.getGoodsList()
      },
      handleCurrentChange(newNum) {
          this.queryInfo.pagenum = newNum;
          this.getGoodsList()
      },
      searchGood() {
          this.queryInfo.pagenum = 1
           this.getGoodsList()
      },
      goAddPage() {
          this.$router.push({path: '/goods/add'})
      }
  },
};
</script>

<style scoped></style>
