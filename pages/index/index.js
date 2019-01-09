//index.js
//获取应用实例
const app = getApp()
const api = require("../../utils/util.js");

Page({
  data: {
    isGetPower:false,
    power:null,
    baseInfo:null,
    menu:[],//文章分类
    userInfo: {},
    AdvertisementImgUrls: ['/Component/articleList/img/articleCover.png', '/Component/articleList/img/articleCover.png'],
    hasUserInfo: false,
    article:[],
    isRepeatReq: false,
    isLoad: true,//是否正在加载中
    loadtxt: "loading...",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    
  },

  onShow: function () {
    this.searchArticleType();
    this.getArticle();
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
      if(res.data.code == 200 && res.data.result){
        this.hideLoad();
        let article = [];
        let AdvertisementImgUrls = [];//轮播图
        let data = res.data.data.list;
        data.map((item,index)=>{
          item.summary.datetime = item.summary.createDate.split('T')[0];
          if(index < 5){
            let singlelist = {
              src: item.summary.imgUrl,
              id: item.summary.id
            }
            AdvertisementImgUrls.push(singlelist)
          }
        })
        this.setData({
          baseInfo: app.baseInfo,
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
        this.layOutTxt("文章加载失败");
      }
    }).catch(e=>{
      this.layOutTxt("文章加载失败");
    })
  },

  // 获取政务基本信息
  

  // 查询文章分类
  searchArticleType: function () {
    this.showLoad();
    let address = app.ip + "shop/introType/findPageList4App/" + app.appid, body = {appId: app.appid};
    api.request( {}, body, "POST", address, "json", false ).then( res=>{
      console.log("文章分类");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let data = res.data.data.list;
        let menu = [];
        data.map( (item, index) => {
          let list = {
            title: item.name,
            src: item.imgUrl,
            id: item.id
          };
          menu.push(list);
        });
        this.setData({menu});
      }
      else{
        this.layOutTxt("分类加载失败");
      }
    } )
  },

  toArticleClass: function (e) {
    console.log(e);
    e = e.detail.load;
    let info = e.currentTarget.dataset.title;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleClass/articleclass?info=' + info + "&id=" + id,
    })
  },

  readArticle: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/articledetail/articledetail?articleid=' + e.currentTarget.dataset.id,
    })
  },
  
  readArticleByClickImg: function (e) {
    console.log(e);
    e = e.detail.load;
    this.readArticle(e);
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
  },

  // 获取用户信息
  getUserInfo: function () {
    wx.getUserInfo({
      withCredentials: true,
      success: (res) => {
        this.setData({
          isGetPower: true,
          power:res
        })
        console.log(res);
        // this.startEva();
        this.sendSecret(res);
        // this.showModelTxt("获取资料中");
      },
      fail: (e) => {

      }
    })
  },

  sendSecret: function (res) {
    let address = app.ip + "member/info/updateByWeiXin";
    let body = {
      openId: app.openid,
      encryptedData: res.encryptedData,
      iv: res.iv,
      appId: app.appid,
      appInfoType: 1
    };
    api.request({}, body, "POST", address, "application", false).then(res => {
      console.log(res);
      if (res.data.code == 200 && res.data.result) {
        // let url = 
        console.log("头像");
        console.log(res);
        if (res.data.code == 200 && res.data.result) {
          let data = res.data.data;
          let imgUrl = data.avatarUrl;
          // this.startEva(imgUrl);
        }
      }
    })
  }
})
