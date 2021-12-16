<template>
  <div class="chat">
    <!-- <van-nav-bar
      class="nav_bar_chat"
      safe-area-inset-top
      title="客服留言"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    /> -->
    <div class="chat_content">
      <div class="frombox">
        <div class="group">
          <label for="">问题描述</label>
          <van-field v-model="msg" placeholder="请输入问题" />
        </div>
        <div class="group">
          <label for="">联系方式</label>
          <van-field v-model="phone" type="tel" placeholder="请输入手机号" />
        </div>
        <div class="area_box">
          <label for="">补充内容</label>
          <van-field
            class="testarea_s"
            v-model="details"
            rows="8"
            type="textarea"
            placeholder="请输入要补充的内容"
          />
        </div>
        <div class="area_box">
          <label for="">上传图片</label>
          <!-- <el-upload
                      multiple
                      class="uploader_box"
                      list-type="picture-card"
                      action="/BasicData/UploadFiles"
                      :show-file-list="true"
                      :limit="3"
                      :file-list="fileList"
                      :on-success="handleAvatarSuccess">
                      <img class="upload_icon" :src="imgs" alt="" >
                      <div class="upload_tips">上传图片</div>
                  </el-upload>  -->
          <van-uploader
            class="upload_box"
            v-model="fileList"
            multiple
            :max-count="6"
            :before-read="handleAvatarSuccess"
          />
        </div>

        <van-button class="btn" type="default" round @click="submitMsg()"
          >确定</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessage, imgup } from '@/api/leaveMessage'
export default {
  data() {
    return {
      msg: '', // 内容
      phone: '', // 手机号
      details: '', //详情
      id: '',
      imgs: [],
      fileList: [],
      imgList: [],
    }
  },
  created() {
    this.id = this.$route.query.id
  },
  mounted() {},
  methods: {
    // 返回
    onClickLeft() {},
    // 确定
    submitMsg() {
      if (this.msg == '') {
        this.$toast.fail('内容不能为空')
      } else {
        if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.phone)) {
          this.$toast.fail('手机号码有误请重新输入')
        } else {
          sendMessage(this).then((res) => {
            console.log(res)
            this.details = ''
            this.phone = ''
            this.msg = ''
            this.fileList = []
            this.imgs = []
          })
        }
      }
    },
    // 图片上传
    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(file)
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let myFormdata = new FormData()
          myFormdata.set('file', res[i])
          this.imgList = myFormdata
          imgup(this).then((res) => {
            let imgUrl =
              'https://images.weserv.nl/?url=https://files.365lawhelp.com/' +
              res.data.data
            this.fileList.push({ url: imgUrl })
            this.imgs.push(imgUrl)
          })
        }
      } else {
        let oneFormdata = new FormData()
        oneFormdata.set('file', res)
        this.imgList = oneFormdata
        imgup(this).then((res) => {
          let imgUrl2 =
            'https://images.weserv.nl/?url=https://files.365lawhelp.com/' +
            res.data.data
          this.fileList.push({ url: imgUrl2 })
          this.imgs.push(imgUrl2)
        })
      }

      console.log(this.imgs)
    },
  },
}
</script>

<style scoped>
/* .nav_bar_chat {
  position: fixed;
  width: 100vw;
  height: 6.3vh;
  line-height: 6.3vh;
}
.chat_content {
  width: 100%;
  height: 93.7vh;
  background-color: #fff;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 6.3vh;
} */
.frombox {
  margin: 20px;
}
.group {
  border-bottom: 1px solid #ccc;
  margin-top: 15px;
}
.area_box {
  margin-top: 15px;
}
.label {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #000000;
  opacity: 0.9;
}
.testarea_s {
  background: #f3f3f3;
  border-radius: 6px;
  margin-top: 15px;
}
.btn {
  width: 100%;
  background: linear-gradient(-5deg, #006edc 0%, #2698ef 100%);
  color: #fff;
  margin-top: 20px;
}
.van-uploader {
  display: block;
}

.upload_box {
  margin-top: 15px;
}
.upload_tips {
  font-size: 12px;
  color: #b2b2b2;
}
.upload_box >>> .van-uploader__preview-image {
  width: 70px !important;
  height: 70px !important;
}
</style>