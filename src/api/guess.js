// 获取猜你喜欢的一级列表
export async function getOneNav(that) {
    const res = await that.$http.get('/Answer/GetOneNav');
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
       return res;
    }
}
// 根据选中的一级获取二级的问题列表或者答案
export async function getONav(that,id) {
    const res = await that.$http.get('/Answer/Reply?id='+id);
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
       return res;
    }
}
// 智能回复（关键字）
export async function getContents(that,val) {
    const res = await that.$http.get('/Knowledge/GetContents?keywords='+val);
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
       return res;
    }
}