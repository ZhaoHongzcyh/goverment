// pages/itemBack/itemback.js
const app = getApp();
const api = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    baseinfo:null,
    subject:null, //题库
    answering:null,
    optionsList:[],
    ordernum: 0 //当前处于第几题
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  onShow: function () {
    this.getItemBack( this.data.id );
  },
 
  onShareAppMessage: function () {

  },

  // 获取题库信息
  getItemBack: function (id) {
    let address = app.ip + "evaluation/find/" + id;
    let body = {
      id: id
    }
    api.request({}, body, "POST", address, "json", false).then( res => {
      console.log("题库信息");
      console.log(res);
      if( res.data.code == 200 && res.data.result){
        let subject = res.data.data.subjectBoList
        subject.map( (item,index) => {
          item.optionList.map( (single,num) =>{
            single.checked = false;
          } )
        })
        this.setData({
          baseinfo: res.data.data.info,
          subject: subject
        });
        this.handleAnswing(0, subject);
      }
      else{
        console.log("数据加载异常")
      }
    } ).then( e => {
      console.log("数据加载异常");
    } )
  },

  // 处理答题信息
  // ordernum:当前位于第几题
  // subject:储存了所有题目的题库
  handleAnswing: function (ordernum, subject ){
    let answering = subject[ordernum].info;///题目的基础信息
    let optionsList = subject[ordernum].optionList //题目的选项（填空题为空数组）
    // optionsList.map( (item,index) => {
    //   if(item)
    // } )
    this.setData({ answering, optionsList, ordernum });
  },

  // 上一题
  upOrderNum: function () {
    let ordernum = this.data.ordernum;
    let subject = this.data.subject;
    this.handleAnswing( ordernum - 1, subject);
  },

  // 下一题
  downOrderNum: function () {
    let ordernum = this.data.ordernum;
    let subject = this.data.subject;
    this.handleAnswing(ordernum + 1, subject);
  },

  // 储存用户选择的答案
  storage: function (e) {
    console.log(e);
    let optionsid = e.detail.optionsid;
    let subjectid = e.detail.subjectid;
    let content = e.detail.content;
    this.submitAnswer(optionsid, subjectid, content);
  },

  // 提交答案
  submitAnswer: function (optionId, subjectid, content) {
    let address = app.ip + "evaluation/joinEvaluation";
    let info = {
      evaluationId: this.data.id,
      openId: app.openid,
    };
    let detailList = [{
      // MemberEvaluationDetail:{
        memberEvaluationId: this.data.id,
        subjectId: subjectid,
      optionId: optionId,
        content: content
      // }
    }];
    let body = {info,detailList};
    api.request({}, body, "POST", address, "json", false).then(res=>{
      console.log("提交答案");
      console.log(res);
    })
  }
})