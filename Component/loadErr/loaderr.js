// Component/loadErr/loaderr.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eventtxt:{
      type: String,
      value: "请重试"
    },

    infotxt:{
      type: String,
      value: "内容加载失败"
    },

    isShowEvent: {//是否显示请重试加载按钮
      type: Boolean,
      value: true
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
    repeat: function (e) {
      this.triggerEvent("repeat", { load: e });
    }
  }
})
