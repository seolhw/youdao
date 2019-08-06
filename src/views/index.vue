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
        <textarea :class="{'basicinput':status===1,'sentenceinput':status===2}" @keydown.enter.exact.prevent="getYoudao" @keyup.ctrl.enter="lineFeed" v-model="q" placeholder="请输入您要查询的单词或句子..."></textarea>
        <button class="but" :class="{'basicbut':status===1}" @click="getYoudao">
          <span>查</span>
          <span>询</span>
          <div class="slipshows">按Ctrl+Enter键换行</div>
        </button>
      </div>
      <div class="basic" v-show="status===1">
        <div class="top">
          <div class="title">{{basic.query}}</div>
          <div class="collect" title="加入收藏" @click="addCollect(basic.query,translation[0])" :class="{'startcss':collectShow}"></div>
        </div>
        <div class="pronounce">
          <div class="uk">
            <div class="phonetic">
              <span class="state">英</span>
              <span>{{basic['uk-phonetic']? `/${basic['uk-phonetic']}/` : ''}}</span>
            </div>
            <div class="speech" @mousemove="phonate('uk')">
              <audio ref="ukspeech" class="audiocss" preload :src="basic['uk-speech']"></audio>
            </div>
          </div>
          <div class="uk us">
            <div class="phonetic">
              <span class="state">美</span>
              <span>{{basic['us-phonetic']? `/${basic['us-phonetic']}/` : ''}}</span>
            </div>
            <div class="speech" @mousemove="phonate('us')">
              <audio ref="usspeech" class="audiocss" preload :src="basic['us-speech']"></audio>
            </div>
          </div>
        </div>
        <div class="translate">
          {{translation[0]}}
        </div>
        <div class="variable">
          <div class="item"></div>
        </div>
        <div class="explains">
          <div class="title">基本释意</div>
          <div class="item" v-for="item in basic.explains" :key="item">
            {{item}}
          </div>
        </div>
      </div>
      <div class="sentence" v-show="status===2">
        {{translation[0]}}
      </div>
      <div class="footer" v-show="status===0">
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
      <div class="advertising" v-show="status===0">
        <div>翻译来自网易有道API，感谢<a href="https://ai.youdao.com/" target="_blank">有道智云</a></div>
      </div>
    </div>
  </div>
