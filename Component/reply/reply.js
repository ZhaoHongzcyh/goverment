// Component/reply/reply.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userphoto:{
      type: String,
      value:"/Component/articleList/img/articleCover.png",
    },

    username:{
      type: String,
      value:'Hello'
    },

    time:{
      type: String,
      value: "2019-01-01"
    },

    comment:{
      type: String,
      value:'评论内容为空'
    },

    reply:{
      type: String,
      value:'暂未对此评论做出回复'
    },

    item:{
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
