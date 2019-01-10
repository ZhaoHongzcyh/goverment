//index.js
//获取应用实例
const app = getApp()
const api = require("../../utils/util.js");

Page({
  data: {
    requestNum:0,
    maxRequestNum: 30,//防止重复发起大量请求
    isGetPower:false,
    isOpenEvaluation:false,//是否打开测评
    isOpenReply:false,//是否打开意见反馈
    power:null,
    baseInfo:null,
    menu:[],//文章分类
    userInfo: {},
    AdvertisementImgUrls: [],
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
    this.setData({
      requestNum: 0
    })
    this.searchFunctionSwitch(7);//查询测评功能开关
    this.searchFunctionSwitch(8);//查询意见反馈功能开关
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

  // 判断是否超过最大请求限制
  checkIsOverRequestNum: function () {
    let requestNum = this.data.requestNum;
    if (requestNum >= this.data.maxRequestNum) {
      this.setData({
        isRepeatReq: true,
        requestNum:0
      });
      return false;
    }
    else {
      this.setData({
        requestNum: requestNum + 1
      });
      return true;
    }
  },

  // 查询测评功能开关
  searchFunctionSwitch: function (state) {
    let address = app.ip + "function/findByType";
    let body = {
      appId: app.appid,
      type:state
    };
    api.request({}, body, "POST", address, "application", false).then( res => {
      console.log("功能开关");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let data = res.data.data;
        let status = data.status;
        switch(state){
          case 7:
            this.setData({ isOpenEvaluation: status});
            break;
          case 8:
            this.setData({ isOpenReply: status});
            break;
        }
      }
      else{

      }
    } )
  },

  // 获取首页文章
  getArticle: function () {
    this.showLoad();
    let address = app.ip + "shop/article/findPageList4App/" + app.appid;
    let body = {
      appId:app.appid,
      pageIndex:0,
      pageSize:10
    }
    if (!this.checkIsOverRequestNum){
      return false;
    }
    api.request( {}, body, "POST", address, "json", false).then(res=>{
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
        this.getArticle();
        // 弹框提示，文章加载失败
        this.setData({
          isRepeatReq: true
        })
        this.layOutTxt("文章加载失败");
      }
    }).catch(e=>{
      this.setData({
        isRepeatReq: true
      })
      this.layOutTxt("文章加载失败");
    })
  },

  // 查询文章分类
  searchArticleType: function () {
    this.showLoad();
    if (!this.checkIsOverRequestNum) {
      return false;
    }
    let address = app.ip + "shop/introType/findPageList4App/" + app.appid, body = {appId: app.appid};
    api.request( {}, body, "POST", address, "json", false ).then( res=>{
      if(res.data.code == 200 && res.data.result){
        this.hideLoad();
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
        this.searchArticleType();
        this.layOutTxt("分类加载失败");
      }
    } )
  },

  toArticleClass: function (e) {
    e = e.detail.load;
    let info = e.currentTarget.dataset.title;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleClass/articleclass?info=' + info + "&id=" + id,
    })
  },

  readArticle: function (e) {
    wx.navigateTo({
      url: '/pages/articledetail/articledetail?articleid=' + e.currentTarget.dataset.id,
    })
  },
  
  readArticleByClickImg: function (e) {
    e = e.detail.load;
    this.readArticle(e);
  },

  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "新闻动态",
      path: "/pages/index/index",
      success: (r) => {
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
        this.sendSecret(res);
      },
      fail: (e) => {
        this.layOutTxt("信息获取失败");
      }
    })
  },

  sendSecret: function (res) {
    console.log(res);
    let address = app.ip + "member/info/updateByWeiXin";
    let body = {
      openId: app.openid,
      encryptedData: res.encryptedData,
      iv: res.iv,
      appId: app.appid,
      appInfoType: 1
    };
    api.request({}, body, "POST", address, "application", false).then(res => {
      if (res.data.code == 200 && res.data.result) {
        this.setData({
          isGetPower: true
        })
      }
      else{
        this.setData({
          isGetPower: false
        })
      }
    })
  }
})
