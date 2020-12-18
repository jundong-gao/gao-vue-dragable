## 拖动组件

### 安装

```bash
npm install gao-vue-dragable -S
# or
yarn add gao-vue-dragable
```

### 使用(父组件需设置position=relative)

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

| name   | type   | Default          |
| ------ | ------ | ---------------- |
| data   | Object | 详见下data配置   |
| option | Object | 详见下option配置 |

#### data配置（以下为必须参数）

```js
let data = {
  index: String, // 组件唯一标识
  active: Boolean, // 组件是否被激活状态 
  left: Number, // 距离父元素左侧
  top: Number, // 距离父元素右侧
  width: Number, // 组件宽
  height: Number, // 组件高
  zIndex: Number // 组件层级
}
```

#### option配置（以下为必须参数）

```js
let option = {
  scele: Number, // 父组件使用transform:scale情况下 为确保拉伸小点的大小，默认值为1,
  dragable: false, // 当前组件是否可以拖动
}
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
  movestop(e){
    // 组件拖动中 ,返回组件移动的差值
    // {offsetx: 10, offsety: 10}
  }
  ```

- `movestop`

  ```js
  movestop(e){
    // 返回移动之后的item. 需要在此回调下 重置组件width, height, top, left 等属性
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

  