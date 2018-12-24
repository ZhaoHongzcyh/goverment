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

module.exports = {
  formatTime: formatTime,
  request: request
}

