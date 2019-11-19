var app = getApp();

function getRequest(url, str, successFun, errFun) {
    if (str) {
        str = '?' + str;
    }
    wx.showLoading({
        title: '加载中'
    });
    wx.request({
        url: app.globalData.URL + url + str,
        method: 'GET',
        header: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        dataType: 'json',
        success: function (res) {
            wx.hideLoading();
            if(res.data.status == -100) {
              wx.clearStorageSync();
              wx.navigateTo({
                url: '/pages/login/login',
              })
              return;
            }
            successFun(res.data);
        },
        fail: function (err) {
            wx.hideLoading();
            errFun(err);
        }
    })
}

function postRequest(url, params, successFun, errFun) {
    wx.showLoading({
        title: '加载中'
    });
    wx.request({
        url: app.globalData.URL + url,
        method: 'POST',
        data: params,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        dataType: 'json',
        success: function (res) {
            wx.hideLoading();
          if (res.data.status == -100) {
            wx.clearStorageSync();
            wx.navigateTo({
              url: '/pages/login/login',
            })
            return;
          }
          successFun(res.data);
        },
        fail: function (err) {
            wx.hideLoading();
            errFun(err);
        }
    })
}

module.exports = {
    getRequest: getRequest,
    postRequest: postRequest
};