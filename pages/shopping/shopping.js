// pages/shopcar/shopcar.js
var request = require("../../utils/request.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    proList: [],
    total: 0,
    checkedAll: false,
    hiddenGoods: true,
    hiddenWrapper: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    this.getCartList();
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
      this.getCartList();
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
    this.getCartList();
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

  getCartList() {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    let params = {
      token: token,
      unique_id: userInfo.openid
    };
    request.postRequest('/api/cart/cartList', params, (msg) => {
      if (msg.status == 1) {
        let result = msg.result;
        let list = result.cartList;
        for (let i = 0; i < list.length; i++) {
          list[i].checked = false;
          let item = list[i].cartList;
          for (let j = 0; j < item.length; j++) {
            item[j].checked = false;
          }
        }
        this.setData({
          list: list,
          hiddenWrapper: false
        });
        console.log(list)
        this.calcAmount();
        wx.stopPullDownRefresh();
      }
    })
  },

  reduce(e) {
    let index = e.target.dataset.index;
    let stindex = e.target.dataset.stindex;
    let list = this.data.list;
    let num = Number(list[stindex].cartList[index].goods_num);
    num--;
    if (num < 1) {
      num = 1;
    }
    list[stindex].cartList[index].goods_num = num;
    this.setData({
      list: list
    });
    this.calcAmount();
  },
  plus(e) {
    let index = e.target.dataset.index;
    let stindex = e.target.dataset.stindex;
    let list = this.data.list;
    let num = Number(list[stindex].cartList[index].goods_num);
    num++;
    list[stindex].cartList[index].goods_num = num;
    this.setData({
      list: list
    });
    this.calcAmount();
  },
  calcAmount() {
    let list = this.data.list;
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].cartList.length; j++) {
        let item = list[i].cartList[j];
        if (item.checked) {
          let num = item.goods_num;
          let price = Number(item.goods_price);
          total += num * price;
        }
      }
    }
    total = total.toFixed(2);

    this.setData({
      total: total
    })

  },
  changeChecked(e) {
    let index = e.target.dataset.index;
    let stindex = e.target.dataset.stindex;
    let list = this.data.list;
    if(index == undefined) {
      list[stindex].checked = !list[stindex].checked;
      for (let i = 0; i < list[stindex].cartList.length; i++) {
        list[stindex].cartList[i].checked = list[stindex].checked
      }
    } else {
      list[stindex].cartList[index].checked = !list[stindex].cartList[index].checked;
    }
    this.setData({
      list: list
    })
    this.calcAmount();
  },
  checkedAllList() {
    let checked = this.data.checkedAll;
    let list = this.data.list;
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      item.checked = !checked;
      for(let j = 0; j < item.cartList.length; j++) {
        item.cartList[j].checked = !checked;
      }
    }
    this.setData({
      checkedAll: !checked,
      list: list
    });
    this.calcAmount();
  },
  delPro(e) {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    let index = e.target.dataset.index;
    let list = this.data.list;
    let arr = [];
    let newArr = [];
    let goodsId = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      for (let j = 0; j < item.cartList.length; j++) {
        if (item.cartList[j].checked) {
          arr.push(i);
          goodsId.push(item.cartList[j].goods_id)
        } else {
          newArr.push(item);
        }
      }
    }

    let params = {
      token: token,
      goods_id: goodsId
    };

    wx.showModal({
      title: '确认删除选中商品？',
      success(res) {
        if (res.confirm) {
          request.postRequest('/api/cart/del_cart', params, (msg) => {
            if (msg.status == 1) {
              wx.showToast({
                title: '删除成功',
              });
              setTimeout(() => {
                that.getCartList();
              }, 1000)
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getList: function () {
    request.getRequest('/api/goods/guessYouLike', '', (msg) => {
      let result = msg.result;
      this.setData({
        proList: result,
        hiddenGoods: false
      })
    })
  },
  goPay: function () {
    let list = this.data.list;
    let data = [];
    let hasChecked = false;
    for (let i = 0; i < list.length; i++) {
      for(let j = 0; j < list[i].cartList.length; j++) {
        let item = list[i].cartList[j];
        if (item.checked) {
          let obj = {};
          obj = {
            goodsNum: item.goods_num,
            selected: 1,
            cartID: item.id,
          };
          data.push(obj);
          hasChecked = true
        } else {
          let obj = {};
          obj = {
            goodsNum: item.goods_num,
            selected: 0,
            cartID: item.id,
          };
          data.push(obj);
        }
      }
    }
    if (!hasChecked) {
      wx.showToast({
        title: '请选择需要结算的商品',
        icon: 'none'
      });

      return false;
    }

    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    let params = {
      token: token,
      unique_id: userInfo.openid
    };

    params.cart_form_data = JSON.stringify(data);

    request.postRequest('/api/cart/cartList', params, (msg) => {
      if (msg.status == 1) {
        wx.navigateTo({
          url: '/pages/confirmOrder/confirm',
        })
      }
    })

  }
});