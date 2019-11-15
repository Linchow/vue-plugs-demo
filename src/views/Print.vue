<template>
  <div class="activityPlan-box">
    <ul class="tab clearfix">
      <li :class="{'on': activeNum == 1}" @click="changeActiveNum(1)">按字母排序</li>
      <li :class="{'on': activeNum == 2}" @click="changeActiveNum(2)">按分组排序</li>
      <li :class="{'on': activeNum == 3}" @click="changeActiveNum(3)">按部门排序</li>
    </ul>
    <div class="man-list">
      <div v-show="activeNum == 1">
        <el-checkbox-group v-model="studentChecked" @change="studentChange">
          <el-checkbox
            v-for="(item, index) in studentList"
            :key="index"
            :label="item"
          >{{item.userName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-show="activeNum == 2">
        <div v-for="(item, index) in stuGroupArr" :key="index">
          <div class="group">
            <span class="line"></span>
            <span class="el-checkbox">{{item}}</span>
          </div>
          <el-checkbox-group
            style="padding-left: 25px;"
            v-model="studentChecked"
            @change="studentChange"
          >
            <el-checkbox
              v-for="(item2, index2) in stuGroupObj[item]"
              :key="index2"
              :label="item2"
            >{{item2.userName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div v-show="activeNum == 3">
        <div v-for="(item, index) in stuDepArr" :key="index">
          <div class="group">
            <span class="line"></span>
            <span class="el-checkbox">{{item}}</span>
            <!-- <el-checkbox @change="(val) => stuDepChange(val, item)">{{item}}</el-checkbox> -->
          </div>
          <el-checkbox-group
            style="padding-left: 25px;"
            v-model="studentChecked"
            @change="studentChange"
          >
            <el-checkbox
              v-for="(item2, index2) in stuDepObj[item]"
              :key="index2"
              :label="item2"
            >{{item2.userName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="select-box">
      选择：
      <span class="opt-select" @click="selectAll(true)">全选</span> -
      <span @click="selectAll(false)" class="opt-select">取消</span>
    </div>
    <div class="select-box">
      打印无姓名名牌
      <input type="number" v-model="unNameNum" min="0" class="ipt" /> 张
      <el-tooltip
        class="item"
        effect="light"
        content="不确定人员时，可以先打印：logo、签到/评估/考试二维码、自定义图片；确定人员后再手工填写。"
        placement="right"
      >
        <span style="color: #FFAA2F" class="el-icon-question"></span>
      </el-tooltip>
    </div>
    <p class="card-title">设计名牌内容</p>
    <div class="card-box">
      <span class="card-item-title">LOGO设置</span>
      <el-radio-group class="radio-box" v-model="logo">
        <el-radio :label="1">公司logo</el-radio>
        <el-radio :label="2">其他logo</el-radio>
      </el-radio-group>
      <div class="btn-logo-box">
        <div v-if="logo == 1">
          <img v-if="logo_1" :src="logo_1" alt />
        </div>
        <div v-else>
          <img v-if="logo_2" :src="logo_2" alt />
        </div>
      </div>
    </div>
    <div class="card-box" style="margin-bottom: 80px;">
      <span class="card-item-title">名牌正面</span>
      <el-checkbox-group class="check-box" v-model="cardOn">
        <el-checkbox label="logo">logo</el-checkbox>
        <el-checkbox label="name">公司</el-checkbox>
        <el-checkbox label="userName" disabled>姓名</el-checkbox>
        <el-checkbox label="orgId">部门</el-checkbox>
        <el-checkbox label="position">职务</el-checkbox>
        <el-checkbox label="zu">组名</el-checkbox>
        <select class="select" v-model="fontSize">
          <option value="60">60</option>
          <option value="84">84</option>
          <option value="96">96</option>
          <option value="108">108</option>
          <option value="120">120</option>
        </select>
      </el-checkbox-group>
      <div class="priview" ref="print">
        <span style="font-size: 14px;color: #999;">预览：</span>
        <div class="priview-box">
          <p style="height: 32px;">
            <img
              v-if="cardOn.indexOf('logo') > -1"
              :src="logo == 1 ? logo_1 : logo_2"
              alt
              style="margin-right: 5px;"
            />
            <span v-if="cardOn.indexOf('name') > -1">{{compayName}}</span>
          </p>
          <p
            class="name"
            :style="{fontSize: Number(fontSize) * 0.85 + 'px'}"
          >{{studentChecked[index] && studentChecked[index].userName || ''}}</p>
          <p class="bottom-box">
            <span
              v-if="cardOn.indexOf('orgId') > -1"
            >{{studentChecked[index] && studentChecked[index].orgId || ''}}</span>
            <span
              v-if="cardOn.indexOf('position') > -1"
            >{{studentChecked[index] && studentChecked[index].position || ''}}</span>
            <span
              v-if="cardOn.indexOf('zu') > -1"
            >{{studentChecked[index] && studentChecked[index].zu || ''}}</span>
          </p>
        </div>
        <div class="prevNext-box">
          点击箭头可查看不同人的名牌效果
          <span
            @click="prev()"
            :class="['el-icon-arrow-left', index <= 0 ? '' : 'on']"
          ></span>
          <span
            @click="next()"
            :class="['el-icon-arrow-right', index >= studentChecked.length - 1 ? '' : 'on']"
          ></span>
        </div>
        <span style="font-size: 14px;color: #999;visibility: hidden;">预览：</span>
        <div class="priview-box">
          <p style="height: 32px;">
            <img
              v-if="cardOff.indexOf('logo') > -1"
              :src="logo == 1 ? logo_1 : logo_2"
              alt
              style="margin-right: 5px;"
            />
            <span v-if="cardOff.indexOf('name') > -1">{{compayName}}</span>
          </p>
          <p
            class="name"
            v-if="cardOff.indexOf('userName') > -1"
            :style="{fontSize: Number(fontSize) * 0.85 + 'px'}"
          >{{studentChecked[index] && studentChecked[index].userName || ''}}</p>
          <div class="img-box" v-else>
            <img v-if="cardOff.indexOf('sign') > -1" :src="qrCodeList.signQrCode" alt />
            <img v-if="cardOff.indexOf('assess') > -1" :src="qrCodeList.assessQrCode" alt />
            <img v-if="cardOff.indexOf('survey') > -1" :src="qrCodeList.surveyQrCode" alt />
            <img v-if="cardOff.indexOf('custom') > -1" :src="qrCodeList.realCustomUrl || null" alt />
          </div>
          <p class="bottom-box">
            <span
              v-if="cardOff.indexOf('orgId') > -1"
            >{{studentChecked[index] && studentChecked[index].orgId || ''}}</span>
            <span
              v-if="cardOff.indexOf('position') > -1"
            >{{studentChecked[index] && studentChecked[index].position || ''}}</span>
            <span
              v-if="cardOff.indexOf('zu') > -1"
            >{{studentChecked[index] && studentChecked[index].zu || ''}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="card-box" style="margin-bottom: 160px;">
      <span class="card-item-title">名牌反面</span>
      <el-checkbox-group @change="cardChange" v-model="cardOff">
        <div class="check-box" style="display: inline-block;vertical-align: top;">
          <el-checkbox label="logo">logo</el-checkbox>
          <el-checkbox label="name">公司</el-checkbox>
          <el-checkbox label="userName">姓名</el-checkbox>
          <el-checkbox label="orgId">部门</el-checkbox>
          <el-checkbox label="position">职务</el-checkbox>
          <el-checkbox label="zu">组名</el-checkbox>
        </div>
        <div class="check-box" style="display: inline-block;width: 150px;">
          <el-checkbox label="sign">签到二维码</el-checkbox>
          <el-checkbox label="assess">评估二维码</el-checkbox>
          <el-checkbox label="survey">调研二维码</el-checkbox>
          <el-checkbox label="custom" style="margin-right: 15px;">自定义图片</el-checkbox>
          <label class="btn-edit" for="customUrl" v-show="cardOff.indexOf('custom') > -1">修改</label>
          <span
            v-show="cardOff.indexOf('custom') > -1"
            style="font-size: 12px;color: #999;"
          >（建议尺寸200*200像素）</span>
          <input
            type="file"
            id="customUrl"
            accept="image/*"
            style="display:none;"
          />
        </div>
      </el-checkbox-group>
    </div>
    <div class="card-bottom">
      <button class="btn-print" @click="openPrint">
        <i class="el-icon-printer"></i>
        <span style="margin-left: 5px;">预览 / 打印</span>
      </button>
      <p class="tip-print">每人1张，用A4纸张打印</p>
    </div>
    <el-dialog :visible.sync="printVisiable" width="900px">
      <p slot="title" class="module-title">预览</p>
      <div class="print-box" ref="print" id="PDF">
        <div
          class="np-box page-break np-show"
          :class="[index == current - 1 ? 'np-current' : '',isPrintAll ? 'all' : '']"
          v-for="(item, index) in printList"
          :key="index"
        >
          <div class="print-height"></div>
          <div class="priview-box rotation">
            <p class="logoOrg">
              <img
                class="logoImg"
                v-if="cardOn.indexOf('logo') > -1"
                :src="logo == 1 ? logo_1 : logo_2"
                alt
                style="margin-right: 5px;"
              />
              <span v-if="cardOn.indexOf('name') > -1">{{compayName}}</span>
            </p>
            <p class="name" :style="{fontSize: fontSize + 'px'}">{{item && item.userName || ''}}</p>
            <p class="bottom-box">
              <span v-if="cardOn.indexOf('orgId') > -1">{{item && item.orgId || ''}}</span>
              <span v-if="cardOn.indexOf('position') > -1">{{item && item.position || ''}}</span>
              <span v-if="cardOn.indexOf('zu') > -1">{{item && item.zu || ''}}</span>
            </p>
          </div>
          <div class="priview-box">
            <p class="logoOrg">
              <img
                class="logoImg"
                v-if="cardOff.indexOf('logo') > -1"
                :src="logo == 1 ? logo_1 : logo_2"
                alt
                style="margin-right: 5px;"
              />
              <span v-if="cardOff.indexOf('name') > -1">{{compayName}}</span>
            </p>
            <p
              class="name"
              :style="{fontSize: fontSize + 'px'}"
              v-if="cardOff.indexOf('userName') > -1"
            >{{item && item.userName || ''}}</p>
            <div class="img-box" v-else>
              <img v-if="cardOff.indexOf('sign') > -1" :src="qrCodeList.signQrCode" alt />
              <img v-if="cardOff.indexOf('assess') > -1" :src="qrCodeList.assessQrCode" alt />
              <img v-if="cardOff.indexOf('survey') > -1" :src="qrCodeList.surveyQrCode" alt />
              <img v-if="cardOff.indexOf('custom') > -1" :src="qrCodeList.realCustomUrl || null" alt />
            </div>
            <p class="bottom-box">
              <span v-if="cardOff.indexOf('orgId') > -1">{{item && item.orgId || ''}}</span>
              <span v-if="cardOff.indexOf('position') > -1">{{item && item.position || ''}}</span>
              <span v-if="cardOff.indexOf('zu') > -1">{{item && item.zu || ''}}</span>
            </p>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px;margin-left: 140px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="current"
          :page-size="1"
          layout="slot, prev, pager, next"
          :total="total"
        >
          <span
            style="font-weight:normal;margin-right: 10px;color: #606266;"
          >每页显示1条，共{{total}}页，{{total}}条记录</span>
        </el-pagination>
      </div>
      <div class="btn-box">
        <el-button size="small" :loading="printLoading" type="primary" @click="printOk(true)">打印所有页</el-button>
        <el-button size="small" :loading="printLoading" type="primary" @click="printOk(false)">打印本页</el-button>
        <el-button size="small" :loading="downLoading" type="primary" @click="downPDF(true)">下载所有页</el-button>
        <el-button size="small" :loading="downLoading" type="primary" @click="downPDF(false)">下载本页</el-button>
      </div>
      <p class="bottom-tip">温馨提示：因浏览器不同，打印出的效果可能不同，建议下载后再进行打印</p>
    </el-dialog>
  </div>
</template>

<script>
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
export default {
  name: "card",
  data() {
    return {
      studentList: [],
      stuGroupArr: [],
      stuGroupObj: {},
      stuDepArr: [],
      stuDepObj: {},
      index: 0,
      studentChecked: [],
      activeNum: 1,
      logo: 1,
      cardOn: ["userName"],
      fontSize: "84",
      cardOff: [],
      unNameNum: 0,
      qrCodeList: {},
      logo_1: require('@/assets/images/logo.png'),
      logo_2: require('@/assets/images/vue.png'),
      printVisiable: false,
      rules: {
        name: [
          { max: 128, message: "长度应小于等于128个字符", trigger: "blur" }
        ]
      },
      printList: [],
      current: 1,
      total: 0,
      isPrintAll: false,
      downLoading: false,
      printLoading: false,
      iframe: null,
      iframeWin: null,
      compayName: "华拓金服",
    };
  },
  created() {
    this.getStudentList();
    this.getQrCode();
    this.printInit();
  },
  destroyed() {
    document.body.removeChild(this.iframe);
  },
  methods: {
    getQrCode(){
      this.qrCodeList = {
        signQrCode: require('@/assets/images/qrcode.png'),
        assessQrCode: require('@/assets/images/qrcode.png'),
        surveyQrCode: require('@/assets/images/qrcode.png'),
        realCustomUrl: require('@/assets/images/qrcode.png'),
      }
    },
    changeActiveNum(num) {
      if (num == this.activeNum) {
        return;
      }
      this.activeNum = num;
    },
    selectAll(flag) {
      if (flag) {
        this.studentChecked = this.studentList;
      } else {
        this.studentChecked = [];
      }
    },
    studentGroupFilter(list) {
      var tempArr = ["未分组"],
        tempObj = {
          未分组: []
        };
      list.forEach(item => {
        if (item.zu) {
          if (tempArr.indexOf(item.zu) == -1) {
            tempArr.push(item.zu);
            tempObj[item.zu] = [];
          }
          tempObj[item.zu].push(item);
        } else {
          tempObj["未分组"].push(item);
        }
      });
      this.stuGroupArr = tempArr;
      this.stuGroupObj = tempObj;
    },
    studentDepFilter(list) {
      var tempArr = ["待归档"],
        tempObj = {
          "待归档": []
        };
      list.forEach(item => {
        if (item.orgId) {
          if (tempArr.indexOf(item.orgId) == -1) {
            tempArr.push(item.orgId);
            tempObj[item.orgId] = [];
          }
          tempObj[item.orgId].push(item);
        } else {
          tempObj["待归档"].push(item);
        }
      });
      this.stuDepArr = tempArr;
      this.stuDepObj = tempObj;
    },
    stuDepChange(val, item) {
      this.stuDepObj[item].forEach(v => {
        val
          ? this.studentChecked.push(v)
          : this.studentChecked.splice(this.studentChecked.indexOf(item), 1);
      });
    },
    getStudentList() {
      this.studentList = [
        {
          userName: '张三',
          orgId: '互联网产品研发部',
          position: '前端工程师',
          zu: '一组'
        },
        {
          userName: '王贝贝',
          orgId: 'AI研发部',
          position: '前端工程师',
          zu: '一组'
        },
        {
          userName: '李四',
          orgId: 'AI研发部',
          position: '前端工程师',
          zu: ''
        },
        {
          userName: '王仙儿',
          orgId: '',
          position: '前端工程师',
          zu: '二组'
        },
      ];
      this.studentChecked = this.studentList;
      this.studentGroupFilter(this.studentList);
      this.studentDepFilter(this.studentList);
    },
    prev() {
      if (this.index <= 0) {
        return;
      }
      this.index = this.index - 1;
    },
    next() {
      if (this.index >= this.studentChecked.length - 1) {
        return;
      }
      this.index = this.index + 1;
    },
    studentChange(arr) {
      if (this.index >= arr.length || this.index < 0) {
        this.index = 0;
      }
    },
    openPrint() {
      if (this.studentChecked.length == 0 && this.unNameNum <= 0) {
        this.$message.warning("请选择要打印的人员或空白名单的张数！");
        return;
      }
      this.printList = [];
      this.printList = JSON.parse(JSON.stringify(this.studentChecked));
      for (let i = 0; i < this.unNameNum; i++) {
        this.printList.push({
          userName: ""
        });
      }
      this.current = 1;
      this.total = this.printList.length;
      this.printVisiable = true;
    },
    printOk(flag) {
      this.isPrintAll = flag;
      this.printLoading = true;
      setTimeout(() => {
        this.toPrint(); // 使用
      }, 1000);
      setTimeout(() => {
        this.printLoading = false;
      }, 3000);
    },
    handleCurrentChange(val) {
      // 更改页数
      this.current = val;
    },
    cardChange(selectCard) {
      switch (selectCard[selectCard.length - 1]) {
        case "userName":
          this.cardSplice(selectCard, "sign");
          this.cardSplice(selectCard, "assess");
          this.cardSplice(selectCard, "survey");
          this.cardSplice(selectCard, "custom");
          break;
        case "sign":
        case "assess":
        case "survey":
        case "custom":
          this.cardSplice(selectCard, "userName");
          break;
        default:
          break;
      }
    },
    cardSplice(selectCard, item) {
      if (selectCard.indexOf(item) > -1) {
        selectCard.splice(selectCard.indexOf(item), 1);
      }
    },
    downPDF(flag) {
      this.downLoading = true;
      this.isPrintAll = flag;
      var pdf = document.createElement("div"),
        pdfDom = document.body.appendChild(pdf);

      pdf.id = "pdfDom";
      setTimeout(() => {
        pdf.innerHTML = document.querySelector("#PDF").innerHTML;
        this.html2PDF(pdf);
      }, 1000);
      setTimeout(() => {
        document.body.removeChild(pdf);
      }, 5000);
    },
    html2PDF(pdf) {
      var np = pdf.querySelectorAll(".np-box");
      let PDF = new JsPDF("", "pt", "a4");
      if (np[0].classList.value.indexOf("all") == -1) {
        np = pdf.querySelectorAll(".np-box.np-current");
      }
      for (let i = 0; i < np.length; i++) {
        html2Canvas(np[i], {
          dpi: 192,
          useCORS: true
        }).then(canvas => {
          let contentWidth = canvas.width;
          let contentHeight = canvas.height;
          let pageHeight = (contentWidth / 592.28) * 841.89;
          let leftHeight = contentHeight;
          let position = 0;
          let imgWidth = 595.28;
          let imgHeight = (592.28 / contentWidth) * contentHeight;
          let pageData = canvas.toDataURL("image/jpeg", 1.0);
          PDF.addImage(pageData, "JPEG", 0, 180, imgWidth, imgHeight);
          if (i == np.length - 1) {
            this.downLoading = false;
            PDF.save(document.title + "-名牌打印.pdf");
          } else {
            PDF.addPage();
          }
        });
      }
    },
    printInit() {
      var w,
        doc,
        iframe = document.createElement("iframe"),
        content = this.getStyle(),
        f = document.body.appendChild(iframe);
      iframe.id = "myIframe";
      iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";

      w = f.contentWindow || f.contentDocument;
      doc = f.contentDocument || f.contentWindow.document;
      doc.open();
      doc.write(content);
      doc.close();

      this.iframe = iframe;
      this.iframeWin = w;
    },
    getStyle: function() {
      var str = "",
        styles = document.querySelectorAll("style,link");
      for (var i = 0; i < styles.length; i++) {
        str += styles[i].outerHTML;
      }

      return str;
    },
    toPrint: function() {
      var frameWindow = this.iframeWin;
      var print = document.createElement("div");
      print.innerHTML = document.getElementById("PDF").outerHTML;
      frameWindow.document.body.appendChild(print);
      try {
        setTimeout(function() {
          frameWindow.focus();
          try {
            if (!frameWindow.document.execCommand("print", false, null)) {
              frameWindow.print();
            }
          } catch (e) {
            frameWindow.print();
          }
          frameWindow.close();
        }, 10);
        setTimeout(() => {
          frameWindow.document.body.innerHTML = "";
        }, 500);
      } catch (err) {
        console.log("err", err);
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.btn-box {
  text-align: center;
  margin-top: 20px;
}
.activityPlan-box {
  background: #fff;
  padding: 20px 30px;
  width: 1100px;
  margin: 30px auto 50px;
  border-radius: 5px;
}
.el-checkbox {
  background: #fff;
}
.tab > li {
  font-size: 14px;
  line-height: 30px;
  height: 30px;
  float: left;
  padding: 0 12px;
  background-color: #f2f2f2;
  color: #666;
  cursor: pointer;
  margin-right: 12px;
}
.tab > li.on {
  background-color: #409eff;
  color: #fff;
  cursor: default;
}
.man-list {
  border: solid 1px #e4e4e4;
  min-height: 100px;
  padding: 10px 15px;
  margin-bottom: 5px;
}
.el-checkbox {
  margin-bottom: 8px;
}
.select-box {
  line-height: 30px;
  font-size: 14px;
}
.opt-select {
  color: #409eff;
  cursor: pointer;
}
.group {
  position: relative;
  line-height: 25px;
}
.line {
  position: absolute;
  border-top: 1px dashed #e5e5e5;
  top: 12px;
  left: 0;
  width: 100%;
}
.studentName {
  font-size: 14px;
  color: #666666;
  background: #fff;
}
.ipt {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 60px;
  padding: 0 5px;
  text-align: center;
  height: 30px;
}
.card-title {
  line-height: 20px;
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e4e4e4;
  font-weight: bold;
}
.card-box {
  position: relative;
  padding-left: 130px;
  margin-bottom: 20px;
}
.radio-box .el-radio {
  margin-top: 3px;
  margin-bottom: 14px;
}
.radio-box {
  width: 100px;
}
.check-box .el-check {
  margin-top: 3px;
  margin-bottom: 14px;
}
.check-box {
  width: 100px;
  position: relative;
}
.card-item-title {
  display: inline-block;
  width: 120px;
  text-align: right;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
}
.btn-edit {
  cursor: pointer;
  color: #409eff;
  display: inline-block;
  font-size: 14px;
}
.select {
  position: absolute;
  left: 70px;
  top: 55px;
}
.btn-logo-box {
  position: absolute;
  left: 250px;
  top: 10px;
  width: 400px;
}
img {
  width: auto;
  height: 31px;
  margin-right: 30px;
  vertical-align: middle;
  display: inline-block;
}
.priview {
  position: absolute;
  top: 0;
  left: 430px;
  width: 530px;
  z-index: 10;
}
.prevNext-box {
  text-align: center;
  margin: 10px 0;
  font-size: 14px;
}
.prevNext-box > span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 20px;
  margin: 0 5px;
  color: #666;
}
.prevNext-box > span.on {
  color: #409eff;
  border-color: #409eff;
}
.priview-box span {
  font-size: 20px;
  vertical-align: middle;
}
.priview-box {
  border: 1px solid #e4e4e4;
  width: 480px;
  height: 200px;
  display: inline-block;
  vertical-align: top;
  padding: 10px;
  position: relative;
}
.name {
  text-align: center;
  height: 120px;
  line-height: 120px;
}
.bottom-box {
  text-align: right;
  position: absolute;
  bottom: 10px;
  right: 15px;
  width: 95%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.bottom-box > span {
  margin-left: 10px;
}
.card-bottom {
  border-top: 1px dashed #cccccc;
  padding: 25px 0;
  text-align: center;
}
.btn-print {
  border: 1px solid #409eff;
  color: #409eff;
  font-size: 16px;
  width: 120px;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
.tip-print {
  margin-top: 6px;
  font-size: 14px;
  color: #333;
}
.bottom-tip {
  color: #999;
  text-align: center;
  margin-top: 20px;
}
.img-box {
  line-height: 120px;
  text-align: center;
}
.img-box img {
  margin: 0 10px;
  height: 80px;
  width: 80px;
}

.print-box {
  width: 720px;
  margin: 0 auto;
}
.np-box {
  border: 1px dashed #c9c9c9;
  height: 480px;
  margin: 0 auto;
  position: relative;
  width: 80%;
  display: none;
}
.np-box .priview-box.rotation {
  transform: rotate(-180deg);
  border-top: 1px dashed #c9c9c9;
}
.np-box .priview-box {
  height: 240px;
  width: 100%;
  border: none;
  display: block;
}
.np-box span {
  font-size: 28px;
}
.np-box .name {
  font-weight: bold;
}
.np-show {
  display: none;
}
.np-current {
  display: block;
}
.page-break {
  page-break-after: always;
}
.logoOrg {
  height: 50px;
}

/* 打印页面样式 */
@media print {
  @page {
    size: auto;  /* auto is the initial value */
    margin: 0mm; /* this affects the margin in the printer settings */
  }
  .np-show.all {
    display: block;
  }
  .page-break {
    page-break-after: always;
  }
  .print-box {
    position: relative;
    margin: 0 auto;
    width: 100%;
  }
  .print-height {
    height: 5cm;
  }
  .np-box {
    border: medium none;
    height: 100%;
    margin: 0 auto;
    width: 100%;
  }
  .logoImg {
    margin-top: 5px;
    height: 40px;
  }
  .np-box .priview-box {
    height: 8cm;
    border-bottom: 1px dashed #c9c9c9;
  }
  .np-box .name {
    height: 90pt;
    line-height: 90pt;
  }
  .np-box .img-box {
    height: 90pt;
    line-height: 90pt;
  }
  .np-box .img-box img {
    height: 90pt;
    width: 90pt;
    margin: 0 10pt;
    margin-top: 5pt;
  }
  .np-box .logoOrg {
    height: 50pt;
    margin-top: 5px;
  }
  .np-box .bottom-box {
    bottom: 20px;
    right: 15px;
  }
}
</style>
<style>
#pdfDom {
  width: 720px;
  margin: 0 auto;
}
</style>

<style lang="scss" scoped>
// 下载页面样式
#pdfDom {
  .np-show.all {
    display: block;
  }
  .np-box {
    width: 100%;
    padding: 0 30px;
    border: none;
    height: auto;
  }
  .np-box .priview-box {
    border: 1px dashed #fff;
    border-bottom-color: #c6c6c6;
    width: 100%;
    display: block;
    height: 250px;
  }
  .np-box .priview-box.rotation {
    border-top: 1px dashed #c6c6c6;
  }
}
</style>
