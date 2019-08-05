<template>
  <div>
    <div class="mian">
      <div class="top">
        历史记录
      </div>
      <div class="log">
        <div class="list">
          <div class="item" @click="toTranslate(item.query)" v-for="(item,index) in logList" :key="item.id">
            <div class="query">{{item.query}}</div>
            <div class="translation">{{item.translation}}</div>
            <div class="time">{{item.time | timeMsg}}</div>
            <div class="del">
              <span @click.stop="delItem(index)">删除</span>
            </div>
          </div>
          <dir class="nodata" v-if="logList.length<=0">
            <span class="flanks"></span>
            <span class="content">没有数据</span>
            <span class="flanks"></span>
          </dir>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDateDiff } from '@/common/common'
  export default {
    data(){
      return {
        logList:[]
      }
    },
    created() {
      this.logList = JSON.parse(this.$localStorage.get('log')) || []
    },
    methods: {
      delItem(index){
        this.logList.splice(index,1)
        this.$localStorage.set('log',JSON.stringify(this.logList))
      },
      toTranslate(query){
        this.$router.push({path:'/',query:{query}})
      }
    },
    filters:{
      timeMsg(time){
        return getDateDiff(time)
      }
    },
    mounted() {
      
    },
  }
</script>
<style lang="less">
.mian{
  position: relative;
  .top{
    position: absolute;
    top: -15px;
    color: @contentColor;
    font-size: 14px;
  }
  .log{
    padding-top: 20px;
    .list{
      max-height: 520px;
      overflow-y: auto;
      .item{
        padding: 10px;
        display: flex;
        cursor: default;
        transition: all .5s ease;
        color: @contentColor;
        border-bottom: 1px solid #dcdee2;
        &:hover{
          background-color: #f1e7e6;
          color: @darkColor;
        }
        >div{
          flex:1 0;
        }
        .query,.translation{
          flex: 2;
        }
        .del{
          color: @darkColor;
          cursor: pointer;
          text-align: right;
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
    .nodata{
      color: @auxiliaryColor;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 50px;
      .flanks{
        flex: 1;
        height: 1px;  
        background-color: #dcdee2;
      }
      .content{
        flex: 0 0 auto;
        padding: 0 15px;
      }
    }
  }
}
</style>