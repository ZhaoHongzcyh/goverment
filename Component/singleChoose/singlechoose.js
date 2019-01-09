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
    cleartime:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose: function (e) {
      let index = e.currentTarget.dataset.index;
      let subjectid = e.currentTarget.dataset.subjectid;
      let optionsId = [];
      let content = {
        value: null,
        mustfill:0
      };
      let options = this.data.options;
      options.map( (item,num) => {
        item.checked = false;
        if(index == num){
          item.checked = true;
          optionsId.push(item.id);
          if(item.fill == 1 && item.mustFill == 1){
            content = {
              value: null,
              mustfill:1
            }
          }
        }
      })
      if (optionsId.length == 0){
        content = {value: null, mustfill:0};
      }
      this.setData({ options});
      this.triggerEvent("submit", { subjectid, optionsId, content });
    },

    // 检查是否存在已经选择的内容，但是暂未填写的填空
    checkMustFill: function ( options ){
      let check = false;
      options.map( (item, index) => {
        if(item.checked){
          if(item.fill == 1 && item.mustFill == 1){
            if(item.txt == null || this.strFormat(item.txt) == ""){
              check = true;
            }
          }
        }
      } );
      return check;
    },

  // 字符串格式化
    strFormat:function (str) {
      if (str == null) {
        str = "";
      }
      if ((typeof str) != "string") {
        throw new Error('this function can only handle strings');
      }
      else {
        str = str.replace(/\s/g, "");
        return str;
      }
    },

    // 匹配用户输入的内容
    getContent: function (e) {
      let value = e.detail.value;
      let optionsId = [];
      let content = {};
      let subjectid = e.currentTarget.dataset.subjectid;
      let options = this.data.options;
      let mustFill = 0;
      options.map( (item, index) => {
        if(item.checked){
          optionsId.push(item.id);
          mustFill = item.mustFill;
        }
      } );
      if (value != null){
        content = {
          value: this.strFormat(value),
          mustfill: mustFill
        }
      }
      else{
        content = { value: null, mustfill: mustFill}
      }
      setTimeout( ()=>{
        this.triggerEvent("submit", { subjectid, optionsId, content });
      },500 );
    }
  }

  
})
