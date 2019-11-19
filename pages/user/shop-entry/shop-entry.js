const RQ = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    licenseImg: "",
    region: [],
    shop_head_img: '',
    license_img: '',
    editPassShow: false,
    password_check: '',
    password_check: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 店铺信息
  getShopStatus() {
    let that = this;
    RQ.postRequest('/api/shop/shopStatus', {token: wx.getStorageSync('token')}, (res) => {
      that.setData({
        shopStatus: res.result.status, // -1 未申请开店； 1 正常运营 ； -2 申请被驳回； -3 申请审核中
        msg: res.result
      })
    })
  },

  // 省市区
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  // 提交审核
  formSubmit(e) {
    let form = {
      ...e.detail.value,
      shop_address_city: this.data.region.join(''),
      shop_head_img: this.data.shop_head_img,
      license_img: this.data.license_img,
      token: wx.getStorageSync('token')
    }
    console.log(form)
    let lock = false;
    for(let i in form) {
      if(form[i] == '') {
        lock = true;
        wx.showToast({
          title: '请确认信息填写完整！',
          icon: 'none'
        })
      }
    }
    if(!lock) {
      form.shop_intro = '';
      RQ.postRequest('/api/shop/add', form, (res) => {
        if(res.status == 1) {
          wx.showToast({
            title: '申请成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },

  //进入修改密码
  editPass() {
    this.setData({
      editPassShow: true
    })
  },

  //修改密码
  sureEditBtn() {
    let that = this;
    let form = {
      token: wx.getStorageSync('token'),
      password: this.data.password,
      password_check: this.data.password_check
    }
    if(form.password.length < 6 || form.password.length > 12) {
      wx.showToast({
        title: '请注意密码长度为6-12位',
        icon: 'none'
      })
      return false;
    }
    if (form.password != form.password_check) {
      wx.showToast({
        title: '请确保两次密码输入一致',
        icon: 'none'
      })
      return false;
    }
    RQ.postRequest('/api/shop/saveShopPassword', form, (res) => {
      if(res.status == 1) {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })
        setTimeout(() => {
          that.setData({
            editPassShow: false
          })
        },1000)
      }
    })
  },

  newPassChange(e) {
    this.setData({
      password: e.detail.value
    })
  },
  surePassChange(e) {
    this.setData({
      password_check: e.detail.value
    })
  },

  // 上传图片
  chooseImg(event) {
    console.log(event)
    let that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        let tempFilePaths = res.tempFilePaths;
        let fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: tempFilePaths[0],
          encoding: 'base64',
          success: function(data){
            let form = {
              token: wx.getStorageSync('token'),
              base64_img: 'data:image/jpg;base64,' + data.data,
              upload_route: 'COMMENT_IMG'
            }
            RQ.postRequest('/api/user/open_base64_img_upload', form, (result) => {
              if(result.status == 1) {
                if(event.currentTarget.dataset.type == 'logo') {
                  that.setData({
                    shop_head_img: result.result.img_path,
                    shop_img_show: result.result.images_url
                  })
                } else {
                  that.setData({
                    license_img: result.result.img_path,
                    license_img_show: result.result.images_url
                  })
                }
              } else {
                wx.showToast({
                  title: '上传失败，请重新上传',
                  icon: 'none'
                })
              }
            })
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
    this.getShopStatus();
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