// 钉钉推送
export async function dingPush(that) {
    const res = await that.$http.get('http://onlineadmin.365lawhelp.com/TaskNotice/SendNotice?custName='+that.CustName+'&usermobile='+that.myPhoneNum);
    return res;
}