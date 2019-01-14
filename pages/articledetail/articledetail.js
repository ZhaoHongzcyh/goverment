// pages/articledetail/articledetail.js
const app = getApp();
const api = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleid: null,
    summary:null, //文章基础信息
    member:null, //文章点赞评论与收藏信息
    articleList:[],//文章段落
    time:null, //发表日期
    title:null, //文章标题
    visitNum:0, //文章阅读量
    pageIndex:1, //评论的当前页码
    pageSize: 10, //每一页的评论数量
    collectStatus: 0,//文章是否被收藏
    clickupStatus: 0, //文章点赞情况
    replyList:[], //文章评论情况
    isLoadEnd: false,//评论是否已经加载完毕
    isLoad: true, //模态框，是否正在加载中
    loadtxt: "loading" //模态框提示文字
  },

  onLoad: function (options) {
    this.setData({
      articleid: options.articleid
    })
    this.getArticleContent( options.articleid )
  },

  onShow: function () {
    
  },


  // 隐藏加载模态框
  hideLoad: function () {
    this.setData({
      isLoad: false,
      loadtxt: "loading"
    })
  },

  // 加载结果提醒
  layOutTxt: function (txt) {
    this.setData({
      isLoad: true,
      loadtxt: txt
    })
    setTimeout(() => {
      this.hideLoad();
    }, 2000)
  },

  // 显示加载模态框
  showLoad: function () {
    this.setData({
      isLoad: true,
      loadtxt: "loading"
    })
  },

  // 显示提示信息
  showModelTxt: function (txt) {
    this.setData({
      loadtxt: txt,
      isLoad: true
    })
  },

  // 添加阅读量
  addReadNum: function (articleid) {
    let address = app.ip + "shop/article/visit/" + articleid;
    let body = {id: articleid};
    api.request( {},body, "POST", address, "json", false ).then( res=>{
      console.log("增加文章阅读量")
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let data = res.data.data;
        this.setData({ visitNum: data})
      }
    } )
  },

  // 获取文章内容
  getArticleContent: function (articleid) {
    this.showLoad();
    let address = app.ip + "shop/article/find/" + articleid;
    let body = {
      id: articleid,
      openId: app.openid
    };
    api.request( {}, body, "POST", address, "application", false).then( res=>{
      console.log("文章详细信息");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        this.hideLoad();
        let data = res.data.data;
        let member = res.data.data.member;
        let articleList = res.data.data.articleList;
        let summary = res.data.data.summary;
        this.setData({
          articleList: articleList,
          title: summary.desciption,
          time: summary.createDate.split("T")[0],
          visitNum: summary.visitNum != null? summary.visitNum : 0,
          summary:summary
        });
        if(member != null){
          this.setData({
            clickupStatus: member.isLike,
            collectStatus: member.isCollect,
            member: member
          })
        }

        this.getArticleReply(); //获取评论
        this.addReadNum(articleid); //增加阅读量
      }
      else{
        this.layOutTxt("文章读取失败");
      }
    } )
  },

  // 获取文章评论
  getArticleReply: function () {
    let address = app.ip + "shop/article/findPageList4Comment";
    let body = {
      appId: app.appid,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      openId: app.openid,
      introId: this.data.articleid
    };

    api.request( {}, body, "POST", address, "application", false ).then( res=>{
      console.log("评论");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let list = res.data.data.list;
        list.map(( item, index ) => {
          item.time = item.createDate.split("T")[0]
        } )
        let checkEnd = false;//评论是否加载完毕
        if(list.length < this.data.pageSize){
          checkEnd = true;
        }
        this.setData({
          replyList: list,
          isLoadEnd: checkEnd
        })
      }
    } )
  },

  // 加载更多评论
  loadMoreReply: function () {
    this.showModelTxt("加载更多");
    let address = app.ip + "shop/article/findPageList4Comment";
    let body = {
      appId: app.appid,
      pageIndex: this.data.pageIndex + 1,
      pageSize: this.data.pageSize,
      openId: app.openid,
      introId: this.data.articleid
    };
    if (this.data.isLoadEnd ){
      this.hideLoad();
      return false;
    }
    api.request({}, body, "POST", address, "application", false).then(res => {
      console.log(res);
      this.setData({
        pageIndex: body.pageIndex
      })
      if( res.data.code == 200 && res.data.result ){
        this.hideLoad();
        let list = res.data.data.list;
        let replyList = this.data.replyList;
        let checkEnd = false;
        list.map((item, index) => {
          item.time = item.createDate.split("T")[0]
        })
        if( list.length < this.data.pageSize && list.length != 0 ) {
          checkEnd = true;//评论已经加载完毕
        }
        replyList = replyList.concat( list );
        this.setData({
          pageIndex: list.length == 0? body.pageIndex - 1 : body.pageIndex,
          isLoadEnd: checkEnd,
          replyList: replyList
        })
      }
      else{
        this.layOutTxt("评论加载失败");
      }
    } ).catch( e=> {
      this.layOutTxt("评论加载失败");
    })
  },

  // 文章分享
  share: function (e) {
    console.log(e);
    wx.showShareMenu();
  },

  // 收藏文章
  collect: function (e) {
    console.log(e);
    let address = app.ip + "shop/article/collect/" + this.data.articleid;
    let body = {
      id: this.data.articleid,
      openId: app.openid,
      status: this.data.collectStatus == 0? 1 : 0
    };
    api.request( {}, body, "POST", address, "application", false ).then( res=>{
      if(res.data.code == 200 && res.data.result){
        let member = this.data.member;
        if(member == null){
          member = {};
        }
        member.isCollect = body.status;
        this.setData({
          collectStatus: body.status,
          member: member
        })
      }
      else{
        this.layOutTxt("文章收藏失败");
      }
    } )

  },

  // 文章点赞
  clickup: function (e) {
    console.log(e);
    let address = app.ip + "shop/article/like/" + this.data.articleid;
    let body = {
      id: this.data.articleid,
      openId: app.openid,
      status: this.data.clickupStatus == 0? 1 : 0
    }
    api.request( {}, body, "POST", address, "application", false ).then( res=>{
      console.log("点赞情况");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let summary = this.data.summary;
        switch(body.status){
          case 1:
            summary.likeNum = summary.likeNum + 1;
          break;
          case 0:
            summary.likeNum = summary.likeNum - 1;
        }
        console.log(summary);
        this.setData({
          clickupStatus: body.status,
          summary: summary
        })
      }
      else{
        this.layOutTxt("点赞失败");
      }
    } )
  },

  // 发送文章评论
  sendReply: function (e) {
    console.log(e);
    e = e.detail.load;
    let commentContent = api.strFormat( e.detail.value );
    if ( commentContent == "" ){
      this.layOutTxt("评论为空");
      return false;
    }
    else{
      commentContent = e.detail.value
    }
    let address = app.ip + "shop/article/comment";
    let body = {
      introId: this.data.articleid,
      openId: app.openid,
      commentContent: commentContent
    };
    console.log(body)
    api.request( {}, body, "POST", address, "application", false ).then( res=>{
      console.log("文章评论");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let replyList = this.data.replyList;
        let d = new Date();
        let time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        let reply = {
          isSelf:1,
          time: time,
          commentContent: body.commentContent,
        }
        replyList.unshift(reply);
        this.setData({
          replyList
        })
        console.log(time)
      }
      else{
        this.layOutTxt("评论失败");
      }
    } )
  },
  
  onShareAppMessage: function (ops) {
    console.log(ops);
    let foreardObj = {
      title: this.data.title,
      path: "/pages/articledetail/articledetail?articleid=" + this.data.articleid,
      success:(r) => {
        console.log("转发成功");
        console.log(r);
        api.forwardStatic( app )
      }
    };
    return foreardObj;
  }
})