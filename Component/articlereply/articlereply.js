// Component/articlereply/articlereply.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    likenum: {
      type: Number,
      value: 0
    },
    replynum: {
      type: Number,
      value: 0
    },
    collectStatus: {//文章是否被收藏
      type: Number,
      value: 0
    },
    clickupStatus:{//文章是否已经被点赞过
      type: Number,
      value: 0
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    replyContent:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    share: function (e) {//分享
      this.triggerEvent("share", { load: e });
    },

    collect: function (e) {//收藏
      this.triggerEvent("collect", { load: e });
    },

    clickup: function (e) {//点赞
      this.triggerEvent("clickup", { load: e });
    },

    sendreply: function (e) {//发送评论
      this.triggerEvent("reply", { load: e });
      this.setData({
        replyContent:""
      })
    }
  }
})
