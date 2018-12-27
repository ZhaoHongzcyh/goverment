//index.js
//获取应用实例
const app = getApp()
const api = require("../../utils/util.js");

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    AdvertisementImgUrls: ['/Component/articleList/img/articleCover.png', '/Component/articleList/img/articleCover.png'],
    hasUserInfo: false,
    article:[],
    isRepeatReq: false,
    isLoad: true,//是否正在加载中
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    this.searchArticleType();
  },

  onShow: function () {
    this.getArticle();
  },

  // 隐藏加载模态框
  hideLoad: function() {
    this.setData({
      isLoad: false
    })
  },

  // 显示加载模态框
  showLoad: function (){
    this.setData({
      isLoad: true
    })
  },

  // 获取首页文章
  getArticle: function () {
    this.showLoad();
    let address = app.ip + "shop/article/findPageList4App/" + app.appid;
    console.log(address);
    let body = {
      appId:app.appid,
      pageIndex:0,
      pageSize:10
    }
    api.request( {}, body, "POST", address, "json", false).then(res=>{
      console.log("文章");
      
      console.log(res);
      this.hideLoad();
      if(res.data.code == 200 && res.data.result){
        let article = [];
        let AdvertisementImgUrls = [];//轮播图
        let data = res.data.data.list;
        data.map((item,index)=>{
          item.summary.datetime = item.summary.createDate.split('T')[0];
          if(index < 5){
            AdvertisementImgUrls.push(item.summary.imgUrl)
          }
        })
        this.setData({
          isRepeatReq: false,
          article:data,
          AdvertisementImgUrls: AdvertisementImgUrls
        })
      }
      else{
        // 弹框提示，文章加载失败
        this.setData({
          isRepeatReq: true
        })
        console.log("文章加载失败");
      }
    }).catch(e=>{
      this.hideLoad();
      console.log(e)
    })
  },

  // 查询文章分类
  searchArticleType: function () {
    let address = app.ip + "shop/introType/findPageList4App/" + app.appid, body = {appId: app.appid};
    api.request( {}, body, "POST", address, "json", false ).then( res=>{
      console.log("文章分类");
      console.log(res);
    } )
  },

  toArticleClass: function (e) {
    console.log(e);
    e = e.detail.load;
    let info = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/articleClass/articleclass?info=' + info,
    })
  },

  readArticle: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/articledetail/articledetail?articleid=' + e.currentTarget.dataset.id,
    })
  },
  
  getimg: function (e) {
    console.log(e);
  },

  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "新闻动态",
      path: "/pages/index/index",
      success: (r) => {
        console.log("转发成功");
        console.log(r);
        api.forwardStatic(app)
      }
    };
    return foreardObj;
  }
})
