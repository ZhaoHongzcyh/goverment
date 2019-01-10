//app.js
const api = require("./utils/util.js");
App({
  ip:"https://xcx.imdtcx.com/",
  appid:null,
  // appid:'6716107060024131804',
  openid: null,
  baseInfo:null,
  onLaunch: function () {
    this.getSystemInfo();
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: (res) => {
          this.appid = res.extConfig.appId || '3682415975335546821';//测试环境
          this.getShopInfo();
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              console.log("微信加密");
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  getShopInfo: function () {
    let address = this.ip + "shop/app/find/" + this.appid;
    let body = {
      appId: this.appid
    };
    api.request({}, body, "POST", address, "json", false).then(res => {
      console.log("店铺信息")
      console.log(res);
      if (res.data.code == 200 && res.data.result) {
        let baseInfo = res.data.data.baseInfo;
        this.baseInfo = baseInfo;
      }
      else {
        // this.layOutTxt("");
      }
    }).catch(e => {
    })
  },

  // 数据统计-访问
  statistics: function () {
    let address = this.ip + "weiXin/data/updateVisitPv/" + this.appid + "/" + this.openid;
    let body = {
      appId: this.appid,
      openId: this.openid
    };
    api.request({}, body, "POST", address, "json", false).then( res => {
      console.log("访问数据统计");
    } )
  },

  // 获取相关信息openid
  getSystemInfo: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("wx.login")
        console.log(res);
        if (res.code) {
          let address = this.ip + "weiXin/trans2OpenId/" + this.appid + "/" + res.code;
          console.log(address);
          // debugger;
          let body = {
            appId: this.appid,
            code: res.code
          }
          api.request({}, body, "POST", address, "json", false).then(res => {
            console.log("微信开放")
            console.log(res);
            if (res.data.code == 200 && res.data.result) {
              this.openid = res.data.data;

              // 访问数据统计
              this.statistics();
            }
          })
        }

      }
    })
  },

  globalData: {
    userInfo: null
  }
})