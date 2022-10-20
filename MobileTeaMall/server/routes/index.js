var express = require('express');
var router = express.Router();
// 连接数据库
var connection = require('../db/sql')
var user = require('../db/userSql')
// 引入短信sdk
var QcloudSms = require("qcloudsms_js");
const { insertData } = require('../db/userSql');

let jwt = require('jsonwebtoken');

// 引入支付宝配置文件
const alipaySdk = require('../db/alipay');
const AlipayFormData = require('alipay-sdk/lib/form').default;

let axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 查询后端数据接口(搜索展示)
router.get('/api/goods/shopList', function (req, res, next) {
  // 前端给后端的数据   搜索的数据   和   排序的数据
  let [searchName, orderName] = Object.keys(req.query)
  let [name, order] = Object.values(req.query)

  // sql语句
  connection.query('select * from goods_list where name like "%' + name + '%" order by ' + orderName + ' ' + order + '', function (err, results) {
    res.send({
      code: 0,
      data: results
    })
  })
})
//查询商品id 
router.get('/api/goods/id', function (req, res, next) {
  let id = req.query.id;
  connection.query('select * from goods_list where id=' + id + '', function (error, results) {
    if (error) throw error;
    res.json({
      code: 0,
      data: results[0]
    })
  })
})
// 分类的接口
router.get('/api/goods/list', function (req, res, next) {
  res.send({
    code: 0,
    data: [
      {
        // 一级
        id: 0,
        name: "推荐",
        data: [
          {
            // 二级
            id: 0,
            name: '推荐',
            list: [
              // 三级
              {
                id: 0,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 1,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 2,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 3,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 4,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              }

            ]
          }
        ]
      },
      {
        // 一级
        id: 1,
        name: "绿茶",
        data: [
          {
            // 二级
            id: 0,
            name: '绿茶',
            list: [
              // 三级
              {
                id: 0,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 1,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 2,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 3,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 4,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              }
            ]
          }
        ]
      },
      {
        // 一级
        id: 2,
        name: "红茶",
        data: [
          {
            // 二级
            id: 0,
            name: '红茶',
            list: [
              // 三级
              {
                id: 0,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 1,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 2,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 3,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              },
              {
                id: 4,
                name: '铁观音',
                imgUrl: '/images/list1.jpeg'
              }
            ]
          }
        ]
      },
    ]
  })
})
// 密码登录的接口
router.post('/api/login', function (req, res, next) {
  // 后端接收前端传递过来的值
  let params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd
  };
  connection.query(user.queryUserTel(params), function (error, results) {
    // 手机号存在
    if (results.length > 0) {

      // 如果手机号正确，继续查询密码
      connection.query(user.queryUserPwd(params), function (error, results) {
        if (results.length > 0) {
          // 手机和密码都正确
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '登录成功',
              data: results[0]
            }
          })
        } else {
          // 密码不对
          res.send({
            code: 302,
            data: {
              success: false,
              msg: '密码不正确'
            }
          })
        }
      })

    } else {
      // 手机号不存在
      res.send({
        code: 301,
        data: {
          success: false,
          msg: '手机号不存在'
        }
      })
    }
  })
})
// 短信验证码的接口
router.post('/api/code', function (req, res, next) {
  let tel = req.body.phone;

  // 短信应用SDK AppID
  var appid = 1400187558;  // SDK AppID是1400开头

  // 短信应用SDK AppKey
  var appkey = "dc9dc3391896235ddc2325685047edc7";

  // 需要发送短信的手机号码
  var phoneNumbers = [tel];

  // 短信模板ID，需要在短信应用中申请
  var templateId = 285590;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

  // 签名
  var smsSign = "三人行慕课";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

  // 实例化QcloudSms
  var qcloudsms = QcloudSms(appid, appkey);

  // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
  function callback(err, ress, resData) {
    if (err) {
      console.log("err: ", err);
    } else {
      res.send({
        code: 200,
        data: {
          success: true,
          data: ress.req.body.params[0]
        }
      })
    }
  }

  var ssender = qcloudsms.SmsSingleSender();
  //这个变量：params 就是往手机上，发送的短信
  var params = [Math.floor(Math.random() * (9999 - 1000)) + 1000];
  ssender.sendWithParam(86, phoneNumbers[0], templateId,
    params, smsSign, "", "", callback);  // 签名参数不能为空串
})
// 新增一个用户
router.post('/api/addUser', function (req, res, next) {

  let params = {
    userTel: req.body.phone
  }
  //查询用户是否存在
  connection.query(user.queryUserTel(params), function (error, results) {
    if (error) throw error;
    //用户存在
    if (results.length > 0) {
      res.send({
        code: 200,
        data: {
          success: true,
          msg: '登录成功',
          data: results[0]
        }
      })
    } else {
      //不存在，新增一条数据
      connection.query(user.inserData(params), function (err, result) {
        connection.query(user.queryUserTel(params), function (e, r) {
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '登录成功',
              data: r[0]
            }
          })
        })
      })
    }
  })
})
// 注册接口
router.post('/api/register', function (req, res, next) {
  let params = {
    userTel: req.body.phone,
    userPwd: req.body.pwd
  }
  connection.query(user.queryUserTel(params), function (error, results) {
    if (error) throw error;
    //用户存在
    if (results.length > 0) {
      res.send({
        code: 200,
        data: {
          success: true,
          msg: '登录成功',
          data: results[0]
        }
      })
    } else {
      //不存在，新增一条数据
      connection.query(user.insertData(params), function (err, result) {
        connection.query(user.queryUserTel(params), function (e, r) {
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '登录成功',
              data: r[0]
            }
          })
        })
      })
    }
  })

})
// （找回密码）查询用户是否存在
router.post('/api/selectUser', function (req, res, next) {
  let params = {
    userTel: req.body.phone,
  }
  connection.query(user.queryUserTel(params), function (error, results) {
    if (error) throw error;
    //用户存在
    if (results.length > 0) {
      res.send({
        code: 200,
        data: {
          success: true,
          msg: '',
          data: results[0]
        }
      })
    } else {
      //不存在，进行提示
      res.send({
        code: 0,
        data: {
          success: 'false',
          msg: "此用户不存在"
        }
      })
    }
  })

})
// 确认修改密码
router.post('/api/recovery', function (req, res, next) {
  // console.log(req);
  let params = {
    userTel: req.body.phone,
    userPwd: req.body.pwd
  }

  //查询用户是否存在
  connection.query(user.queryUserTel(params), function (error, results) {
    //某一条记录数id
    let id = results[0].id;
    let pwd = results[0].pwd;

    connection.query(`update user set pwd = replace(pwd,'${pwd}','${params.userPwd}') where id = ${id}`, function (err, result) {
      res.send({
        code: 200,
        data: {
          success: true,
          msg: '修改成功'
        }
      })
    })
  })
})
// 加入购物车
router.post('/api/addCart', function (req, res, next) {
  //后端接收前端的参数
  let goodsId = req.body.goodsId;
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
    //用户id
    let uId = results[0].id;

    //查询商品
    connection.query(`select * from goods_list where id=${goodsId}`, function (err, result) {
      let goodsName = result[0].name;
      let goodsPrice = result[0].price;
      let goodsImgUrl = result[0].imgUrl;
      // 查询当前用户在之前是否添加过本商品
      connection.query(`select * from goods_cart where uId = ${uId} and goodsId = ${goodsId}`, function (e, r) {

        //用户之前添加过该商品到购物车 
        if (r.length > 0) {
          // 获取原来的数量
          let num = r[0].goods_num;
          connection.query(`update goods_cart set goods_num = replace(goods_num,${num},${parseInt(num) + 1}) where id = ${r[0].id}`, function (e, datas) {
            res.send({
              data: {
                code: 200,
                success: true,
                msg: '添加成功'
              }
            })
          })
        } else {
          // 该用户之前没有添加过该商品
          connection.query(`insert into goods_cart (uId,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values ("${uId}","${goodsId}","${goodsName}","${goodsPrice}","1","${goodsImgUrl}")`, function (e, r) {
            res.send({
              data: {
                code: 200,
                success: true,
                msg: '添加成功'
              }
            })
          })
        }
      })
    })
  })
})
//查询购物车数据
router.post('/api/selectCart', function (req, res, next) {
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
    //用户id
    let uId = results[0].id;
    //查询购物车
    connection.query(`select * from goods_cart where uId = ${uId}`, function (err, result) {
      res.send({
        data: {
          code: 200,
          success: true,
          data: result
        }
      })
    })
  })
})
// 删除购物车的商品
router.post('/api/deleteGoods', function (req, res, next) {
  let arrId = req.body.arrId;
  for (let i = 0; i < arrId.length; i++) {
    connection.query(`delete from goods_cart where id = ${arrId}`, function (error, results) {
      res.send({
        data: {
          code: 200,
          success: true,
          msg: "删除成功"
        }
      })
    })
  }
})
// 修改购物车中商品数量
router.post('/api/updateNum', function (req, res, next) {
  let id = req.body.id;
  let changeNum = req.body.num;

  connection.query(`select * from goods_cart where id = ${id}`, function (error, results) {
    // 原来的数量
    let num = results[0].goods_num;
    connection.query(`update goods_cart set goods_num = replace(goods_num,${num},${changeNum}) where id = ${id}`, function (err, result) {
      res.send({
        data: {
          code: 200,
          success: true
        }
      })
    })
  })


})
// 新增收获地址
router.post('api/addAddress', function (req, res, next) {
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  //拿到前端给后端传入的数据
  let body = req.body;
  let [name, tel, province, city, county, addressDetail, isDefault, areaCode] = [
    body.name,
    body.tel,
    body.province,
    body.city,
    body.county,
    body.addressDetail,
    body.isDefault,
    body.areaCode
  ];

  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
    //用户id
    let uId = results[0].id;
    //增加一条收货地址

    if (isDefault != 1) {
      connection.query(`insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`, function (err, result) {
        res.send({
          data: {
            code: 200,
            success: true,
            msg: '收货地址添加成功'
          }
        })
      })
    } else {
      // 保证只有一个默认地址
      connection.query(`select * from address where uId = ${uId} and isDefault = ${isDefault}`, function (err, result) {
        if (result.length > 0) {
          let addressId = result[0].id;
          connection.query(`update address set isDefault = replace(isDefault,'1','0') where id = ${addressId}`, function () {
            connection.query(`insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}", "${areaCode}")`, function (e, r) {
              res.send({
                data: {
                  code: 200,
                  success: true,
                  msg: '收货地址添加成功'
                }
              })
            })
          })
        } else {
          connection.query(`insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`, function (err, result) {
            res.send({
              data: {
                code: 200,
                success: true,
                msg: '收货地址添加成功'
              }
            })
          })
        }
      })

    }
  })
})
// 查询用户收货地址
router.post('/api/selectAddress', function (req, res, next) {
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);

  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
    //用户id
    let uId = results[0].id;
    connection.query(`select * from address where uId = ${uId}`, function (err, result) {
      res.send({
        data: {
          code: 200,
          success: true,
          msg: '查询成功',
          data: result
        }
      })
    })
  })
})
// 确认修改收货地址
router.post('/api/updateAddress', function (req, res, next) {
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  //拿到前端给后端传入的数据
  let body = req.body;
  let [id, name, tel, province, city, county, addressDetail, isDefault, areaCode] = [
    body.id,
    body.name,
    body.tel,
    body.province,
    body.city,
    body.county,
    body.addressDetail,
    body.isDefault,
    body.areaCode
  ];
  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
    //用户id
    let uId = results[0].id;
    //对应查询到0 或者 1 有没有默认收货地址
    connection.query(`select * from address where uId = ${uId} and isDefault = ${isDefault}`, function (err, result) {
      if (result.length > 0) {
        let addressId = result[0].id;
        connection.query(`update address isDefault = replace(isDefault,'1','0') where id = ${addressId}`, function (e, r) {
          let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`;
          connection.query(updateSql, [uId, name, tel, province, city, county, addressDetail, isDefault, areaCode], function (errors, datas) {
            res.send({
              data: {
                code: 200,
                success: true,
                msg: '修改成功'
              }
            })
          })
        })
      } else {
        let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`;
        connection.query(updateSql, [uId, name, tel, province, city, county, addressDetail, isDefault, areaCode], function (errors, datas) {
          res.send({
            data: {
              code: 200,
              success: true,
              msg: '修改成功'
            }
          })
        })
      }
    })
  })
})
// 删除地址
router.post('/api/deleteAddress', function (req, res, next) {
  let id = req.body.id;
  connection.query(`delete from address where id = ${id}`, function (req, res, next) {
    res.send({
      data: {
        code: 200,
        success: true,
        msg: "删除成功"
      }
    })
  })
})

