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
    optionsId:[],
    content:[],
    timeout:null
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getContent: function (e) {
      clearTimeout(this.data.timeout);
      let value = e.detail.value;
      let subjectid = e.currentTarget.dataset.subjectid;
      let options = this.data.options;
      
      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;
      let detailList = {
        subjectId: subjectid,
        id:id,
        content: value
      };
      
      let timeout = setTimeout(()=>{
        options[index].txt = value;
        // console.log(index);
        this.setData({options});
        
        this.delRepeatDataWidthNewData(id, detailList);
        this.componentRepeat(subjectid, id);
        let mustfill = this.submitMustFill(this.data.options);
        let optionsId = this.data.optionsId;
        this.triggerEvent("submit", { subjectid, optionsId, content:this.data.content, mustfill });
      },500);
      this.setData({timeout});
      
    },

    choose: function (e) {
      let content = [];
      let subjectid = e.currentTarget.dataset.subjectid;
      let options = this.data.options;
      let optionsId = this.data.optionsId;
      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;
      let check = false;
      let delnum = 0;
      let isShowToast = this.checkMustFill(options);
      if (isShowToast){
        return false;
      }
      options[index].checked = !options[index].checked;
      this.delRepeatData(options, subjectid,id, index);
      // this.componentRepeat( subjectid, id );
      // options.map( (item,num) => {
      //   if(item.checked){
      //     optionsId.push(item.id);
      //   }
      // } );
      optionsId = this.data.optionsId;//Array.from(new Set(optionsId));
      content = this.data.content;
      // this.setData({ options, optionsId});
      let mustfill = this.submitMustFill(options);
      this.triggerEvent("submit", { subjectid, optionsId, content, mustfill });
    },

    // 向父组件提交是否有必选选项未填写
    submitMustFill: function (options) {
      let check = false;
      // let mustfill = {value}
      options.map( (item, num) => {
        if(item.checked){
          if(item.fill == 1 && item.mustFill == 1){
            if (item.txt == null || this.strFormat(item.txt) == ""){
              check = true;
            }
          }
        }
      } );
      let content = {
        mustfill:check? 1:0
      };
      return content;
    },

    // 校验是否有必填的选项
    checkMustFill: function (options){
      let check = false;
      options.map( (item,index) => {
        if(item.checked){
          if(item.fill == 1 && item.mustFill == 1){
            if (item.txt == null || this.strFormat(item.txt) == ""){
              check = true;
            }
          }
        }
      } );
      if(check){
        wx.showToast({
          title:"请填写完整内容",
          icon:"none"
        })
      }
      return check;
    },

    // 删除重复数据并替换
    delRepeatDataWidthNewData: function ( optionsid, newdata ){
      let content = this.data.content;
      let isRepeat = false;
      let repeatNum = 0;
      content.map( (item, num) => {
        if(item.id == optionsid){
          isRepeat = true;
          repeatNum = num;
        }
      } )
      if( isRepeat ){
        content.splice(repeatNum, 1, newdata);
      }
      else{
        content.push(newdata);
      }
      this.setData({ content });
      console.log(content);
    },

    // 删除重复数据
    delRepeatData: function (options, subjectId, optionid, index ){
      let content = [];
      // let options = this.data.options;
      let optionsId = [];
      options.map( (item,index) => {
        let detailList = {
          subjectId: subjectId,
          id: null,
          content: null
        };
        if(!item.checked){
          item.txt = null;
        }
        else{
          detailList.id = item.id;
          detailList.content = item.txt;
          content.push(detailList);
          optionsId.push( item.id );
        }
      } );
      optionsId = Array.from(new Set(optionsId));
      this.setData({ content, options, optionsId});
    },

    // 当组建重新渲染时获得用户输入的数据
    componentRepeat: function (subjectid, id) {
      let options = this.data.options;
      let optionsId = [];
      let content = [];
      
      options.map( (item,index) => {
        let detailList = {
          subjectId: subjectid,
          id: null,
          content: null
        };
        if(item.checked){
          detailList.id = item.id;
          detailList.content = item.txt;
          console.log(detailList);
          content.push(detailList);
          optionsId.push(item.id);
        }
      } );

      this.setData({ content, optionsId });

    },

    // 删除多余空格
    strFormat: function (str) {
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
    }
  }
})
