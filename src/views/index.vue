<template>
  <div>
    <div class="main">
      <div class="language-markup">
        <div class="language" @click.stop="chooselangShow=!chooselangShow">
          {{selectId | selectIdMsg}}
          <div class="hov"></div>
          <div v-show="chooselangShow" class="chooselang">
            <div class="item">
              <div class="title">最新常用</div>
              <div class="content">
                <div class="item" v-for="item in langList" :key="item.id" :class="{'item-one':item.id==0||item.id==5}" @click="selectId=item.id">{{item.text}}</div>
                <div class="item"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="markup">
          
        </div>
      </div>
      <div class="inputbox">
        <textarea @keydown.enter.exact.prevent="getYoudao" @input="getYoudao" @keyup.ctrl.enter="lineFeed" v-model="q" placeholder="请输入您要查询的单词..."></textarea>
      </div>
      <div class="ok">
        <button class="but" @click="getYoudao">
          <span>查</span>
          <span>询</span>
          <div class="slipshows">按Ctrl+Enter键换行</div>
        </button>
      </div>
      <div class="footer">
        <div class="dashed">虚线</div>
        <div class="random">
          <div class="left">
            <div class="boxleft">
              {{new Date().getDate()}}
            </div>
            <div class="boxright">
              {{new Date().getMonth() | monthListFilters}}
            </div>
          </div>
          <div class="right">
            <div class="boxtop">
              {{ensentenceData.en}}
            </div>
            <div class="boxbottom">
              {{ensentenceData.zh}}
            </div>
          </div>
        </div>
      </div>
      <div class="advertising">
        广告位
      </div>
    </div>
  </div>
</template>
<script>
import langList from '@/common/langlist'
import monthList from '@/common/month'
import http from '@/api/youdaoapi.js'
import httpTX from '@/api/tianxingapi.js'
export default {
  data(){
    return {
      chooselangShow:false,
      langList:langList,
      selectId:0,
      ensentenceData:{
        en:'正在请求...',
        zh:'正在请求...'
      },
      q: ''
    }
  },
  created() {
    this.getEnsentence()
  },
  methods: {
    lineFeed(){
      this.q+='\n'
    },
    getYoudao(){
      if(!this.q) return
      let d = this.langList.find(e=>{
        return this.selectId===e.id
      })
      let to = d.to
      let from = d.from
      if(!/.*[\u4e00-\u9fa5]+.*$/.test(this.q)){ // 含有中文
        to = d.from
        from = d.to
      }
      let data = {
        q:this.q,
        from,
        to
      }
      http.getYoudao(data)
      .then(res=>{
        if(res.errorCode==0){ // 翻译成功
          console.log(res)
          if(res.basic){

          }
        }
      })
    },
    getEnsentence(){
      httpTX.getEnsentence()
      .then(res=>{
        if(res.code == 200){
          this.ensentenceData = res.newslist[0]
        }
      })
    }
  },
  watch: {
    q: function(newQuestion){
      this.q = newQuestion.trimStart()
    }
  },
  filters: {
    monthListFilters(value){
      let month = value+1
      return monthList.find(e=>{
        return month === e.id
      }).abbreviation
    },
    selectIdMsg(value){
      return langList.find(e=>{
        return value===e.id
      }).text
    }
  },
  computed: {
  },
  mounted() {
    document.addEventListener('click',() =>{
      this.chooselangShow = false
    })
  },
}
</script>
<style lang="less">
.main{
  position: relative;
  margin-top: 30px;
  .language-markup{
    position: absolute;
    top: -45px;
    .language{
      color: @auxiliaryColor;
      cursor: default;
      font-size: 14px;
      display: inline-block;
      position: relative;
      padding-right: 20px;
      .hov{
        width: 10px;
        height: 10px;
        display:inline-block;
        background-color: @auxiliaryColor;
        clip-path: polygon(0 0, 45% 50%, 90% 0);
        position: absolute;
        right: 0;
        top: 8px;
      }
      .chooselang{
        position: absolute;
        width: 400px;
        box-shadow:0px 0px 15px #c9c9c9;
        background-color: white;
        left: -20px;
        top: 27px;
        box-sizing: border-box;
        padding: 20px 0 20px 20px;
        >.item{
          color: @auxiliaryColor;
          font-size: 12px;
          .title{
            padding-bottom: 10px;
            color: @useColor;
            font-size: 11px;
          }
          .content{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            >.item{
              // flex: 0 0 20%;
              width: 19%;
              padding: 5px 0;
              &:hover{
                color: @mianColor;
              }
              &.item-one{
                width: 24%;
              }
            }
          }
        }
      }
      &:hover{
        color: @contentColor;
        .hov{
          background-color: @contentColor;
        }
      }
    }
    // .markup{
      
    // }
  }
  .inputbox{
    margin-top: 30px;
    textarea{
      width: 100%;
      box-sizing: border-box;
      background-color: @backgroundInput;
      border: none;
      height: 120px;
      font-size: 20px;
      padding: 10px;
      color: @auxiliaryColor;
      outline: none;
      resize: none;
      &::placeholder{
        color: rgb(100, 100, 100);
      }
    }
  }
  .ok{
    display: flex;
    justify-content: flex-end;
    padding:25px 10px;
    .but{
      border: none;
      background-color: @mianColor;
      color: white;
      width: 80px;
      outline: none;
      display: flex;
      justify-content: space-around;
      padding: 5px 17px;
      border-radius: 3px;
      position: relative;
      &:hover{
        background: #f53a3acc;
        .slipshows{
          display:block;
        }
      }
      >div{
        display: none;
      }
      .slipshows{
        position: absolute;
        background-color: rgb(86, 86, 86);
        width: 150px;
        top: 37px;
        padding: 10px 0;
        border-radius: 5px;
        &::after{
          content: '';
          width: 12px;
          height: 12px;
          background-color: rgb(86, 86, 86);
          display: block;
          font-size: 0;
          position: absolute;
          top: -12px;
          left: calc((100% - 12px)/2);
          clip-path: polygon(50% 50%, 0 100%, 100% 100%);
        }
      }
    }
  }
  .footer{
    .dashed{
      font-size: 0;
      height: 1px;
      border-top: 1px dashed #d8d8d8;
      margin-top: 30px;
    }
    .random{
      display: flex;
      height: 60px;
      padding-top: 100px;
      .left{
        display: flex;
        align-items: baseline;
        width: 100px;
        justify-content: space-between;
        padding-right: 20px;
        padding-left: 15px;
        border-right: 1px solid #d8d8d8;
        .boxleft{
          font-size: 60px;
        }
        .boxright{
          font-size: 24px;

        }
      }
      .right{
        padding: 3px 0 3px 20px;
        color: @auxiliaryColor;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
  .advertising{
    margin-top: 30px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: @auxiliaryColor;
    cursor: default;
    &:hover{
      background-color: @backgroundInput;
    }
  }
}
</style>
