// pages/connectUs/connectus.js
const app = getApp();
const api = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '暂未填写',
    mail: '暂未填写',
    latitude:0,// 维度
    longitude:0, //经度
    address: '暂未填写',
    baseinfo:null,
    isLoad:false, //模态框
    loadtxt:"loading" //模态框
  },

  onLoad: function (options) {
  },

  onShow: function () {
    this.getShopInfo();
  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "联系我们",
      path: "/pages/connectUs/connectus",
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
      loadtxt:"loading"
    })
  },

  // 加载结果提醒
  layOutTxt: function (txt){
    this.setData({
      loadtxt: txt
    })
    setTimeout(()=>{
      this.hideLoad();
    },3000)
  },

  // 显示加载模态框
  showLoad: function () {
    this.setData({
      isLoad: true,
      loadtxt: "loading"
    })
  },

  // 获取店铺联系方式等信息
  getShopInfo: function () {
    this.showLoad();
    let address = app.ip + "shop/app/find/" + app.appid;
    let body = {
      appId: app.appid
    };
    api.request({}, body, "POST", address, "json", false).then(res => {
      console.log(res);
      console.log("地图")
      if(res.data.code == 200 && res.data.result){
        this.hideLoad();
        let info = res.data.data.addrList;
        let baseinfo = null;
        info.map( (item,index) => {
          if(item.isTop == 1){
            baseinfo = item;
          }
        } )
        this.setData({
          phone: baseinfo.phone,
          mail: baseinfo.email == null? '暂未填写' : baseinfo.email,
          address: baseinfo.address,
          baseinfo: baseinfo,
          markers:[{
            latitude: baseinfo.latitude,
            longitude: baseinfo.longitude,
            title: baseinfo.address
          }]
        })
      }
      else{
        this.layOutTxt("信息加载失败");
      }
    } ).catch(e=>{
      this.layOutTxt("加载异常")
    })
  }
})