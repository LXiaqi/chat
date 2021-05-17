import qs from	'qs'
// 会话列表  0是当前会话1是历史会话
export async function chatList(that) {
    const res = await that.$http.get('/ChatHistory/GetChatHistoryList?Type='+that.chatType+'&customerName='+that.search_user);
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
       return res;
    }
}
// 会话详情内容（当前会话）
export async function conversation(that) {
    const res = await that.$http.get('/ChatHistory/GetChatHistoryRecord?start='+that.page+'&length='+that.pagenum+'&customerId='+that.userInformationId+'&userId='+that.user_id);
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
       return res;
    }
}
// 选中会话之后查看对方基本信息
export async function getCustomerInfo(that) {
    const res = await that.$http.get('/Customer/GetCustomerInfo?CustomerId='+that.userInformationId);
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
       return res;
    }
}
// 获取用户登录信息
export async function GetUserData(that) {
    const res = await that.$http.get('/Communication/GetUserData?custId=1601');
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
       return res;
    }
}
// 分配客服id
export async function distribution(that) {
    const res = await that.$http.get('/Communication/GetUserId?custid='+that.send_id);
    if(res.data.success == false) {
        that.$message.error(res.data.msg);
    }else {
       return res;
    }
}