/* 支付相关 */
// 生成一个订单
router.post('/api/addOrder', function (req, res, next) {
  // token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  // 前端给后端的数据
  let goodsArr = req.body.arr;
  // 生成订单号  也就是数据库中order_id  规则为：时间戳 + 6位随机数
  // 补零函数
  function setTimeDateFmt(s) {
    return s < 10 ? '0' + s : s;
  }
  // 生成订单号
  function randomNumber() {
    const now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    month = setTimeDateFmt(month);
    day = setTimeDateFmt(day);
    hour = setTimeDateFmt(hour);
    minutes = setTimeDateFmt(minutes);
    seconds = setTimeDateFmt(seconds);

    let orderCode = now.getFullYear().toString() + month.toString() + day.toString() + hour.toString() + minutes.toString() + seconds.toString() + (Math.round(Math.random() * 1000000)).toString();
    return orderCode;

  }

  /*   
  未支付：1
  待支付：2
  支付成功：3
  支付失败：4 | 0 
  */

  // 订单商品名称列表
  let goodsName = [];
  // 订单商品总金额
  let goodsPrice = 0;
  // 订单商品总数量
  let goodsNum = 0;
  // 订单号
  let orderId = randomNumber();

  goodsArr.forEach(v => {
    goodsName.push(v.goods_name);
    goodsPrice += v.goods_num * v.goods_price;
    goodsNum += parseInt(v.goods_num);
  })

  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
    // 查询用户ID
    let uId = results[0].id;
    connection.query(`insert into store_order (order_id,goods_name,goods_price,goods_num,order_status,uId) values ('${orderId}','${goodsName}','${goodsPrice}','${goodsNum}','1',${uId})`, function () {
      // 根据订单号进行查询
      connection.query(`select * from store_order where uId = ${uId} and order_id='orderId'`, function (err, result) {
        res.send({
          data: {
            success: true,
            code: 200,
            data: result
          }
        })
      })
    })
  })

})
// 查询订单
router.post('/api/selectOrder', function (req, res, next) {
  // 接收前端给后端的订单号
  let orderId = req.body.orderId;
  connection.query(`select * from store_order where order_id='${orderId}'`, function (err, result) {
    res.send({
      data: {
        success: true,
        code: 200,
        data: result
      }
    })
  })
})
// 提交订单（修改订单状态）
router.post('/api/submitOrder', function (req, res, next) {
  // token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  // 接收前端传过来的数据
  let orderId = req.body.orderId;
  let shopArr = req.body.shopArr;

  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
    // 用户id
    let uId = results[0].id;
    connection.query(`select * from store_order where uId = ${uId} and order_id = ${orderId}`, function (err, result) {
      // 订单的数据库id
      let id = result[0].id;
      // 修改订单状态 1 ----> 2
      connection.query(`update store_order set order_status = replace(order_status, '1', '2') where id = ${id}`, function (e, r) {
        //购物车数据删除
        shopArr.forEach(v => {
          connection.query(`delete from goods_cart where id = ${v}`, function () {

          })
        })
        // 不可以放到循环里面，会一直返回
        res.send({
          data: {
            code: 200,
            success: true
          }
        })
      })
    })
  })
})
// 发起支付
router.post('/api/payment', function (req, res, next) {
  // 接收前端给后端的数据, 订单号   商品总价  购买商品的名称
  let orderId = req.body.orderId;
  let price = req.body.price;
  let name = req.body.name;

  // 对接支付宝sdk
  const formData = new AlipayFormData();
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get');
  // 支付时信息
  formData.addField('bizContent', {
    outTradeNo: orderId,  //订单号
    productCode: 'FAST_INSTANT_TRADE_PAY',  //无须修改
    totalAmount: price,  //价格
    subject: name,  //商品名称
  });
  // 支付成功或者失败的链接
  formData.addField('returnUrl', 'http://localhost:8000/payment');
  // 返回一个promise对象
  const result = alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData: formData },
  );
  // 对接支付宝成功，支付宝方返回的数据
  result.send(resp => {
    res.send({
      code: 200,
      success: true,
      msg: '支付中',
      paymentUrl: resp
    })
  })

})
// 支付状态
router.post('/api/successPayment', function (req, res, next) {
  // token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  // 订单号
  let out_trade_no = req.body.out_trade_no;
  let trade_no = req.body.trade_no;
  // 支付宝配置  后端与支付宝进行比对
  const formData = new AlipayFormData();
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get');
  // 支付时信息
  formData.addField('bizContent', {
    out_trade_no,
    trade_no
  });
  // 返回一个promise对象
  const result = alipaySdk.exec(
    'alipay.trade.query',
    {},
    { formData: formData },
  );

  result.then(
    resData => {
      axios({
        method: 'GET',
        url: resData
      }).then(
        data => {
          let responseCode = data.data.alipay_trade_query_response;
          if (responseCode == '10000') {
            switch (responseCode.trade_status) {
              case 'WAIT_BUYER_PAY':
                res.send({
                  data: {
                    code: 0,
                    data: {
                      msg: '有交易记录，没付款'
                    }
                  }
                })
                break;
              case 'TRADE_CLOSED':
                res.send({
                  data: {
                    code: 1,
                    data: {
                      msg: '交易关闭'
                    }
                  }
                })
                break;
              case 'TRADE_FINISHED':
                //查询用户
                connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
                  // 用户id
                  let uId = results[0].id;
                  connection.query(`select * from store_order where uId = ${uId} and order_id = ${out_trade_no}`, function (err, result) {
                    // 获取订单id
                    let id = result[0].id;
                    // 订单状态  2 ---> 3
                    connection.query(`update store_order set order_status = replace(order_status,'2','3') where id = ${id}`, function () {
                      res.send({
                        data: {
                          code: 2,
                          data: {
                            msg: '交易完成'
                          }
                        }
                      })
                    })
                  })
                })
                break;
              case 'TRADE_SUCCESS':
                connection.query(`select * from user where tel = ${tokenObj.tel}`, function (error, results) {
                  //用户id
                  let uId = results[0].id;
                  connection.query(`select * from store_order where uId = ${uId} and order_id = ${out_trade_no}`, function (err, result) {
                    let id = result[0].id;
                    //订单的状态修改掉2==》3
                    connection.query(`update store_order set order_status = replace(order_status,'2','3') where id = ${id}`, function () {
                      res.send({
                        data: {
                          code: 2,
                          data: {
                            msg: '交易完成'
                          }
                        }
                      })
                    })
                  })
                })
                break;
            }
          } else if (responseCode.code == '40004') {
            res.send({
              data: {
                code: 4,
                msg: '交易不存在'
              }
            })
          }
        }
      ).catch(err => {
        res.send({
          data: {
            code: 500,
            msg: '交易失败',
            err
          }
        })
      })
    }
  )




})
/* 支付相关  */



