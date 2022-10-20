// 验证数据库中的用户相关内容
const User = {
    // 查询手机号
    queryUserTel(option) {
        return 'select * from user where tel = ' + option.userTel + '';
    },
    // 查询密码
    queryUserPwd(option) {
        return 'select * from user where (tel = ' + option.userTel + ') and pwd = ' + option.userPwd + '';
    },
    // 新增加一条数据
    insertData(option) {
        let userTel = option.userTel;
        let userPwd = option.userPwd || '666666';

        //引入token包
        let jwt = require('jsonwebtoken');
        //用户信息
        let payload = { tel: userTel };
        //口令
        let secret = 'zhang';
        //生成token,最后一个参数为token过期时间
        let token = jwt.sign(payload, secret, {
            // token过期时间为60s
            expiresIn: 60
        });

        return 'insert into user (tel,pwd,imgUrl,nickName,token) values ("' + userTel + '","' + userPwd + '","/images/user.jpeg","' + userTel + '","' + token + '")';
    }
}

exports = module.exports = User