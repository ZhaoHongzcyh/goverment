// Component/fillBlank/fillblank.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info:{
      type: Object,
      value: {}
    },

    num:{
      type: String,
      value: 1
    },
    
    value:{
      type: String,
      value:""
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
    fillback: function (e) {
      console.log(e);
      console.log(this.data.info)
      let subjectid = e.currentTarget.dataset.id;
      let optionsId = subjectid;
      let content = e.detail.value;
      this.triggerEvent("submit", { subjectid, optionsId, content });
    }
  }
})
