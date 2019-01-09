// Component/wheelImg/wheelImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    whileImg:{
      type: Array,
      value: []
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
    click: function (e) {
      console.log(e);
      this.triggerEvent("click", { load: e });
    }
  }
})
