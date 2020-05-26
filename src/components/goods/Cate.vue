<template>
    <div>
        <!--面包屑插件-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片插件-->
        <el-card>
            <!--添加分类-->
            <el-row class="add-cate">
                <el-col>
                    <el-button type="primary" @click="addCate">添加分类</el-button>
                </el-col>
            </el-row>
            <!--树状分类表格-->
            <tree-table :data="cateList"
                        :columns="columns"
                        :selection-type="false"
                        :expand-type="false"
                        :show-index="true" border>
                <!-- 是否有效-->
                <template v-slot:isOk="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <!-- 等级-->
                <template v-slot:order="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level===1" type="">二级</el-tag>
                    <el-tag v-else type="">三级</el-tag>
                </template>
                <!-- 操作-->
                <template v-slot:operate="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!--分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[3, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
        <!--添加分类-->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%" @close="addCateDialog">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                        v-model="selectKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChange"
                        clearable change-on-select>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCateData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getCateDate, addCate} from "../../api/cate";

    export default {
        name: "Cate.vue",
        data() {
            return {
                //分类列表数据
                cateList: [],
                //请求数据参数
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                total: 0,
                type: '',
                test: '',
                //tree-table对应的属性
                columns:[{
                    label: '分类名称',
                    prop: 'cat_name',
                    },
                    {
                        label: '是否有效',
                        type: 'template',
                        template: 'isOk'
                    },
                    {
                        label: '等级',
                        type: 'template',
                        template: 'order'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'operate'
                    }],
                addCateDialogVisible: false,
                addCateForm: {
                    cat_name: '',
                    //父级的id
                    cat_id: 0,
                    //当前分类的等级，默认0，0,1，
                    cat_level: 0,
                },
                addCateFormRules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                },
                parentCateList: [], //所有父级类别
                selectKeys: [], //选中的父级的类别id
                //指定选择对象配置
                cascaderProps: {
                    value: 'cat_id',  //选中的是哪一项
                    label: 'cat_name', //选中展示的信息
                    children: 'children', //子组件
                    expandTrigger: 'hover',
                    checkStrictly: true
                }
            }

        },
        created() {
            this.getCateList()
        },
        methods: {
            //获取分类李彪
            getCateList() {
                getCateDate(this.queryInfo).then(res => {
                    // console.log(res)
                    this.cateList = res.data.result
                    this.total = res.data.total
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getCateList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getCateList()
            },
        //    点击添加分类
            addCate() {
                this.getParentCateList()
                this.addCateDialogVisible = true

            },
            //获取父级分类的列表数据
            getParentCateList() {
                getCateDate({type: 2}).then(res => {
                    // console.log(res.data)
                    this.parentCateList = res.data
                })
            },
            // 选择项发生变化，触发这个函数
            parentCateChange() {
                // console.log(this.selectKeys)//选择的父级
                if (this.selectKeys.length>0) {
                    //当前添加分类父级的id
                    this.addCateForm.cat_id = this.selectKeys[this.selectKeys.length-1]
                    //当前添加分类的等级
                    this.addCateForm.cat_level = this.selectKeys.length
                    return
                }else {
                    // 如果没有选择父级，设置为默认值
                    this.addCateForm.cat_id = 0
                    this.addCateForm.cat_level = 0
                }
                // console.log(this.addCateForm)
            },
            //点击确定按钮，添加分类
            addCateData() {
                this.$refs.addCateFormRef.validate(valid => {
                    if (!valid) return
                    addCate(this.addCateForm).then( res => {
                        console.log(res)
                        this.getCateList()
                        this.addCateDialogVisible = false
                    })
                })
            },
            addCateDialog() {
                //清空表单
                this.$refs.addCateFormRef.resetFields()
                //清空层联选择器
                this.selectKeys = []
                this.addCateForm.cat_id = 0
                this.addCateForm.cat_level = 0
            },

        }
    }
</script>

<style scoped>
.add-cate {
    margin-bottom: 15px;
}

</style>