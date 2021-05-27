// 留言
export async function sendMessage(that) {
    let data = {
        customerId:that.id,
        msg:that.msg,
        phone:that.phone,
        remarks:that.details,
        images:that.imgs
    }
    const res = await that.$http.post('/MessageOrder/AddMsg',data);
    if(res.data.success == false) {
        that.$toast.fail(res.data.msg);
    }else {
        that.$toast.success(res.data.msg);
       return res;
    }
}
// 评价
export async function AddEvalua(that) {
    const res = await that.$http.get('/Evaluates/AddEvalua?receId='+that.receid+'&satisfaction='+that.data_item.Satisfaction+'&remarks='+that.data_item.Message+'&chatId='+that.assessId);
    if(res.data.success == false) {
        that.$toast.fail(res.data.msg);
    }else {
        that.$toast.success(res.data.msg);
       return res;
    }
}