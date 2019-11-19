const RQ = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,
    list: [],
    allLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      categoryId: options.categoryId,
      labelId: options.labelId
    })
    this.getShopList()
  },

  // 获取商品列表
  getShopList() {
    let that = this;
    let form = {
      p: this.data.p
    };
    if (this.data.categoryId >= 0) {
      form.category_id = this.data.categoryId
    }
    if (this.data.labelId >= 0) {
      form.label_id = this.data.labelId
    }
    RQ.postRequest('/api/integral/goodsList', form, (res) => {
      that.setData({
        list: [...that.data.list, ...res.result]
      })
      if(res.result.length <= 0) {
        that.setData({
          allLoad: true
        })
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
    if(!this.data.allLoad) {
      let p = this.data.p;
      p++;
      this.setData({
        p: p
      })
      this.getShopList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})