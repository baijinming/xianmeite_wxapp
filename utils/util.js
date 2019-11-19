const RQ = require('./request.js');
const app = getApp()

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {
  let code = null;
  return new Promise(function (resolve, reject) {
    return login().then((res) => {
      code = res.code;
      //登录远程服务器
      RQ.postRequest('/api/user/miniappLogin', { js_code: code, nickname: userInfo.userInfo.nickName, head_pic: userInfo.userInfo.avatarUrl, coordinate_xy: app.globalData.latitude + ',' + app.globalData.longitude}, function(res){
        if(res.status == 1){
          wx.setStorageSync('userInfo', res.result);
          wx.setStorageSync('token', res.result.token);
          resolve(res)
        }
      }, function() {

      });

    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 微信登录promise
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}


module.exports = {
  loginByWeixin
}
