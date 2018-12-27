// pages/makeSmallProgram/makesmallprogram.js
const app = getApp();
const api = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: null,
    phone: null,
    reply: null,
    loadtxt: "loading",
    isLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  // 得到用户姓名
  getUserName: function (e) {
    let username = api.strFormat( e.detail.value );
    this.setData({ username })
  },

  // 得到用户联系方式
  getUserPhone: function (e) {
    let phone = api.strFormat( e.detail.value );
    this.setData({ phone })
  },

  // 得到用户输入的留言
  getUserReply: function (e) {
    let reply = api.strFormat( e.detail.value );
    this.setData({ reply })
  },

  // 检查用户输入的信息是否合法
  checkUserInfo: function () {
    let msg = null;
    let username = api.strFormat( this.data.username );
    let phone = api.strFormat( this.data.phone );
    let reply = api.strFormat( this.data.reply );
    if( username == "" ){
      msg = '姓名为空';
    }
    else if( phone == "" ){
      msg = "电话为空";
    }
    else if( reply == "" ){
      msg = "留言为空";
    }
    else{
      return null;
    }
    return msg;
  },

  // 清空所有信息
  clearUserInfo: function () {
    this.setData({
      username: null,
      phone: null,
      reply: null
    })
  },

  // 提交定制信息
  submitInfo: function () {
    this.showModelTxt("提交中")
    let msg = this.checkUserInfo();
    if( msg != null ){
      this.layOutTxt(msg);
    }
    else{
      let address = app.ip + "poster/form/addForm";
      let body = {
        appId: app.appid,
        name: this.data.username,
        phone: this.data.phone,
        summary: this.data.reply
      };
      api.request({}, body, "POST", address, "application", false).then( res => {
        console.log(res);
        if(res.data.code == 200 && res.data.result){
          this.layOutTxt("提交成功");
          this.clearUserInfo();
        }
        else{
          this.layOutTxt("提交失败");
        }
      } ).catch( e => {
        this.layOutTxt("提交失败");
      } )
    }
  },

  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "定制小程序",
      path: "/pages/personalCenter/makerSmallProgram/makesmallprogram",
      success: (r) => {
        console.log("转发成功");
        console.log(r);
        api.forwardStatic(app)
      }
    };
    return foreardObj;
  }
})