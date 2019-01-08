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
    ordernum: 0, //当前处于第几题
    txtValue:null,//填空题用户已经填写的答案
    singleAnswer:[], //用户单选答案库
    multipAnswer:[],// 用户多选答案库
    textContent:[]//用户填空题答案
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
    this.storageAnswerState(answering, optionsList)
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

  // 保留用户选择的答案状态
  storageAnswerState: function (answering, optionsList) {
    console.log("执行")
    let hasChoosed = [];
    if(answering.type == 1){
      // 单选题
      let singleAnswer = this.data.singleAnswer;
      singleAnswer.map( (item,index) => {
        if(item.subjectId == answering.subjectId){
          optionsList.map( (option, num) => {
            hasChoosed.push(item.optionsId);
            if(option.id == item.optionsId){
              option.checked = true;
            }
            else{
              option.checked = false;
            }
          } )
        }
      } );
      this.setData({ optionsList });
    }
    else if (answering.type == 2){
      // 多选题
      let multipAnswer = this.data.multipAnswer;
      let answer = [];
      multipAnswer.map( (item,index) => {
        if (item.subjectId == answering.id){
          answer.push(item.optionId);
        }
      } )
      optionsList.map( (item, num) =>{
        if(answer.includes(item.id)){
          item.checked = true;
        }
        else{
          item.checked = false;
        }
      } )
      this.setData({ optionsList })
    }
    else if (answering.type == 3){
      // 填空题
      let textContent = this.data.textContent;
      let txtValue = null;
      textContent.map( (item, num) => {
        if (item.subjectId == answering.id){
          txtValue = item.content;
        }
      } )
      this.setData({ optionsList, txtValue })
    }
    
  },

  // 储存用户选择的答案
  storage: function (e, ordernum) {
    let optionId = e.detail.optionsId;
    let subjectid = e.detail.subjectid;
    let content = e.detail.content;
    let answer = this.data.answer;
    let choosetype = e.currentTarget.dataset.type;
    // return false;
    //choosetype 1：单选题 2：多选题 3：填空题
    if( choosetype == 2) {
        this.checkMultipAnswer(subjectid, optionId);
    }
    else if( choosetype == 1 ){
      optionId.map((item, num) => {
        let detailList = {
            // memberEvaluationId: this.data.id,
          subjectId: subjectid,
          optionId: item,
          content: content
        };
        this.checkSingleAnswer(detailList);
      })
    }
    else if(choosetype == 3){
      let detailList = {
        subjectId: subjectid,
        content: content
      }
      this.checkTextContent(detailList);
    }
    
  },

  // 检查用户储存的单选答案是否存在相同的数据
  checkSingleAnswer: function (detailList) {
    let singleAnswer = this.data.singleAnswer;
    if (singleAnswer.length == 0){
      singleAnswer.push(detailList);
    }
    else{
      let check = false;
      let delnum = 0;
      singleAnswer.map( (item,index) => {
        if (item.subjectId == detailList.subjectId){
          check = true;
          delnum = index;
        }
      } )
      if(check){
        singleAnswer.splice(delnum,1);
      }
      singleAnswer.push(detailList);
    }
    this.setData({ singleAnswer });
  },

  // 处理用户提交的多选答案
  checkMultipAnswer: function ( subjectId, optionsId ){
    console.log(optionsId);
    let multipAnswer = this.data.multipAnswer;
    let multip = [];
    multipAnswer.map( (item,index) => {
      if(item.subjectId != subjectId){
        multip.push(item);
      }
    } );
    // console.log(optionsId);
    optionsId.map((item, index) => {
      let detailList = {
        subjectId: subjectId,
        optionId: item,
        content: null
      };
      multip.push(detailList);
    })
    this.setData({ multipAnswer: multip });
  },

  // 处理填空题数据
  checkTextContent: function ( detailList ) {
    let textContent = this.data.textContent;
    let check = false;
    let delnum = 0;
    textContent.map( (item, index) => {
      if(item.subjectId == detailList.subjectId){
        check = true;
        delnum = index;
      }
    } )
    if(check){
      textContent.splice(delnum,1);
    }
    textContent.push(detailList);
    this.setData({textContent});
  },

  // 提交答案
  submitAnswer: function () {
    let singleAnswer = this.data.singleAnswer;
    let multipAnswer = this.data.multipAnswer;
    let textContent = this.data.textContent;
    let detailList = [];
    detailList = detailList.concat(singleAnswer, multipAnswer, textContent);
    console.log("提交答案")
    let address = app.ip + "evaluation/joinEvaluation";
    let info = {
      evaluationId: this.data.id,
      openId: app.openid,
    };
    let body = {info,detailList};
    api.request({}, body, "POST", address, "json", false).then(res=>{
      console.log("提交答案");
      console.log(res);
    })
  }
})