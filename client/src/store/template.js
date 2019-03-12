import {
  observable, action, toJS,
} from 'mobx';
import { get } from '../api/http';
import { templateData } from '../static/default-template-data'; // eslint-disable-line

export default class TemplateData {
  @observable sortArr; // 保存首页的拖动排序的数组

  @observable section; // 保存所有数据

  @observable loading; // loading展示

  @observable dropObj; // 保存着拖拽的数据

  @observable eleWrapper; // 右侧展示滚动对象

  componentItems; // 保存已经删除过的部件下标

  constructor() {
    this.section = null;
    this.loading = false;
    this.sortArr = null;
    this.componentItems = {};
    this.dropObj = {};
    this.themeId = null; // 保存 id
    this.eleWrapper = null;
    this.type = 'DeskTop'; // 默认展示pc端, // DeskTop (pc端) Phone (手机端)
  }

  // 请求模板默认数据
  @action getData(id) {
    get('/business/store_themes/customize', {
      themeId: id,
    })
      .then((resp) => {
        this.loading = true;
        this.themeId = id;
        this.type = resp.type;
        console.log(resp);
        // 此 id 无效
        if (resp.error) {
          window.location.href = resp.error;
          return;
        }
        // ok
        if (resp.draftData && resp.draftData !== '') {
          // 当前id 已有数据
          const obj = JSON.parse(resp.draftData);
          this.section = obj;
          this.sortArr = obj.sectionsOrder.slice();
        } else {
          // 当前id 是新用户
          this.section = templateData;
          this.sortArr = templateData.sectionsOrder.slice();
          console.log('第一次进', resp);
        }
      })
      .catch((err) => {
        this.loading = true;
        window.location.href = err.error;
        console.log(err, '错误...')
      });
  }

  // 本地数据
  // @action getData(id) {
  //   get('/api/theme/index')
  //     .then((resp) => {
  //       this.loading = true;
  //       this.section = resp;
  //       this.themeId = id;
  //       this.sortArr = resp.sectionsOrder.slice();
  //     })
  //     .catch((err) => {
  //       this.loading = true;
  //       console.log(err, '错误...')
  //     });
  // }

  // 添加新的章节
  @action saveTemplateData(data, name) {
    this.section[name] = data;
    this.section.sectionsOrder.push(name);
    this.sortArr = this.section.sectionsOrder.slice();
  }

  // 点击隐藏 或 显示 ( 章节 )
  @action setIsHidden(name) {
    this.section[name].isHidden = !this.section[name].isHidden;
  }

  // 删除章节
  @action deleteChapters(name, index) {
    delete this.section[name];
    this.section.sectionsOrder.splice(index, 1);
    this.sortArr = this.section.sectionsOrder.slice();
  }

  // 修改章节名称
  @action setChaptersName(name, val) {
    this.section[name].config.title = val;
  }

  /**
   * 排序滚动值
   * @param current
   * @param index
   * @param num
   * @param newIndex
   */
  @action handleDropScroll(current, num, index, newIndex) {
    num *= this.type === 'DeskTop' ? 280 : 200;
    if (this.eleWrapper) {
      // console.log(this.eleWrapper.scrollTop, ' --- -- --- ', index);
      if (current === 'start' || current === 'int') {
        if (current === 'int') {
          const mod = this.sortArr.splice(index, 1);
          this.sortArr.splice(newIndex, 0, ...mod);
        }
        if (this.type === 'DeskTop') this.dropObj.value = 'start';
        this.eleWrapper.scrollTo(0, num);
      } else if (this.type === 'DeskTop') {
        this.dropObj.value = 'end';
        this.section.sectionsOrder = this.sortArr.slice();
        setTimeout(() => {
          this.eleWrapper.scrollTo(0, num)
        }, 300)
      }
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
  @action
  deleteUploadImg(obj) {
    this.section[obj.name].config.modules[obj.index][obj.val].config.imgPath = null;
  }

  // 设置图片过期时间
  @action setImgInvalidDate(obj, date, name) {
    this.section[obj.name].config.modules[obj.index][obj.val].config[name] = date
  }

  toJson() {
    return toJS(this.section)
  }
}
