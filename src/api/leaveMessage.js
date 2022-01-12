// 留言
export async function sendMessage(that) {
  let data = {
    customerId: that.id,
    msg: that.msg,
    phone: that.phone,
    remarks: that.details,
    images: that.imgs
  };
  const res = await that.$http.post("/MessageOrder/AddMsg", data);
  if (res.data.success == false) {
    that.$toast.fail(res.data.msg);
  } else {
    that.$toast(res.data.msg);
    return res;
  }
}
// 评价
export async function AddEvalua(that) {
  const res = await that.$http.get(
    "/Evaluates/AddEvalua?receId=" +
      that.kfinfo.Id +
      "&satisfaction=" +
      that.data_item.Satisfaction +
      "&remarks=" +
      that.data_item.Message
  );
  if (res.data.success == false) {
    that.$toast.fail(res.data.msg);
  } else {
    that.$toast.success(res.data.msg);
    return res;
  }
}
// 图片上传
export async function imgup(that) {
  const res = await that.$http.post("/BasicData/UploadFiles", that.imgList);
  if (res.data.success == false) {
    that.$toast.fail(res.data.msg);
  } else {
    return res;
  }
}
