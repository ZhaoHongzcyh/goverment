const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const request = function (header={},body={},method='POST',url,format='json',bool=false){
  // bool：请求头是否携带其他信息
  header['content-type'] = format == 'json' ? 'application/json' : 'application/x-www-form-urlencoded';
  return new Promise(function(resolve,reject){
    wx.request({
      header:header,
      url:url,
      method:method,
      data:body,
      success:function(res){resolve(res)},
      fail:function(err){reject(err)}
    })
  })
}

// 祛除所有空格，返回处理之后的内容
const strFormat = function (str){
  if(str == null){
    str = "";
  }
  if ((typeof str) != "string"){
    throw new Error('this function can only handle strings');
  }
  else{
    str = str.replace(/\s/g, "");
    return str;
  }
}

// 转发数据统计
const forwardStatic = function (app) {
  let address = app.ip + "weiXin/data/updateSharePv/" + app.appid;
  let body = {
    appId: app.appid
  };
  request({}, body, "POST", address, "json", false).then( res => {
    console.log("小程序访问趋势信息");
    console.log(res);
  } )
}

module.exports = {
  formatTime: formatTime,
  request: request,
  strFormat: strFormat,
  forwardStatic: forwardStatic
}

