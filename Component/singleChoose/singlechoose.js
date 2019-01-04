// Component/singleChoose/singlechoose.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info:{
      type: Object,
      value:{}
    },

    options:{
      type: Object,
      value: []
    },
    
    num:{
      type: String,
      value: 1
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
    choose: function (e) {
      let index = e.currentTarget.dataset.index;
      let subjectid = e.currentTarget.dataset.subjectid;
      let optionsid = [];
      let content = null;//填空内容（多选与单选content一直为空）
      let options = this.data.options;
      options.map( (item,num) => {
        item.checked = false;
        if(index == num){
          item.checked = true;
          optionsid.push(item.id);
        }
      })
      this.setData({ options});
      this.triggerEvent("submit", { subjectid, optionsid, content });
    }
  }
})
