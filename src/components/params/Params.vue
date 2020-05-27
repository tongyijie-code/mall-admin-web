<template>
  <div>
    <!--面包屑插件-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片插件-->
    <el-card>
      <!--警告区域-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
      >
      </el-alert>
      <!--选择商品分类-->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKey"
            :options="goodsCateList"
            :props="goodsCateProps"
            clearable
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParams"
            >添加参数</el-button
          >
          <!-- 添加动态参数 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)">{{ item }}</el-tag
                >
                <!-- 添加新tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row.attr_id)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParams"
            >添加属性</el-button
          >
          <!-- 添加静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 静态参数展开行 -->
            <el-table-column type="expand">
              <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)">{{ item }}</el-tag
                >
                <!-- 添加新tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="静态参数" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addParamsdialogVisible"
      width="50%"
      @close="closeForm"
    >
      <!-- 添加表单 -->
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑属性对话框 -->
    <el-dialog
      title="修改参数名"
      :visible.sync="editParamsdialogVisible"
      width="50%"
      @close="closeEditForm"
    >
      <!-- 添加表单 -->
      <el-form
        :model="editParamsForm"
        :rules="editParamsRules"
        ref="editParamsRef"
        label-width="100px"
      >
        <el-form-item label="参数名" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateDate,
  getCateAttr,
  submitParams,
  queryParams,
  editParamsData,
  remove,
  editSubmitParams
} from "@/api/cate";
export default {
  name: "Params",
  data() {
    return {
      //数据源
      goodsCateList: [],
      //将选中的值，双向绑定存在数组中
      selectedCateKey: [],
      //选择器的配置
      goodsCateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addParamsdialogVisible: false,
      addParamsForm: {
        attr_name: "",
      },
      addParamsRules: {
        attr_name: {
          required: true,
          message: "请输入参数名字",
          trigger: "blur",
        },
      },
      // 修改对话框的数据
      editParamsdialogVisible: false,
      editParamsForm: {
        attr_name: "",
      },
      editParamsRules: {
        attr_name: {
          required: true,
          message: "请输入参数名字",
          trigger: "blur",
        },
      },
    };
  },
  created() {
    this.getGoodsCateList();
  },
  methods: {
    getGoodsCateList() {
      getCateDate().then((res) => {
        // console.log(res.data);
        this.goodsCateList = res.data;
      });
    },
    // 层联选择框选项变化，触发函数
    handleChange() {
      //  如果被选中的不是三级菜单，取消选中
      if (this.selectedCateKey.length !== 3) {
        this.selectedCateKey = [];
        return;
      }
      // 获取分类的参数数据
      this.getParamsData();
    },
    handleTabClick() {
      // console.log(this.activeName);
      this.getParamsData();
    },
    // 获取参数分类
    getParamsData() {
      getCateAttr(this.cataId, { sel: this.activeName }).then((res) => {
        console.log(res.data);
        // 给每一个参数对象遍历
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals? item.attr_vals.split(","): []  
          // item.attr_vals = item.attr_vals.split(",");
          // 给每一个标签都设置一个自己的
          item.inputVisible = false;
          item.inputValue = ''
        });
        if (this.activeName === "many") {
          this.manyTableData = res.data;
          console.log(this.manyTableData);
        } else {
          this.onlyTableData = res.data;
          console.log(this.onlyTableData);
        }
      });
    },
    // 添加参数
    addParams() {
      this.addParamsdialogVisible = true;
    },
    closeForm() {
      this.$refs.addParamsRef.resetFields();
    },
    // 点击确定，提交修改
    commitParams() {
      this.$refs.addParamsRef.validate((valid) => {
        if (!valid) return;
        const data = {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName,
        };
        submitParams(this.cataId, data).then((res) => {
          console.log(res);
          this.getParamsData();
          this.addParamsdialogVisible = false;
        });
      });
    },
    closeEditForm() {
      this.$refs.editParamsRef.resetFields();
    },
    // 点击编辑，根据id查询参数
    edit(attrId) {
      console.log(attrId);

      queryParams(this.cataId, attrId, { attr_sel: this.activeName }).then(
        (res) => {
          console.log(res);
          this.editParamsForm = res.data;
        }
      );
      this.editParamsdialogVisible = true;
    },
    // 编辑参数
    editParams() {
      const data1 = {
        attr_name: this.editParamsForm.attr_name,
        attr_sel: this.editParamsForm.attr_sel,
      };
      editParamsData(this.cataId, this.editParamsForm.attr_id, data1).then(
        (res) => {
          // console.log(res);
          this.getParamsData();
          this.editParamsdialogVisible = false;
        }
      );
    },
    // 删除属性
    removeParams(attrId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          remove(this.cataId, attrId).then((res) => {
            this.$message.success("删除成功!");
            this.getParamsData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 
    handleInputConfirm(row) {
      // console.log('ok');
      // 对文本框去除空格
      if(row.inputValue.trim().length === 0) {
        row.inputValue = '',
        row.inputVisible = false
        return 
      }

      // 如果有内容，经内容放在数组中，并把input框隐藏
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue=''
      // 发送修改参数请求
      editSubmitParams(row.cat_id, row.attr_id,
      {attr_name: row.attr_name,
       attr_sel: row.attr_sel, 
       attr_vals: row.attr_vals.join(',')
       }).then(res => {         
         this.$message(res.meta.msg)
       })

    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 关闭tag标签
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      // 重新发起修改请求
      editSubmitParams(row.cat_id, row.attr_id,
      {attr_name: row.attr_name,
       attr_sel: row.attr_sel, 
       attr_vals: row.attr_vals.join(',')
       }).then(res => {         
         this.$message(res.meta.msg)
       })
    }
  },
  computed: {
    isBtnDisabled() {
      return this.selectedCateKey.length !== 3;
    },
    cataId() {
      return this.selectedCateKey[2];
    },
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style scoped lang="less">
.el-card {
  width: 980px;
  height: 800px;
}
.cat-opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
