// pages/aboutus/aboutus.js
const app = getApp();
const api = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  // 获取店铺详细信息
  getShopInfo: function () {
    let address = app.ip + "shop/app/find/" + app.appid;
    let body = {
      appId: app.appid
    };
    api.request({}, body, "POST", address, "json", false).then(res => {
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let baseInfo = res.data.data.baseInfo;
        this.setData({
          baseInfo
        })
      }
    }).catch(e => {

    })
  }
})