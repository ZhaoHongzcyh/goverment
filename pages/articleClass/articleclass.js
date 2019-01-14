// pages/articleClass/articleclass.js
const app = getApp();
const api = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,
    loadtxt:"loading...",//加载提示文字
    articleType:[
      { title: '推荐', select: true },
      { title: '政务公开', select: false },
      { title: '会议要闻', select: false },
      { title: '通知公告', select: false },
      { title: '乡镇动态', select: false },
      { title: '招商引资', select: false }
    ],
    articleTypeId:null,//文章类型id
    articleTypeTitle:null,
    allArticle:[],
    isLoadErr:false,
    current: 0 //当前所在滑块的index
  },

  onLoad: function (options) {
    console.log(options);
    // this.initChooseMenu( options )
    this.searchArticleType(options)
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

  // 查询文章分类
  searchArticleType: function (options) {
    this.showLoad();
    let address = app.ip + "shop/introType/findPageList4App/" + app.appid, body = { appId: app.appid };
    api.request({}, body, "POST", address, "json", false).then(res => {
      if (res.data.code == 200 && res.data.result) {
       
        this.hideLoad();
        let data = res.data.data.list;
        let articleType = [];
        data.map((item, index) => {
          let list = {
            title: item.name,
            src: item.imgUrl,
            id: item.id,
            select: false
          };
          articleType.push(list);
        });
        if(articleType.length != 0){
          this.setData({ articleType });
        }
        this.initChooseMenu(options)
      }
      else{
        this.layOutTxt("文章类型加载失败");
      }
    })
  },

  readArticle: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/articledetail/articledetail?articleid=' + e.currentTarget.dataset.id,
    })
  },

  // 根据articleTypeId查询该类型的所有文章
  searchAllArticle: function () {
    this.showLoad();
    let address = app.ip + "shop/article/findPageList4App/" + app.appid;
    console.log(address);
    let body = {
      appId: app.appid,
      typeId: this.data.articleTypeId
    };
    api.request({}, body, "POST", address, "application", false).then(res => {
      if(res.data.code == 200 && res.data.result){
        this.setData({ isLoadErr: false });
        this.hideLoad();
        let list = res.data.data.list;
        list.map((item, index) => {
          item.summary.datetime = item.summary.createDate.split('T')[0];
        })
        this.setData({
          allArticle: list,
          isLoadErr: list.length == 0? true:false
        })
      }
      else{
        this.setData({ isLoadErr: true });
        this.layOutTxt("文章查询失败");
      }
    })
  },

  // 选择默认加载的内容
  initChooseMenu: function (options) {
    let articleType = this.data.articleType;
    articleType.map( (item,index)=>{
      item.select = item.id == options.id? true : false
      if( item.select ){
        this.initCurrent(index);
        this.setData({
          articleTypeId: options.id,
          articleTypeTitle: options.info
        });
        console.log("这是");
        console.log(options);
      }
    } );
    this.setData({ articleType });
    this.searchAllArticle();
  },

  // 通过index判断滑块的current
  initCurrent: function ( index ) {
    let articleType = this.data.articleType;
    let current = 0;
    if( index > 4){
      console.log("大于4")
      current = Math.ceil( index/5 );
    }

    this.setData({ current })
  },

  onShow: function ( ) {

  },

  // 用户滑动文章分类列表
  changeCurrent: function (e) {
    let current = e.detail.current;
    this.setData({ current });
  },

  // 用户切换文章类型
  switchArticleType: function (e) {
    let current = e.currentTarget.dataset.current;
    let index =e.currentTarget.dataset.index;
    console.log(e)
    let articleType = this.data.articleType;
    articleType.map( (item,num) => {
      item.select = false;
      if(index == num){
        item.select = true;
        this.setData({ articleTypeId: item.id });
      }
    } );
    this.setData({ articleType, current});
    this.searchAllArticle();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let articleType = this.data.articleType;
    let title = null;
    articleType.map( (item,index) => {
      if(item.select){
        title = item.title
      }
    } )
    let foreardObj = {
      title: title,
      path: "/pages/articleClass/articleclass?info=" + this.data.articleid
    };
    return foreardObj;
  }
})