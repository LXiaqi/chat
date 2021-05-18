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