</template>
<script>
import langList from '@/common/langlist'
import monthList from '@/common/month'
import http from '@/api/youdaoapi.js'
import httpTX from '@/api/tianxingapi.js'
import { UUID } from '@/common/common'
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
      q: '',
      status: 0, // 0为未查询状态，1为查询单词，2为翻译句子
      translation: [], // 翻译结果
      speak:'', // 翻译接口发音
      basic:{},
      collectList:[], // 收藏列表
    }
  },
  created() {
    this.getEnsentence()
    if(this.$route.query.query){
      this.q=this.$route.query.query
      this.getYoudao()
    }
    let collectList = this.$localStorage.get('collect')
    if(!collectList){
      collectList=[]
    }else{
      collectList = JSON.parse(collectList)
    }
    this.collectList = collectList
  },
  methods: {
    phonate(n){
      this.$refs[n+'speech'].play()
    },
    addCollect(query,translation){
      if(this.collectShow){ // 已加入收藏
        let index = this.collectList.findIndex(e=>{
          return e.query == this.basic.query
        })
        this.collectList.splice(index,1)
      }else{
        this.collectList.unshift({
          id: UUID(),
          query,
          translation,
          time:new Date().getTime()
        })
      }
      this.$localStorage.set('collect',JSON.stringify(this.collectList))
    },
    lineFeed(){
      this.q+='\n'
    },
    setLocalStorage(query,translation){
      let logList = this.$localStorage.get('log')
      if(!logList){
        logList = []
      }else{
        logList = JSON.parse(logList)
      }
      logList.unshift({
        id: UUID(),
        query,
        translation,
        time:new Date().getTime()
      })
      this.$localStorage.set('log',JSON.stringify(logList))
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
        console.log(res)
        if(res.errorCode==0){ // 翻译成功
          this.setLocalStorage(res.query,res.translation[0])
          this.translation = res.translation
          this.basic=res.basic||{}
          if(res.basic){ // 查询的是单词
            this.status=1
            this.basic.query = res.query
            this.basic.us
          }else{ // 查询的是句子
            this.status=2
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
      if(this.q === ''){
        this.status=0
      }
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
    collectShow(){
      return Boolean(this.collectList.find(e=>{
        return e.query == this.basic.query
      }))
    }
  },
  mounted() {
    document.addEventListener('click',() =>{
      this.chooselangShow = false
    })
  },
}
</script>
<style lang="less" scoped>
.main{
  -webkit-app-region: no-drag;
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
        z-index: 100;
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
  }
  .inputbox{
    margin-top: 30px;
    position: relative;
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
      padding-bottom: 40px;
      &::placeholder{
        color: rgb(100, 100, 100);
      }
      &.basicinput{
        height: 46px;
        padding-bottom: 10px;
        padding-right: 100px;
        overflow: hidden;
      }
      &.sentenceinput{
        height: 180px;
      }
    }
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
      position: absolute;
      right: 10px;
      bottom: 10px;
      // &.basicbut{
      //   top: -62px;
      // }
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
  .sentence{
    margin-top: 20px;
    background-color: @backgroundInput;
    height: 310px;
    padding: 10px;
    font-size: 20px;
    color: @auxiliaryColor;
    box-sizing: border-box;
  }
  .basic{
    height: 310px;
    padding: 10px;
    box-sizing: border-box;
    .top{
      display: flex;
      align-items: center;
      padding-top: 20px;
      >.title{
        font-size: 25px;
        font-weight: bold;
        color: @contentColor;
        padding-right: 30px;
      }
      >.collect{
        cursor: pointer;
        width: 20px;
        height: 20px;
        background-image: url('../assets/start1.png');
        background-size: 100%;
        &.startcss{
          background-image: url('../assets/start.png');
        }
      }
    }
    .pronounce{
      display: flex;
      align-items: center;
      padding-top: 20px;
      .uk{
        display: flex;
        align-items: center;
        .phonetic{
          color: @auxiliaryColor;
          padding-right: 15px;
          font-size: 16px;
          >span{
            font-size: 16px;
          }
          .state{
            padding-right: 10px;
          }
        }
        .speech{
          cursor: pointer;
          width: 20px;
          height: 20px;
          background-image: url('../assets/sy1.png');
          background-size: 100%;
          &:hover{
            background-image: url('../assets/sy.png');
          }
          .audiocss{
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
      }
      .us{
        padding-left: 40px;
      }
    }
    .translate{
      background-color: @backgroundInput;
      padding: 10px;
      font-size: 20px;
      color: @auxiliaryColor;
      box-sizing: border-box;
      margin-top: 20px;
    }
    .explains{
      padding-top: 20px;
      max-height: 200px;
      overflow-y: auto;
      .title{
        font-size: 16px;
        color: @contentColor;
        border-bottom: 2px solid @darkColor;
        margin-bottom: 10px;
      }
      .item{
        color: @contentColor;
        padding: 3px 0;
      }
    }
  }
  .footer{
    .dashed{
      font-size: 0;
      height: 1px;
      border-top: 1px dashed #d8d8d8;
      margin-top: 110px;
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
        .boxtop{
          color: @contentColor;
        }
      }
    }
  }
  .advertising{
    margin-top: 30px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 30px;
    color: @auxiliaryColor;
    cursor: default;
    font-size: 14px;
    a{
      color: @auxiliaryColor;
      &:hover{
        color: @mianColor;
      }
    }
    &:hover{
      background-color: @backgroundInput;
    }
  }
}
</style>
