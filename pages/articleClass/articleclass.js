// pages/articleClass/articleclass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleType:[
      { title: '推荐', type: 0, select: true },
      { title: '政务公开', type: 1, select: false },
      { title: '会议要闻', type: 2, select: false },
      { title: '通知公告', type: 3, select: false },
      { title: '乡镇动态', type: 4, select: false },
      { title: '招商引资', type: 5, select: false }
    ]
  },

  onLoad: function (options) {
    console.log(options);
    this.initChooseMenu( options )
  },

  // 选择默认加载的内容
  initChooseMenu: function (options) {
    let articleType = this.data.articleType;
    articleType.map( (item,index)=>{
      item.select = item.title == options.info? true : false
    } );
    this.setData({ articleType })
  },

  onShow: function () {

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

  }
})