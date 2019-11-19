const app = getApp();
const util = require('../../../utils/util.js');
const RQ = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      head_pic: "/static/images/user/index/default_avatar.png",
      nickname: "点击头像登录",
      user_money: 0,
      pay_points: 0
    },
    member: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
     * 用户登录引导
     */
  bindGetUserInfo(e) {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (userInfo && token) /**用户已经登录 */ {
      return;
    }
    /**用户没有登录并且点击登录按钮 */
    if (e.detail.userInfo)  /**点击按钮会将用户信息存在此处 */ {
      util.loginByWeixin(e.detail).then(res => { /**开始登录***/
        this.setData({
          userInfo: res.result
        });
        app.globalData.userInfo = res.result; /**将用户信息保存到全局*/
        app.globalData.token = res.result.token;
      }).catch((err) => {
        console.log(err)
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告通知',
        content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: (res) => {
                if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                  util.loginByWeixin(e.detail).then(res => { /**开始登录***/
                    this.setData({
                      userInfo: res.result
                    });
                    app.globalData.userInfo = res.result; /**将用户信息保存到全局*/
                    app.globalData.token = res.result.token;
                  }).catch((err) => {
                    console.log(err)
                  });
                }
              }
            })
          }
        }
      });
    }
  },

  goNextPage(e) {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (userInfo && token) /**用户已经登录 */ {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (userInfo && token) /**用户已经登录 */ {
      RQ.postRequest("/api/user/userInfo", { token: wx.getStorageSync('token') }, function (res) {
        if (res.status == 1) {
          that.setData({
            userInfo: res.result,
          });
          wx.setStorageSync('userInfo', res.result)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})