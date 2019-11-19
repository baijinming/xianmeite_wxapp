// pages/comment/comment.js
var request = require("../../utils/request.js");
var timeFormat = require('../../utils/format.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    };

    this.setData({
      orderId: options.id
    })
  },

  // 图片预览
  previewImage(event) {
    let that = this;
    let imgUrls = event.currentTarget.dataset.imgList;
    wx.previewImage({
      urls: imgUrls,
      current: event.currentTarget.dataset.current
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDetail();
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

  },
  getDetail: function () {
    let str = 'id=' + this.data.orderId;
    request.getRequest('/api/goods/goodsInfo', str, (msg) => {
      let result = msg.result;
      let comment = result.comment;
      for(let i=0;i<comment.length;i++){
        let add_time = comment[i].add_time;
        comment[i].date = timeFormat.formatTimeTwo(add_time, 'Y-M-D h:m:s');
      }
      this.setData({
        comment: result.comment
      });
    })
  },

})