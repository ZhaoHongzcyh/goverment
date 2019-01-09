// pages/itemBack/itemback.js
const app = getApp();
const api = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,
    loadtxt: "loading...",
    id: null,
    baseinfo:null,
    subject:null, //题库
    answering:null,
    optionsList:[],
    isNeedFillSingle: false,
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

  // 隐藏加载模态框
  hideLoad: function () {
    this.setData({
      isLoad: false,
      loadtxt: "loading"
    })
  },

  // 加载结果提醒
  layOutTxt: function (txt) {
    this.setData({
      loadtxt: txt
    })
    setTimeout(() => {
      this.hideLoad();
    }, 3000)
  },

  // 显示加载模态框
  showLoad: function () {
    this.setData({
      isLoad: true,
      loadtxt: "loading"
    })
  },

  // 显示提示信息
  showModelTxt: function (txt) {
    this.setData({
      loadtxt: txt,
      isLoad: true
    })
  },

  // 单选必填未填写的时候，提醒信息
  alertModel: function () {
    let isNeedFillSingle = this.data.isNeedFillSingle;
    if (isNeedFillSingle){
      wx.showToast({
        title: '请填写完整内容',
        icon:"none"
      });
      return false;
    }
    else{
      return true;
    }
  },

  // 获取题库信息
  getItemBack: function (id) {
    this.showLoad();
    let address = app.ip + "evaluation/find/" + id;
    let body = {
      id: id
    }
    api.request({}, body, "POST", address, "json", false).then( res => {
      console.log("题库信息");
      console.log(res);
      if( res.data.code == 200 && res.data.result){
        this.hideLoad();
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
        this.layOutTxt("试题加载失败");
      }
    } ).then( e => {
      this.layOutTxt("试题加载失败");
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
    if(!this.alertModel()){
      return false;
    }
    let ordernum = this.data.ordernum;
    let subject = this.data.subject;
    this.handleAnswing( ordernum - 1, subject);
  },

  // 下一题
  downOrderNum: function () {
    if (!this.alertModel()) {
      return false;
    }
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
        if(item.subjectId == answering.id){
          optionsList.map( (option, num) => {
            hasChoosed.push(item.optionId);
            if(option.id == item.optionId){
              option.checked = true;
              option.txt = item.content;
            }
            else{
              option.checked = false;
              option.txt = null;
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
      let txt = [];
      multipAnswer.map( (item,index) => {
        if (item.subjectId == answering.id){
          answer.push(item.optionId);
          txt.push(item.content);
        }
      } )
      optionsList.map( (item, num) =>{
        multipAnswer.map( (mul, order) => {
          if (mul.optionId == item.id){
            item.txt = mul.content;
            console.log("等于")
          }
          else{
            // console.log(mul.id,item.id);
          }
        } )
        if (answer.includes(item.id)){
          let order = answer.indexOf(item.id);
          item.checked = true;
        }
        else{
          item.checked = false;
          item.txt = null;
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
    console.log("storage");
    console.log(e);
    let optionId = e.detail.optionsId;
    let subjectid = e.detail.subjectid;
    let content = e.detail.content;
    let answer = this.data.answer;
    let choosetype = e.currentTarget.dataset.type;
    // return false;
    //choosetype 1：单选题 2：多选题 3：填空题
    if( choosetype == 2) {
      let mustfill = e.detail.mustfill;
      if(mustfill.mustfill == 1){
        this.setData({ isNeedFillSingle: true});
        return false;
      }
      else{
        this.setData({ isNeedFillSingle: false });
      }
      this.checkMultipAnswer(subjectid, optionId, content);
    }
    else if( choosetype == 1 ){
      optionId.map((item, num) => {
        let detailList = {
            // memberEvaluationId: this.data.id,
          subjectId: subjectid,
          optionId: item,
          content: content.value
        };
        if(content.mustfill == 1 && content.value == null || content.value == ""){
          this.setData({ isNeedFillSingle: true })
        }
        else{
          this.setData({ isNeedFillSingle: false })
        }
        this.checkSingleAnswer(detailList, content);
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
  checkSingleAnswer: function (detailList, content) {
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
  checkMultipAnswer: function ( subjectId, optionsId, content ){
    // console.log(optionsId);
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
      console.log(content);
      console.log(optionsId);
      content.map( (sub, num) => {
        if(sub.id == item){
          detailList.content = sub.content;
        }
      } )
      console.log(detailList);
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
    if(!this.alertModel()){
      return false;
    }
    this.showModelTxt("正在提交");
    api.request({}, body, "POST", address, "json", false).then(res=>{
      console.log("提交答案");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        this.layOutTxt("提交成功");
        setTimeout( ()=>{
          wx.navigateBack({
            delta: 2
          })
        },2000 );
      }
      else{
        this.layOutTxt("提交失败");
      }
    }).catch(e => {
      this.layOutTxt("提交失败");
    })
  }
})