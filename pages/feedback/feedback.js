// pages/feedback/feedback.js
const app = getApp();
const api = require("../../utils/util.js");

Page({
  data: {
    isSubmitSuccess: false,
    scoredata:[1,0,0,0,0],//1:好评，0：未作评价
    nickname:null,
    phone:null,
    content: null,//意见
    isLoad: false, //模态框
    loadtxt: "loading" //模态框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

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

  // 获取用户姓名
  getUserName: function (e) {
    let nickname = api.strFormat(e.detail.value);
    this.setData({
      nickname: nickname
    })
  },

  // 获取用户联系电话
  getUserPhone: function (e) {
    let phone = api.strFormat(e.detail.value);
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取用户输入的意见
  getUserMsg: function (e) {
    let content = api.strFormat(e.detail.value);
    this.setData({
      content: e.detail.value
    })
  },

  // 检查用户是否已经填写完毕
  checkIInfoIsComplete: function () {
    let nickname = api.strFormat( this.data.nickname );
    let phone = api.strFormat( this.data.phone );
    let content = api.strFormat( this.data.content );
    let msg = null;
    if(content == ""){
      msg = "请输入意见";
    }
    else{
      return null;
    }
    return msg;
  },

  score: function (e) {
    let order = e.currentTarget.dataset.order;
    let score = this.data.scoredata;
    let ary = []
    score.map((item,index)=>{
      if(index <= order){
        ary.push(1);
      }
      else{
        ary.push(0);
      }
    })
    this.setData({ scoredata:ary})
  },

  // 本地校验意见反馈信息是否填写完整
  checkFeedInfo: function () {
    let msg = this.checkIInfoIsComplete();
    if(msg != null){
      wx.showToast({
        title: msg,
        icon:"none"
      });
      return false;
    }
    else{
      this.feedBack();
    }
  },

  // 意见反馈请求
  feedBack: function () {
    this.showModelTxt("反馈中");
    let address = app.ip + "feedback/add";
    let scoredata = this.data.scoredata;
    let level = 0;
    scoredata.map( (item,index) => {
      if(item == 1){
        level++;
      }
    })
    let body = {
      appId: app.appid,
      openId: app.openid,
      nickname: this.data.nickname == null? '' : this.data.nickname,
      phone: this.data.phone == null? '' : this.data.phone,
      level: level,
      content: this.data.content
    };
    
    api.request({}, body, "POST", address, "application", false).then(res => {
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        this.hideLoad();
        this.setData({ isSubmitSuccess: true});
        setTimeout(()=>{
          wx.navigateBack({
            default: 1
          })
        },3000)
      }
      else{
        this.layOutTxt("反馈失败");
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "意见反馈",
      path: "/pages/feedback/feedback",
      success: (r) => {
        console.log("转发成功");
        console.log(r);
        api.forwardStatic(app)
      }
    };
    return foreardObj;
  }
})