// Component/suspension/suspension.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isOpenReply:{
      type: Boolean,
      value: false
    },

    isOpenEvaluation:{
      type: Boolean,
      value: false
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
    feedback: function () {
      wx.navigateTo({
        url: '/pages/feedback/feedback',
      })
    },

    evaluat: function () {
      wx.navigateTo({
        url: '/pages/evaluation/evaluation',
      })
    }
  }
})
