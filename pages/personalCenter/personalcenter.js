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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})