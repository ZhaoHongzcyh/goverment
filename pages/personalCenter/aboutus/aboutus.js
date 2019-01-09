// pages/aboutus/aboutus.js
const app = getApp();
const api = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadtxt:"loading...",
    isLoad: false,//模态框
    baseInfo:null //店铺基础信息
  },

  onLoad: function (options) {

  },

  onShow: function () {
    this.getShopInfo()
  },

  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "关于我们",
      path: "/pages/personalCenter/aboutus/aboutus",
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

  // 获取店铺详细信息
  getShopInfo: function () {
    this.showLoad();
    let address = app.ip + "shop/app/find/" + app.appid;
    let body = {
      appId: app.appid
    };
    api.request({}, body, "POST", address, "json", false).then(res => {
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        this.hideLoad();
        let baseInfo = res.data.data.baseInfo;
        this.setData({
          baseInfo
        })
      }
      else{
        this.layOutTxt("加载失败");
      }
    }).catch(e => {
      this.layOutTxt("加载失败");
    })
  }
})