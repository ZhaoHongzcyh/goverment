// pages/evaluation/evaluation.js
const app = getApp();
const api = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:null,
    isOpenPhoneModel: true,
    evaluatList:null,//测评列表
    isRepeatReq: true,//测评为空时的提示
    isLoad: false, //模态框
    loadtxt: "loading" //模态框
  },

  onLoad: function (options) {
    // this.getEvaluationList();
    this.isShowPhoneModel();
  },

  onShow: function () {
    // this.checkModelState();
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

  // 关闭弹框
  closePhoneModel: function () {
    this.setData({
      isOpenPhoneModel: false
    })
  },

  // 本地判断是否需要展示获取用电话号码的弹框
  isShowPhoneModel: function () {
    let phone = wx.getStorageSync("phone");
    if(!phone){
      this.checkModelState();
    }
    else{
      this.setData({
        isOpenPhoneModel: false
      });
      this.getEvaluationList();
    }
  },

  // 判断是否需要显示获取用户电话号码的弹框
  checkModelState: function () {
    let address = app.ip + "member/info/findIsMember4App/" + app.openid;
    let body = {
      openId: app.openid,
      appId: app.appid
    };
    api.request({}, body, "POST", address, "application", false).then( res => {
      console.log("判断是否会员");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let data = res.data.data;
        this.setData({
          isOpenPhoneModel: data,
          phone: true
        });
        this.getEvaluationList();//获取测评列表数据
      }
      else{
        this.setData({
          isOpenPhoneModel: true
        })
      }
    } )
  },

  // 获取用户电话
  getPhoneNumber: function (e){
    e = e.detail;
    let address = app.ip + "member/info/becomeMember";
    let body = {
      openId: app.openid,
      appId: app.appid,
      encryptedData: e.encryptedData,
      iv: e.iv
    };
    api.request({}, body, "POST", address, "application", false).then( res => {
      console.log("认证中");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let data = res.data.data;
        this.setData({
          phone: data.phone,
          isOpenPhoneModel: false
        });
        wx.setStorageSync("phone", data.phone);
        this.getEvaluationList();//获取评测列表
      }
      else{
        this.setData({
          isOpenPhoneModel: true
        });
      }
    } )
  },

  // 用户自定义电话号码
  getPhoneByUser: function (e) {

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

    api.request({}, body, "POST", address, "application", false).then( res => {
      if(res.data.code == 200 && res.data.result){
        console.log(res);
        console.log("123")
        this.handleEvaluatData( res.data.data.list );
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
        this.getEvaluationInfo( data[0].id );
      }
      else{
        this.setData({ evaluatList: data})
      }
    }
  },

  // 查询测评详细信息
  searchEvaluationInfo: function ( e ) {
    let id = e.currentTarget.dataset.id;
    this.getEvaluationInfo(id);
  },

  // 查看测评详细信息
  getEvaluationInfo: function ( id ){
    wx.navigateTo({
      url: '/pages/startEvaluat/startevaluat?id=' + id,
    })
  }
})