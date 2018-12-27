// pages/evaluation/evaluation.js
const app = getApp();
const api = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluatList:null,//测评列表
    isRepeatReq: true,//测评为空时的提示
    isLoad: false, //模态框
    loadtxt: "loading" //模态框
  },

  onLoad: function (options) {
    this.getEvaluationList();
  },

  onShow: function () {

  },

  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "我要测评",
      path: "/pages/evaluation/evaluation",
      success: (r) => {
        console.log("转发成功");
        console.log(r);
        api.forwardStatic(app)
      }
    };
    return foreardObj;
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
      isLoad: true,
      loadtxt: txt
    })
    setTimeout(() => {
      this.hideLoad();
    }, 2000)
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

  // 获取测评列表
  getEvaluationList: function () {
    this.showLoad();
    let address = app.ip + "evaluation/findPage";
    let body = {
      appId: app.appid,
      status: 1
    };

    api.request({}, body, "POST", address, "json", false).then( res => {
      if(res.data.code == 200 && res.data.result){
        console.log(res);
        this.hideLoad();
      }
      else{
        this.layOutTxt("加载失败");
      }
    } ).catch( e => {
      this.layOutTxt("加载失败");
    } )
  },

  // 处理请求的测评列表数据
  handleEvaluatData: function ( data ) {
    if( data.length == 0 ){
      this.setData({ isRepeatReq: true } )
    }
    else{
      this.setData({ isRepeatReq: false } );
      if( data.length == 1 ){
        // wx.navigateTo({
        //   url: '',
        // })
      }
      else{
        // this.setData({})
      }
    }
  }
})