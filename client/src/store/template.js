import {
  observable, action, toJS,
} from 'mobx';

const DESK_TOP = 'DeskTop'; // 表示pc端;

export default class TemplateData {
  @observable section; // 保存所有数据

  @observable dragDropDataObj; // 拖拽操作数据对象

  componentItems; // 保存已经删除过的部件下标

  isNewUser; // 保存bool 是否是第一次装修店铺

  constructor() {
    this.section = null;
    this.componentItems = {};
    this.isNewUser = false;
    this.themeId = null; // 保存 id
    this.dragDropDataObj = {
      eleWrapper: null,
      controllerVal: null,
      eleHeight: [],
      sortArr: null,
    };
    this.type = DESK_TOP; // 默认展示pc端, // DeskTop (pc端) Phone (手机端)
  }

  // 请求模板默认数据
  // @action getData(id) {
  //   get('/business/store_themes/customize', {
  //     themeId: id,
  //   })
  //     .then((resp) => {
  //       this.themeId = id;
  //       this.type = resp.type;
  //       // 此 id 无效
  //       if (resp.error) {
  //         console.log(resp.error)
  //         window.location.href = resp.error || 'https://influmonster.com/';
  //         return;
  //       }
  //       // ok
  //       if (resp.draftData && resp.draftData !== '') {
  //         // 当前id 已有数据
  //         const obj = JSON.parse(resp.draftData);
  //         this.section = obj;
  //         this.dragDropDataObj.sortArr = obj.sectionsOrder.slice();
  //       } else {
  //         // 当前id 是新用户
  //         this.isNewUser = true;
  //         this.section = templateData;
  //         this.dragDropDataObj.sortArr = templateData.sectionsOrder.slice();
  //       }
  //     })
  //     .catch((err) => {
  //       window.location.href = err.error || 'https://influmonster.com/';
  //     });
  // }

  // 本地数据
  // @action getData(id) {
  //   get('/api/theme/index')
  //     .then((resp) => {
  //       this.section = resp;
  //       this.themeId = id;
  //       this.dragDropDataObj.sortArr = resp.sectionsOrder.slice();
  //     })
  //     .catch((err) => {
  //       console.log(err, '错误...')
  //     });
  // }

  // 传递默认数据
  @action setDefaultData(obj) {
    this.themeId = obj.id;
    this.type = obj.type;
    this.section = obj.data;
    this.isNewUser = obj.bool; // 是否是新用户
    this.dragDropDataObj.sortArr = obj.data.sectionsOrder.slice();
  }

  // 回退版本
  @action setRevert(obj) {
    this.section = obj;
    this.dragDropDataObj.sortArr = obj.sectionsOrder.slice();
  }

  // 添加新的章节
  @action saveTemplateData(data, name) {
    this.section[name] = data;
    this.section.sectionsOrder.push(name);
    this.dragDropDataObj.sortArr = this.section.sectionsOrder.slice();
    // this.dragDropDataObj.eleHeight.length = 0;
  }

  // 点击隐藏 或 显示 ( 章节 )
  @action setIsHidden(name, index) {
    this.section[name].isHidden = !this.section[name].isHidden;
    this.dragDropDataObj.eleHeight.splice(index, 1);
  }

  // 删除章节
  @action deleteChapters(name, index) {
    delete this.section[name];
    this.section.sectionsOrder.splice(index, 1);
    this.dragDropDataObj.sortArr = this.section.sectionsOrder.slice();
  }

  // 修改章节名称
  @action setChaptersName(name, val) {
    this.section[name].config.title = val;
  }

  // 拖动开始
  @action handleDropStart(index) {
    this.handleDropClass('start');
    this.utilScroll(this.utilScrollVal(index), false);
  }

  // 拖动中
  @action handleDropUpScroll(index, newIndex, num) {
    const [mod] = this.dragDropDataObj.sortArr.splice(index, 1);
    this.dragDropDataObj.sortArr.splice(newIndex, 0, mod);
    this.__index__ = num;
    this.utilScroll(this.utilScrollVal(this.__index__), false);
  }

