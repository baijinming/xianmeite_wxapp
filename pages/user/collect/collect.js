const RQ = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    left: [],
    startX: "",
    delBtnWidth: 120,
    list: false,
    tabBar: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  // tab切换
  switch(event) {
    let tabBar = event.currentTarget.dataset.tab;
    if(tabBar == this.data.tabBar) {
      return false;
    }
    this.setData({
      tabBar: tabBar
    })
    if (this.data.tabBar == 2) {
      this.setData({
        list: []
      })
      this.getStore()
    } else {
      this.setData({
        list: []
      })
      this.getData()
    }
  },

  // 获取商品收藏列表
  getData() {
    let that = this;
    RQ.postRequest("/api/user/getGoodsCollect", { token: wx.getStorageSync('token') }, function (res) {
      if (res.status == 1) {
        let list = res.result;
        that.setData({
          list: list
        })
      }
    })
  },
  // 获取店铺收藏列表
  getStore() {
    let that = this;
    RQ.postRequest("/api/shop/sclist", { token: wx.getStorageSync('token') }, function (res) {
      if (res.status == 1) {
        let list = res.result;
        that.setData({
          list: list
        })
      }
    })
  },

  // 删除收藏
  removeCollect(event) {
    let that = this;
    if(that.data.tabBar == 1) {
      RQ.postRequest("/api/goods/collectGoods", { token: wx.getStorageSync('token'), goods_id: event.currentTarget.dataset.id, type: 1 }, function (res) {
        if (res.status == 1) {
          wx.showToast({
            title: "已删除",
            icon: "success"
          });
          that.getData();
        }
      })
    }else {
      RQ.postRequest("/api/shop/sc", { token: wx.getStorageSync('token'), shop_id: event.currentTarget.dataset.id, type: 1 }, function (res) {
        if (res.status == 1) {
          wx.showToast({
            title: "已删除",
            icon: "success"
          });
          that.getData();
        }
      })
    }
    
  },

  touchStart(e){
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchEnd(e) {
    let index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      let endX = e.changedTouches[0].clientX;
      let disX = this.data.startX - endX;
      let delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      let left = [];
      if(disX > 0) {
        left[index] = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0rpx";
      }else if(disX < 0){
        left[index] = Math.abs(disX) < delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0rpx";
      }else if(disX = 0) {
        left[index] = this.data.left;
      }
      this.setData({
        left: left
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