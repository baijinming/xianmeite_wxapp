const RQ = require('../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: "请选择地区",
    showPicker: false,
    dqValue: [],
    shwoContent: [],
    addressRegin: [],
    name: '',
    phone: '',
    detailAddr: '',
    is_default: 1,
    address_id: 0,
    switchOpen: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    if (options.id) {
      this.getAddr(options.id)
    }
  },

  // 获取单个地址详情
  getAddr(id) {
    let that = this;
    RQ.postRequest("/api/user/getAddressData", { token: wx.getStorageSync('token'), address_id: id}, function (res) {
      if (res.status == 1) {
        let data = res.result;
        that.setData({
          name: data.consignee,
          phone: data.mobile,
          region: data.province_name + data.city_name + data.district_name,
          addressRegin: [{ id: data.province}, {id: data.city}, {id: data.district}],
          detailAddr: data.address,
          is_default: data.is_default,
          address_id: id,
        })
        if(data.is_default == 0) {
          that.setData({
            switchOpen: false
          })
        }
      }
    })
  },

  // 添加地址
  addAddress() {
    let that = this;
    let nameOk = that.nameOk(this.data.name);
    let phoneOk = that.phoneOk(this.data.phone);
    if (nameOk == false) {
      wx.showToast({
        title: "请检查姓名是否为2-4个中文字符",
        icon: "none"
      });
      return false;
    } else if (phoneOk == false) {
      wx.showToast({
        title: "请填写正确电话号码",
        icon: "none"
      });
      return false;
    } else if (this.data.addressRegin.length < 3) {
      wx.showToast({
        title: "请选择地区",
        icon: "none"
      });
      return false;
    } else if (this.data.detailAddr.length > 80 || this.data.detailAddr.length == 0) {
      wx.showToast({
        title: "详细地址不能为空，不能超过80个字符",
        icon: "none"
      });
      return false;
    }
    let form = {
      token: wx.getStorageSync('token'),
      province: this.data.addressRegin[0].id,
      city: this.data.addressRegin[1].id,
      district: this.data.addressRegin[2].id,
      address_id: this.data.address_id,
      consignee: this.data.name,
      address: this.data.detailAddr,
      mobile: this.data.phone,
      is_default: this.data.is_default
    };
    RQ.postRequest("/api/user/addAddress", form, function (res) {
      if (res.status == 1) {
        wx.navigateBack({
          delta: 1
        });
      }
    })
  },
  // 判断姓名符合要求
  nameOk(s) {
    let correct = true;
    // 长度不超过4,不为空
    if (s.length > 4 || s.length < 2) {
      correct = false;
    }
    // 中文字符
    for (var i = 0; i < s.length; i++) {
      correct = correct && (s.charCodeAt(i) >= 10000);
    }
    return correct;
  },
  // 判断电话符合要求
  phoneOk(s) {
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(s))) {
      return false;
    } else {
      return true;
    }
  },

  // 打开地区选择器
  showPicker() {
    this.setData({
      showPicker: true
    })
    this.getProvince()
  },
  // 关闭地区选择器
  closePicker() {
    this.setData({
      dqValue: [],
      showPicker: false
    })
  },
  // 省市区信息添加
  chooseAddre(event) {
    let dqValue = this.data.dqValue;
    let item = event.currentTarget.dataset.item;
    dqValue.push(item);

    this.setData({
      dqValue: dqValue
    })
    if (dqValue.length == 1) {
      this.getCity()
    } else if (dqValue.length == 2) {
      this.getDistrict()
    } if (dqValue.length == 3) {
      this.setData({
        showPicker: false,
        region: dqValue[0].name + dqValue[1].name + dqValue[2].name,
        addressRegin: dqValue,
        dqValue: []
      })
    }

  },

  // 获取省数据
  getProvince() {
    let that = this;
    RQ.postRequest("/api/user/getFirst", {}, function (res) {
      if (res.status == 1) {
        that.setData({
          shwoContent: res.result
        })
      }
    })
  },
  // 获取市数据
  getCity() {
    let that = this;
    RQ.postRequest("/api/user/getTwo", { id: this.data.dqValue[0].id }, function (res) {
      if (res.status == 1) {
        that.setData({
          shwoContent: res.result
        })
      }
    })
  },
  // 获取区数据
  getDistrict() {
    let that = this;
    RQ.postRequest("/api/user/getThree", { id: this.data.dqValue[1].id }, function (res) {
      if (res.status == 1) {
        that.setData({
          shwoContent: res.result
        })
      }
    })
  },

  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getDetailAddr(e) {
    this.setData({
      detailAddr: e.detail.value
    })
  },

  switchChange(e) {
    let defaultValue = e.detail.value;
    if (defaultValue) {
      this.setData({
        is_default: 1
      })
    } else {
      this.setData({
        is_default: 0
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