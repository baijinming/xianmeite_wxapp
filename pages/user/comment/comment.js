const RQ = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    anonymous: false,
    imgList: [],
    comment_index: 5,
    lock: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_id: options.order_id,
      goods_id: options.goods_id,
    })
  },

  // 提交评价
  addComment() {
    let is_anonymous = 0;
    if(this.data.anonymous) {
      is_anonymous = 1;
    }
    let form = {
      token: wx.getStorageSync('token'),
      order_id: this.data.order_id,
      goods_id: this.data.goods_id,
      deliver_rank: 5,
      service_rank: 5,
      goods_rank: this.data.comment_index,
      is_anonymous: is_anonymous,
      content: this.data.content,
    }
    let imgList = this.data.imgList;
    for(let i = 0; i < imgList.length; i ++) {
      let obj = `urlpath[${i}]`;
      form[obj] = imgList[i]
    }
    if (form.content == undefined || form.content.length < 5) {
      wx.showToast({
        title: '评论内容不得少于五个字符',
        icon: 'none'
      })
      return;
    }
    RQ.postRequest("/api/user/add_comment", form, function (res) {
      if (res.status == 1) {
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
        wx.showToast({
          title: "感谢你的评价！",
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
  },

  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  choosePj(e){
    this.setData({
      comment_index: e.currentTarget.dataset.index
    })
  },

  switch() {
    this.setData({
      anonymous: !this.data.anonymous
    })
  },

  // 选择图片
  chooseImg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        let fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: tempFilePaths[0],
          encoding: 'base64',
          success: function (data) {
            that.setData({
              imgList: [...that.data.imgList, 'data:image/jpg;base64,' + data.data]
            })
            if(that.data.imgList.length >= 3){
              that.setData({
                lock: true
              })
            }
          }
        })
      },
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})