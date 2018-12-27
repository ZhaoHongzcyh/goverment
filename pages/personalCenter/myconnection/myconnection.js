// pages/personalCenter/myconnection/myconnection.js
const app = getApp();
const api = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:1,//当前页码
    pageSize: 10,//每一页加载的文章个数
    article:[],//收藏的文章\
    isLoad: false,//模态框
    loadtxt:"loading"//模态框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyCollectArticle();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "我的收藏",
      path: "/pages/personalCenter/myconnection/myconnection",
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
      loadtxt:txt,
      isLoad: true
    })
  },

  // 阅读文章
  readArticle: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/articledetail/articledetail?articleid=' + e.currentTarget.dataset.id,
    })
  },

  // 取消收藏
  cancelCollection: function (e) {
    let articleid = e.currentTarget.dataset.articleid;
    console.log(e);
    this.showModelTxt("取消中");
    let address = app.ip + "shop/article/collect/" + articleid;
    let body = {
      id: this.data.articleid,
      openId: app.openid,
      status: 0
    };
    api.request({}, body, "POST", address, "application",false).then( res => {
      console.log("取消收藏");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        this.hideLoad();
        let article = this.data.article;
        article.map( (item,index) => {
          if(item.summary.id == articleid){
            article.splice(index,1);
          }
        });
        this.setData({article})
      }
      else{
        this.layOutTxt("取消失败");
      }
    }).catch(e=>{
      this.layOutTxt("取消失败");
    })
  },

  // 获取我的收藏
  getMyCollectArticle: function() {
    this.showLoad();
    let address = app.ip + "shop/article/findPageList4Collect/" + app.appid + "/" + app.openid;
    let body = {
      appId: app.appid,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      openId: app.openid
    };

    api.request({}, body, "POST", address, "json", false).then(res => {
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        this.hideLoad();
        let article = [];
        let data = res.data.data.list;
        data.map((item, index) => {
          item.summary.datetime = item.summary.createDate.split('T')[0];
        })
        this.setData({
          article: data
        })
      }
      else{
        this.layOutTxt('加载失败');
      }
    }).catch(e=>{
      this.layOutTxt('加载失败！');
    })
  }
})