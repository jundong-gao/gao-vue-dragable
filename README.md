## 拖动组件 （[预览地址](http://gaojundong.com/dragable)）

### 安装

```bash
npm install gao-vue-dragable -S
# or
yarn add gao-vue-dragable

#### main.js
import drag from 'gao-vue-dragable'
Vue.use(drag)
```

### 使用(父组件需设置 position=relative)

```vue
<div style="position: relative;">
  <gao-vue-dragable
      v-for="item,index in lists"
      :key="index"
      :data="item"
      :option="option"
      @movestart="movestart(item)"
      @movestop="movestop"
      @moving="moving(item)"
      @blur="blur(item)"
      @focus="focus(item)">
      {{index}}
  </gao-vue-dragable>
</div>
```

### 属性

| name   | type   | Default            |
| ------ | ------ | ------------------ |
| data   | Object | 详见下 data 配置   |
| option | Object | 详见下 option 配置 |

#### data 配置（以下为必须参数）

```js
let data = {
  index: String, // 组件唯一标识
  active: Boolean, // 组件是否被激活状态
  left: Number, // 距离父元素左侧
  top: Number, // 距离父元素右侧
  width: Number, // 组件宽
  height: Number, // 组件高
  zIndex: Number, // 组件层级
};
```

#### option 配置（以下为必须参数）

```js
let option = {
  scele: Number, // 父组件使用transform:scale情况下 为确保拉伸小点的大小，默认值为1,
  dragable: false, // 当前组件是否可以拖动
};
```

### 事件

- `movestart`

  ```js
  movestart(){
    // 组件开始拖动
  }
  ```

- `moving`

  ```js
  moving(e){
    // 组件拖动中 ,返回组件移动的差值
    // {offsetx: 10, offsety: 10, left: 100, top: 100}
  }
  ```

- `movestop`

  ```js
  movestop(e){
    // 组件移动之后
  }
  ```
  
- `change-size-stop`

  ```js
  changeSizeStop(e){
    // 组件尺寸发生变化之后
  }
  ```

- `blur`

  ```js
  blur(e){
    // 监听鼠标离开 组件时
  }
  ```

- `focus`

  ```js
  focus(e){
    // 监听鼠标覆盖 组件时
  }
  ```
