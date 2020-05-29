<template>
  <!--编辑角色-->
  <el-dialog
      title="物流动态"
      :visible.sync="isShow"
      width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in expressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
  </el-dialog>
</template>

<script>
import {queryExpressByID} from '@/api/order'

  export default {
    name: "ExpressDialog",
    data() {
      return {
        expressInfo: {}
      }
    },
    props: ['title', 'visible'],
    computed: {
      isShow: {
        set(v) {
          this.$emit('update:visible', v)

          // this.$emit('refresh-list', value)
        },
        get() {
          return this.visible
        }
      }
    },
    created() {
      this.getExpress()
    },
    methods: {
      save() {
        this.isShow = false
      },
      getExpress() {
        queryExpressByID(1106975712662).then(res => {
          this.expressInfo = res.data
          console.log(this.express);
          
        })
      }
    }
  }
</script>

<style scoped>

</style>