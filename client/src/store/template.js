import {
  observable, action, toJS, configure,
} from 'mobx';

configure({ enforceActions: 'observed' });

const DESK_TOP = 'DeskTop'; // 表示pc端;

export default class TemplateData {
  @observable section; // 保存所有数据

  @observable dragDropDataObj; // 拖拽操作数据对象

  @observable sortArr;

  componentItems; // 保存已经删除过的部件下标

  isNewUser; // 保存bool 是否是第一次装修店铺

  constructor() {
    this.section = null;
    this.sortArr = null;
    this.componentItems = {};
    this.isNewUser = false;
    this.themeId = null; // 保存 id
    this.dragObj = []; // 保存右侧元素的高度, 及是否隐藏 及唯一的id
    this.eleHeightLen = 0;
    this.dragDropDataObj = {
      eleWrapper: null,
      controllerVal: null,
      eleHeight: [],
    };
    this.type = DESK_TOP; // 默认展示pc端, // DeskTop (pc端) Phone (手机端)
  }

  // 传递默认数据
  @action setDefaultData(obj) {
    const { sectionsOrder } = obj.data;
    this.themeId = obj.id;
    this.type = obj.type;
    this.section = obj.data;
    this.isNewUser = obj.bool; // 是否是新用户
    this.sortArr = sectionsOrder.slice();
  }

  // 回退版本
  @action setRevert(obj) {
    this.section = obj;
    this.sortArr = obj.sectionsOrder.slice();
  }

  // 添加新的章节
  @action saveTemplateData(data, name) {
    this.section[name] = data;
    this.section.sectionsOrder.push(name);
  }

  // 点击隐藏 或 显示 ( 章节 )
  @action setIsHidden(name) {
    this.section[name].isHidden = !this.section[name].isHidden;
  }

  // 删除章节
  @action deleteChapters(name, index) {
    delete this.section[name];
    this.section.sectionsOrder.splice(index, 1);
    this.dragDropDataObj.eleHeight.splice(index, 1)
  }

  // 修改章节名称
  @action setChaptersName(name, val) {
    this.section[name].config.title = val;
  }

  // index => 拖住开始
  @action handleDropStart(type) {
    this.handleDropClass(type);
    this.setHidden();
  }

  // index => 拖住中 (每次拖过一个元素时)
  @action handleDropUpScroll(arr, index, startIndex, isTop) {
    this.section.sectionsOrder = arr;
    this.utilScroll(this.utilScrollVal(index, startIndex, isTop), false);
  }

  // index => 拖住完成 (鼠标已经放手时)
  @action handleDropScroll(type, endIndex, startIndex, isTop) {
    this.handleDropClass(type);
    this.utilScroll(
      this.utilScrollVal(endIndex, startIndex, isTop),
      true,
    );
    this.dragObjSort(startIndex, endIndex)
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

  // 计算滚动值
  utilScrollVal(index, startIndex, isTop) {
    // console.log(index, startIndex, '---------------------', ...this.dragObj)
    let scrollVal = 0;
    // 如果index 等于 0 则不拖动
    if (!index) return scrollVal;
    // 下标要加 + 1 因为需要排除自身的高度
    Array.from({ length: index + 1 }).forEach((v, i) => {
      console.log(i, '---')
      if (!this.dragObj[i].isHidden) {
        scrollVal += this.dragObj[i].height
      }
    })
    console.log(
      scrollVal + 168 - this.dragObj[isTop ? index : startIndex].height,
      '需要滚动的距离',
      this.dragObj[startIndex].height,
    )
    // 加上头部的高度 // 还需要减去自身的高度 => 得到正确的滚动高度
    return scrollVal + 168 - this.dragObj[isTop ? index : startIndex].height
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

  // 把右侧元素高度 和 是否是隐藏 存入dragObj 对象中,
  // 这样操作是保证在有隐藏元素的情况下而不会出现存入错误的情况,
  // (如果有元素隐藏了 会导致dragDropDataObj.eleHeight 获取不到高度)
  setHidden() {
    const { sectionsOrder } = this.section;
    const { eleHeight } = this.dragDropDataObj;
    let _index = 0;
    console.log(eleHeight.length, '我是第一次计算时的个数')
    // 保证在没有如何添加或者删除操作时  只进一次
    if (this.dragObj.length > 0 && this.eleHeightLen === eleHeight.length) {
      return;
    }
    this.dragObj.length = 0;
    for (let i = 0, len = sectionsOrder; i < len.length; i += 1) {
      const { isHidden } = this.section[len[i]]
      const obj = {
        id: len[i],
        isHidden,
      };
      if (!isHidden) {
        obj.height = eleHeight[_index] + 30; // 加上30的上边距
        _index += 1;
      } else {
        obj.height = 0;
      }
      this.dragObj.push(obj);
    }
    console.log(...this.dragObj, '进来了');
    this.eleHeightLen = this.dragDropDataObj.eleHeight.length;
  }

  // 拖动完成时跟dragObj数组中的元素交换位置
  dragObjSort(start, end) {
    const mou = this.dragObj.splice(start, 1);
    this.dragObj.splice(end, 0, ...mou);
  }

  toJson() {
    return toJS(this.section)
  }
}
