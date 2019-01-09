// Component/menuList/menulist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menu:{
      type: Array,
      value:[
        { title: '政务公开', src: "/Component/menuList/img/government_affairs@3x.png",id:null},
        { title: '会议要闻', src: "/Component/menuList/img/meeting@3x.png",id:null },
        { title: '通知公告', src: "/Component/menuList/img/notice@3x.png",id:null },
        { title: '乡镇动态', src: "/Component/menuList/img/dynamic@3x.png" ,id: null},
        { title: '招商引资', src: "/Component/menuList/img/investment@3x.png", id: null },
        { title: '通知公告', src: "/Component/menuList/img/notice@3x.png" ,id: null},
        { title: '乡镇动态', src: "/Component/menuList/img/dynamic@3x.png" ,id: null},
        { title: '招商引资', src: "/Component/menuList/img/investment@3x.png" ,id: null}
      ]
    },

    groupNum:{
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0,
    resolveSrc:"/Component/menuList/img/"
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    click: function(e) {
      this.triggerEvent("click", { load: e });
    },

    changeCurrent: function(e) {
      console.log(e);
      this.setData({
        current: e.detail.current
      })
    },

    changeSwip: function(e){
      let current = e.currentTarget.dataset.current;
      console.log(current);
      this.setData({current})
    }
  }
})
