// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoredata:[1,0,0,0,0]//1:好评，0：未作评价
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})