const RQ = require('../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedIndex: 0,
    list: [],
    backOrder: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.operation == 'choose') {
      this.setData({
        backOrder: true
      })
    }
  },

  // 获取地址列表
  getData() {
    let that = this;
    RQ.postRequest("/api/user/getAddressList", {token: wx.getStorageSync('token')}, function (res) {
      if (res.status == 1) {
        that.setData({
          list: res.result.reverse()
        })
        for (let i = 0; i < res.result.length; i++) {
          if (res.result[i].is_default == 1) {
            that.setData({
              checkedIndex: i
            })
          }
        }
      }
    })
  },

  // 删除地址
  removeAddr(event) {
    let that = this;
    RQ.postRequest("/api/user/del_address", { token: wx.getStorageSync('token'), address_id: event.currentTarget.dataset.id }, function (res) {
      if (res.status == 1) {
        wx.showToast({
          title: "已删除",
          icon: "success"
        });
        that.getData();
      }
    })
  },

  // 编辑地址
  editAddr(event) {
    wx.navigateTo({
      url: '/pages/user/address/edit/edit?id=' + event.currentTarget.dataset.id,
    })
  },

  //添加地址 
  addAddre() {
    if (this.data.backOrder) {
      wx.navigateTo({
        url: '/pages/user/address/add/add?operation=choose',
      })
    } else {
      wx.navigateTo({
        url: '/pages/user/address/add/add',
      })
    }
  },

  radioChange(event) {
    let that = this;
    RQ.postRequest("/api/user/setDefaultAddress", { token: wx.getStorageSync('token'), address_id: event.currentTarget.dataset.id }, function (res) {
      if (that.data.backOrder) {
        wx.navigateBack({
          delta: 1
        });
      } else {
        that.getData()
      }
    })
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
    this.getData()
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