  // 拖动完成
  @action handleDropScroll(index, newIndex) {
    this.handleDropClass('end');
    const [mod] = this.section.sectionsOrder.splice(index, 1);
    this.section.sectionsOrder.splice(newIndex, 0, mod);
    const __index = this.__index__ !== 'undefined' ? this.__index__ : index;
    this.utilScroll(
      this.utilScrollVal(__index),
      true,
    );
  }

  // 拖动越界时 处理
  @action handleDropErrOr(index) {
    this.handleDropClass('end');
    this.dragDropDataObj.sortArr = this.section.sectionsOrder.slice();
    this.utilScroll(this.utilScrollVal(index), true);
  }

  // 拖动时 右侧展示区块的样式控制
  @action handleDropClass(type) {
    if (this.type === DESK_TOP) {
      this.dragDropDataObj.controllerVal = type;
    }
  }

  // 点击隐藏 或 显示 (部件)
  @action setComponentIsHidden(name, val, index) {
    this.section[name].config.modules[index][val].config.isShow = !this.section[name].config.modules[index][val].config.isShow; // eslint-disable-line
  }

  // 点击删除 (部件)
  @action deleteComponent(name, index) {
    this.section[name].config.modules.splice(index, 1);
    this.section[name].config.modulesOrder.splice(index, 1)
  }

  // 添加部件中单个子类 (部件)
  @action addComponentItems(name, _name, obj) {
    this.section[name].config.modules.push(obj);
    this.section[name].config.modulesOrder.push(_name)
  }

  /**
   * 如果删除过某个部件中的某个子元素, 则把子元素的下标存储在this.componentItems中
   * 在添加某个部件的子元素时用
   * @param name // 当前章节的唯一名称
   * @param i // 当前被删除元素的下标
   */
  @action setComponentItems(name, i) {
    if (Array.isArray(this.componentItems[name])) {
      this.componentItems[name].push(i)
    } else {
      this.componentItems[name] = [i]
    }
  }

  /**
   * * 排序 某个部件的子元素
   * @param name 当前章节的唯一name
   * @param currentIndex 当前拖动元素的下标
   * @param nextIndex 拖动完成位置的下标
   */
  @action componentItemsSort(name, currentIndex, nextIndex) {
    const { modules, modulesOrder } = this.section[name].config;
    // 排序 modules 数组
    const mod = modules.splice(currentIndex, 1);
    modules.splice(nextIndex, 0, ...mod);
    // 排序 modulesOrder 数组
    const mods = modulesOrder.splice(currentIndex, 1);
    modulesOrder.splice(nextIndex, 0, ...mods);
  }

  // 修改部件名称
  @action setComponentName(obj, val) {
    this.section[obj.name].config.modules[obj.index][obj.val].config.title = val;
  }

  // 修改部件的url
  @action setComponentUrl(obj, val) {
    this.section[obj.name].config.modules[obj.index][obj.val].config.url = val;
  }

  // 上传图片
  @action setUploadImg(obj, url) {
    this.section[obj.name].config.modules[obj.index][obj.val].config.imgPath = url;
  }

  // 删除上传图片
  @action deleteUploadImg(obj) {
    this.section[obj.name].config.modules[obj.index][obj.val].config.imgPath = null;
  }

  // 设置图片过期时间
  @action setImgInvalidDate(obj, date, name) {
    this.section[obj.name].config.modules[obj.index][obj.val].config[name] = date
  }

  // 公共方法
  // 计算滚动值
  utilScrollVal(index) {
    let scrollVal = 0;
    // 如果index 等于 0 则不拖动
    if (!index) return scrollVal;
    // 如果index 小于等于 1 则表示滚动 0元素 的高度
    if (index <= 1) {
      scrollVal = this.dragDropDataObj.eleHeight[0]; // eslint-disable-line
    } else {
      Array.from({ length: index }).forEach((v, i) => {
        scrollVal += this.dragDropDataObj.eleHeight[i] + 30;
      })
    }
    return scrollVal;
  }

  // 滚动
  utilScroll(number, isDelay) {
    if (isDelay) {
      setTimeout(() => {
        this.dragDropDataObj.eleWrapper.scrollTo(0, number);
      }, 300)
    } else {
      this.dragDropDataObj.eleWrapper.scrollTo(0, number);
    }
  }

  toJson() {
    return toJS(this.section)
  }
}