// 首页推荐的数据
router.get('/api/index_list/0/data/1', function (req, res, next) {
  res.send({
    code: 0,
    data: {
      topBar: [
        { id: 0, label: "推荐" },
        { id: 1, label: "大红袍" },
        { id: 2, label: "铁观音" },
        { id: 3, label: "普洱" },
        { id: 4, label: "茶具" },
      ],
      data: [
        // 这是swiper
        {
          id: 0,
          type: 'swiperList',
          data: [
            { id: 0, imgUrl: './images/swiper1.jpeg' },
            { id: 1, imgUrl: './images/swiper2.jpeg' },
            { id: 2, imgUrl: './images/swiper3.jpeg' },
          ]
        },
        // 这是icons
        {
          id: 1,
          type: 'iconsList',
          data: [
            { id: 1, title: "自饮茶", imgUrl: './images/icons1.png' },
            { id: 2, title: "茶具", imgUrl: './images/icons2.png' },
            { id: 3, title: "茶礼盒", imgUrl: './images/icons3.png' },
            { id: 4, title: "领福利", imgUrl: './images/icons4.png' },
            { id: 5, title: "官方认证", imgUrl: './images/icons5.png' },
          ]
        },
        // 爆款推荐
        {
          id: 2,
          type: 'recommendList',
          data: [
            { id: 1, name: "龙井1号", content: "鲜爽甘醇 口粮首选", price: "68", imgUrl: "./images/recommend.jpeg" },
            { id: 2, name: "龙井1号", content: "鲜爽甘醇 口粮首选", price: "68", imgUrl: "./images/recommend.jpeg" },
          ]
        },
        // 猜你喜欢
        {
          id: 3,
          type: 'likeList',
          data: [
            { id: 1, imgUrl: './images/goods1.jpg', name: "第三届武夷山茶叶交易会暨先垫杯-优质奖肉桂160g", price: 238 },
            { id: 2, imgUrl: './images/goods3.jpg', name: "第三届武夷山茶叶交易会暨先垫杯-优质奖肉桂160g", price: 26 },
            { id: 3, imgUrl: './images/goods4.jpg', name: "第三届武夷山茶叶交易会暨先垫杯-优质奖肉桂160g", price: 118 },
            { id: 4, imgUrl: './images/goods4.jpg', name: "明前春茶  绿茶", price: 200 },
            { id: 5, imgUrl: './images/goods2.jpg', name: "明前春茶  红茶", price: 150 },
          ]
        },
      ]
    }
  })
});
// 大红袍的数据
router.get('/api/index_list/1/data/1', function (req, res, next) {
  res.send({
    code: 1,
    data: [
      {
        id: 1,
        type: "AdList",
        data: [
          {
            id: 1,
            imgUrl: './images/dhp.jpeg'
          },
          {
            id: 2,
            imgUrl: './images/dhp.jpeg'
          }
        ]
      },
      {
        id: 2,
        type: 'likeList',
        data: [
          { id: 1, imgUrl: './images/like.jpeg', name: "建盏茶具套装 红色芝麻毫 12件套", price: 299 },
          { id: 2, imgUrl: './images/like.jpeg', name: "建盏茶具套装 红色芝麻毫 12件套", price: 299 },
          { id: 3, imgUrl: './images/like.jpeg', name: "建盏茶具套装 红色芝麻毫 12件套", price: 299 },
        ]
      },
    ]
  })
});
// 铁观音数据
router.get('/api/index_list/2/data/1', function (req, res, next) {
  res.send({
    code: 1,
    data: [
      {
        id: 1,
        type: "AdList",
        data: [
          {
            id: 1,
            imgUrl: './images/tgy.jpeg'
          },
          {
            id: 2,
            imgUrl: './images/tgy.jpeg'
          }
        ]
      },
      {
        id: 2,
        type: 'likeList',
        data: [
          { id: 1, imgUrl: './images/like.jpeg', name: "建盏茶具套装 红色芝麻毫 12件套", price: 299 },
          { id: 2, imgUrl: './images/like.jpeg', name: "建盏茶具套装 红色芝麻毫 12件套", price: 299 },
          { id: 3, imgUrl: './images/like.jpeg', name: "建盏茶具套装 红色芝麻毫 12件套", price: 299 },
        ]
      },
    ]
  })
});
module.exports = router;