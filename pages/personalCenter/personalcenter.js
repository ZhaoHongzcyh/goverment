


// pages/personalCenter/personalcenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,//用户详细信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  
  onShow: function () {

  },

  myconnection: function () {
    wx.navigateTo({
      url: './myconnection/myconnection',
    })
  },

  aboutus: function () {
    wx.navigateTo({
      url: './aboutus/aboutus',
    })
  },

  makeprogramal: function () {
    wx.navigateTo({
      url: './makeSmallProgram/makesmallprogram',
    })
  },

  onShareAppMessage: function (ops) {
    let foreardObj = {
      title: "个人中心",
      path: "/pages/personalCenter/personalCenter",
      success: (r) => {
        console.log("转发成功");
        console.log(r);
        api.forwardStatic(app)
      }
    };
    return foreardObj;
  },
})