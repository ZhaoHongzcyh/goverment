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
    pageIndex:0, //评论的当前页码
    pageSize: 10, //每一页的评论数量
    collectStatus: 0,//文章是否被收藏
    clickupStatus: 0, //文章点赞情况
    replyList:[] //文章评论情况
  },

  onLoad: function (options) {
    this.setData({
      articleid: options.articleid
    })
    this.getArticleContent( options.articleid )
  },

  onShow: function () {
    
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
    let address = app.ip + "shop/article/find/" + articleid;
    let body = {
      id: articleid,
      openId: app.openid
    };
    api.request( {}, body, "POST", address, "application", false).then( res=>{
      console.log("文章详细信息");
      console.log(res);
      if(res.data.code == 200 && res.data.result){
        let data = res.data.data;
        let member = res.data.data.member;
        let articleList = res.data.data.articleList;
        let summary = res.data.data.summary;
        this.setData({
          articleList: articleList,
          title: summary.desciption,
          time: summary.createDate.split("T")[0],
          visitNum: summary.visitNum != null? summary.visitNum : 0,
          summary:summary,
          clickupStatus:member.isLike,
          collectStatus: member.isCollect,
          member: member
        });

        this.getArticleReply(); //获取评论
        this.addReadNum(articleid); //增加阅读量
      }
      else{
        console.log("文章内容获取失败"); //是否有弹框？或者异常页面
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
        this.setData({
          replyList: list
        })
      }
    } )
  },

  // 文章分享
  share: function (e) {
    console.log(e);
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
      console.log("文章收藏");
      console.log(res)
      if(res.data.code == 200 && res.data.result){
        let member = this.data.member;
        member.isCollect = body.status;
        this.setData({
          collectStatus: body.status,
          member: member
        })
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
    } )
  },

  // 发送文章评论
  sendReply: function (e) {
    console.log(e);
    e = e.detail.load;
    let commentContent = e.detail.value;
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
        let time = d.getFullYear() + "-" + d.getMonth() + 1 + "-" + d.getDate();
        let reply = {
          time: time,
          commentContent: body.commentContent,
        }
        replyList.push(reply);
        this.setData({
          replyList
        })
        console.log(time)
      }
      else{

      }
    } )
  }
})