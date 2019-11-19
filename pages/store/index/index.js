// pages/store/index/index.js
const RQ = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList: [],
    shop_id: null,
    shopMsg: null,
    isCollect: false,
    condition: 1,
    isOrder: true,
    p: 1,
    pagesize: 8,
    allLoaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shop_id: options.id
    })
    this.getShopList()
  },

  // 获取商品列表
  getShopList() {
    let that = this;
    let form = {
      token: wx.getStorageSync('token'),
      shop_id: this.data.shop_id,
      p: this.data.p,
      pagesize: this.data.pagesize,
      sort_asc: this.data.isOrder ? 'desc' : 'asc'
    }
    if (this.data.condition == 2) {
      form.orderby_sales_sum = true
    } else if (this.data.condition == 3) {
      form.orderby_price = true
    }
    RQ.postRequest('/api/shop/shop_info', form, (res) => {
      if(res.status == 1) {
        that.setData({
          proList: [...that.data.proList, ...res.result.goods],
          shopMsg: res.result.shop
        })
        if (res.result.goods.length <= 0) {
          this.setData({
            allLoaded: true
          })
        }
        if (res.result.is_collect == 1) {
          this.setData({
            isCollect: true
          })
        }
      }
    })
  },
  // 收藏店铺
  collect() {
    let form = {
      token: wx.getStorageSync('token'),
      shop_id: this.data.shop_id,
      type: 0
    }
    RQ.postRequest('/api/shop/sc', form, (res) => {
      if(res.result == 1) {
        wx.showToast({
          title: res.msg,
          icon: 'success'
        })
        this.setData({
          isCollect: true
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 切换条件
  switch(e) {
    let condition = e.currentTarget.dataset.index;
    if (condition == 1 && condition == this.data.condition) {
      return false;
    } else if (condition == this.data.condition){
      this.setData({
        isOrder: !this.data.isOrder,
        p: 1,
        proList: [],
        allLoaded: false
      })
      this.getShopList();
    } else {
      this.setData({
        p: 1,
        proList: [],
        condition: condition,
        isOrder: true,
        allLoaded: false
      })
      this.getShopList();
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
    if(!this.data.allLoaded) {
      let p = this.data.p;
      this.setData({
        p: ++p
      })
      this.getShopList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})