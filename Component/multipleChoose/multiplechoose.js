// Component/singleChoose/singlechoose.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    },

    options: {
      type: Object,
      value: []
    },

    num: {
      type: String,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    optionsId:[]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    choose: function (e) {
      let content = null;
      let subjectid = e.currentTarget.dataset.subjectid;
      let options = this.data.options;
      let optionsId = this.data.optionsId;
      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;
      let check = false;
      let delnum = 0;
      options[index].checked = !options[index].checked;
      options.map( (item,num) => {
        if(item.checked){
          optionsId.push(item.id);
        }
      } );
      optionsId = Array.from(new Set(optionsId));
      console.log(optionsId);
      this.setData({ options, optionsId});
      this.triggerEvent("submit", { subjectid, optionsId, content });
    }
  }
})
