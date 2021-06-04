// 钉钉推送
export async function dingPush(that) {
    const res = await that.$http.get('http://192.168.6.214:8015/TaskNotice/SendNotice?custName='+that.CustName+'&usermobile='+that.myPhoneNum);
    return res;
}