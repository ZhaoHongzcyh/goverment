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
    ],
    current: 0 //当前所在滑块的index
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
      if( item.select ){
        this.initCurrent(index);
      }
    } );
    this.setData({ articleType });
    
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
    console.log(e);
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
      }
    } );
    this.setData({ articleType, current})
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