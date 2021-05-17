import qs from 'qs';
// 用户登录
export async function login(that) {
    const res = await that.$http.get('/Login/Login?userName='+that.username+'&pwd='+that.password);
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
        that.$message({
            message: '登录成功',
            type: 'success'
          });
       return res;
    }
}
// 用户注册
export async function userRegister(that) {
    let data = {
        UserName:that.username,
        Pwd:that.password,
        Sex:that.gender
    }
    const res = await that.$http.post('/Register/Register',data);
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
        that.$message({
            message: res.data.msg,
            type: 'success'
          });
       return res;
    }
}
