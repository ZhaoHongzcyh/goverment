// Component/articleList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataTime: {//文章发表日期
      type: String,
      value: "2019-01-01"
    },

    readNum: {//文章阅读量
      type: Number,
      value: 0
    },

    thumbsUpNum: {//文章点赞数量
      type: Number,
      value: 0
    },

    replyNum: {//文章回复数量
      type: Number,
      value: 0
    },

    title: {//文章标题
      type: String,
      value: '文章标题'
    },

    src: {
      type: String,
      value: '/Component/articleList/img/articleCover.png'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    resolveSrc:"/Component/articleList/img/"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click: function(e){
      this.triggerEvent("click",{load:e});
    }
  }
})
