<template>
  <div>
    <!--面包屑插件-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    <!-- 卡片视图 -->
      <el-card>
        <!-- 提示信息 -->
        <el-alert
          title="添加商品信息"
          type="warning"
          center
          show-icon>
        </el-alert>
        <!-- 横向进度条 -->
        <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- 纵向进度条 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top" label-width="90px">
          <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="0">
              <!-- 选择分类 -->
              <el-form-item label="商品分类" prop="goods_cat">
                <!-- 级联选择框 -->
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
              <!-- 表单验证 -->
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input type="number" v-model="addForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input type="number"  v-model="addForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item type="number" label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight"></el-input>
              </el-form-item>
            </el-tab-pane>
            <!-- 参数信息 -->
            <el-tab-pane label="商品参数" name="1">
              <!-- 渲染表单item -->
              <el-form-item v-for="(item, i) in manyTableData" :key="i" :label="item.attr_name">
                <!-- 复选框展示 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox 
                    :label="checkbox"
                    v-for="(checkbox, index) in item.attr_vals"
                   :key="index" border>
                </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <!-- 属性 -->
            <el-tab-pane label="商品属性" name="2">
              <!-- 渲染静态属性 -->
              <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
                  <!-- input表单 -->
                  <el-input 
                    v-model="item.attr_vals">
                  </el-input>             
              </el-form-item>
            </el-tab-pane>
            <!-- 商品图片 -->
            <el-tab-pane label="商品图片" name="3">
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="uploadSeccess"
                list-type="picture"
                 :headers="headerObj">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <!-- 商品介绍 -->
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑 -->
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <!-- 添加提交按钮 -->
              <el-button type="primary" @click="submitGoods">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
      <!-- 图片预览 -->
      <el-dialog title="图片预览"
       :visible.sync="picDialogVisible" width="50%">
        <img :src="previewPath" class="previewImg">
      </el-dialog>
  </div>
</template>
<script>
import {getCateDate, getCateAttr, addGoods} from '@/api/cate'
export default {
  name: "Add",
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0 ,
        goods_number: 0,
        goods_weight: 0,
        // 选中的分类数组
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attr: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_cat: [{required: true, message: '请输入商品分类', trigger: 'blur' }],
      },
      cateList: [],
      cateProps: { 
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover' 
      },
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      picDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      getCateDate().then(res => {
        // console.log(res.data);
        this.cateList = res.data
      })
    },
    handleChange() {
      // console.log(this.addForm.goods_cat);
      
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    /**
     * 切换tabs时，触发方法，判断是否选择了分类
     */
    beforeTabLeave(activeName, oldActiveName) {
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 获取分类的参数数据
    getCateAttr(sel, dataKey) {
       // 请求商品参数数据，先确定分类的id
      const cateId = this.addForm.goods_cat.length === 3? this.addForm.goods_cat[2]: null;
      getCateAttr(cateId, { sel }).then(res => {
          console.log(res.data);
          // 判断当前点击的tab的值是否是动态属性，是，切割数组，不是，不做操作
          // 判断res.data.attr_vals是否为空，如果为空，返回空数组，否则将字符串切割
          if(this.activeIndex === '1') {
            res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0? []: item.attr_vals.split(',')
          });
          }
          
          this[dataKey] = res.data
        })
    },
    /**
     * 点击tab被选中时是触发
     */
    tabClicked() {
      // console.log(this.activeIndex);
      // 判断当前是在哪一个tab标签
      if(this.activeIndex === '1') {
        this.getCateAttr('many', 'manyTableData');        
      }else if(this.activeIndex === '2') {
        this.getCateAttr('only', 'onlyTableData');
        console.log(this.onlyTableData);       
      }     
    },
    // 图片预览
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.response.data.url
      this.picDialogVisible = true
    },
    // 移除图片
    handleRemove(file) {
      // console.log(file);
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(item => item.pic === filePath)
      // console.log(i);
      console.log(this.addForm.pics);
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics);
 
    },
    // 上传成功触发
    uploadSeccess(response) {
      // console.log(response);
      const picInfo = {pic: response.data.tmp_path}
      this.addForm.pics.push(picInfo)
    },
    // 提交添加
    submitGoods() {
      this.$refs.addFormRef.validate( valid => {
        // 验证表单是否符合要求
        if(!valid) return this.$message.error('请输入必填的信息')

        // 验证通过，请求api接口获取数据
        // goods_cat要求是字符串，但是我们绑定的是数组，需要深拷贝转换
        const form = JSON.parse(JSON.stringify(this.addForm))
       
        form.goods_cat = form.goods_cat.join(',')
      
        // addForm.attr_vals要求所有参数的数组，所以要将动态属性和静态参数组合起来

        // 遍历manyTableData
        this.manyTableData.forEach(item => {
          const newAttr = {attr_id: item.attr_id, attr_value: item.attr_vals.join(',')}
          form.attr.push(newAttr) 
        })
        //遍历静态参数
        this.onlyTableData.forEach(item => {
          const newAttr1 = {attr_id: item.attr_id, attr_value: item.attr_vals}
          form.attr.push(newAttr1) 
        })
        //  console.log(form);
        // 发送请求
        addGoods(form).then(res => {
          console.log(res);
          this.$router.push('/goods')
        })

      })
    }

  }
}
</script>
<style lang='less' scope>
.el-form-item__label {
  widows: 100px;
}
.previewImg {
  width: 100%;
}
.ql-container  {
  min-height: 300px !important;
}
//  {
//   margin-top: 15px;
// }
</style>