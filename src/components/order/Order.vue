<template>
  <div>
    <!--面包屑插件-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <!-- 头部搜索、添加区 -->
      <el-row  :gutter="20">
          <!--搜索栏 -->
        <el-col :span="8">
          <el-input
            placeholder="用户ID"
            v-model.number="queryInfo.user_id"
            clearable
            @clear="getOrderList"
            @keyup.native.enter="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格区 -->
      <el-table :data="tableData" stripe border>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="用户id" prop="user_id"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="order_pay">
              <template v-slot="scope">
                  <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
                  <el-tag type="danger" v-else>未付款</el-tag>
              </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send">
          </el-table-column>
          <el-table-column label="下单时间" prop="">
              <template v-slot="scope">
                  {{scope.row.create_time*1000 | timeFmt}}
              </template>
          </el-table-column>
          <el-table-column label="操作">
              <template v-slot="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddress"></el-button>
                  <el-button type="danger" icon="el-icon-location-outline" size="mini" @click="showExpress(scope.row)"></el-button>
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
        :total="total"
        background>
    </el-pagination>
    </el-card>
    <!-- 城市对话框 -->
    <el-dialog
            title="修改城市"
            :visible.sync="editDialogVisible"
            width="50%">
            <el-form :model="cityForm" :rules="cityFormRules" ref="cityFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address">
                    <el-cascader
                        v-model="cityForm.address"
                        :options="cityData">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailAddress">
                    <el-input v-model="cityForm.detailAddress"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddress">确 定</el-button>
            </span>
    </el-dialog>
    <!--  @update:visible="expressDialogVisible = v" -->
    <express-dialog
      v-if="expressDialogVisible"
      :visible.sync="expressDialogVisible" 
    >
    </express-dialog>
  </div>
</template>

<script>
import cityData from '@/utils/city'
import {queryOrderList, queryOrderByID} from '@/api/order'
import ExpressDialog from '@/components/ExpressDialog'
export default {
  name: "Order",
  components: {
    ExpressDialog
  },
  data() {
    return {
      queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
          user_id: '',
          pay_status: '',
      },
      total: 0,
      tableData: [],
      cityForm: {
          address: [],
          detailAdress: ''
      },
      cityFormRules: {
          address: { required: true, message: '请输入地区', trigger: 'blur' },
          detailAddress: { required: true, message: '请输入详细地址', trigger: 'blur' }
                  
      },
      editDialogVisible: false,
      expressDialogVisible: false, // 地址弹框
      cityData  
    };
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取商品列表
    getOrderList() {
        queryOrderList(this.queryInfo).then(res => {
            const { total, goods } = res.data

            this.total = total
            this.tableData = goods 
            this.orderId = goods.order_id
        })
    },
    handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList()
    },
    handleCurrentChange(newNum) {
        this.queryInfo.pagenum = newNum;
        this.getOrderList()
    },
    // 查询详情
    getOrderDetail() {
        this.queryInfo.pagenum = 1
        queryOrderByID(this.orderId).then(res => {
            this.tableData = res.data
            console.log(res);
            
        })
    },
    editAddress() {
        this.editDialogVisible = true
    },
    // 保存地址
    saveAddress() {
        this.editDialogVisible = false
    },
    // 展示快递
    showExpress(row) {
      const { order_id: orderId } = row
      console.log(orderId);
      
      this.expressDialogVisible = true
    }
  },
};
</script>
