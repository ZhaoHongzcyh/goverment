// pages/itemBack/itemback.js
const app = getApp();
const api = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    baseinfo: null,
    subject:null,
    isLoad: false,
    loadtxt:"loading..."
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  onShow: function () {
    this.getItemBack(this.data.id);
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

  // 获取题库信息
  getItemBack: function (id) {
    let address = app.ip + "evaluation/find/" + id;
    let body = {
      id: id
    }
    api.request({}, body, "POST", address, "json", false).then(res => {
      console.log("题库信息");
      console.log(res);
      if (res.data.code == 200 && res.data.result) {
        this.setData({
          baseinfo: res.data.data.info,
          subject: res.data.data.subjectBoList
        })
      }
      else {
        console.log("数据加载异常")
      }
    }).then(e => {
      console.log("数据加载异常");
    })
  },

  // 开始测评入口
  startEva: function (e ){
    wx.navigateTo({
      url: '/pages/itemBack/itemback?id=' + this.data.id
    })
  }
})