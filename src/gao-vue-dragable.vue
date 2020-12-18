<script>
    import {deepClone, createUUID} from "./utils";
    export default {
        name: "GaoVueDragable",
        props: ['option', 'data'],
        data() {
            return {
                key: 'drag' + createUUID(),
                item: {},
                isDown: false,
                dianIsDown: false,
                sb_bkx: 0,
                sb_bky: 0,
                start: {},
            }
        },
        watch: {
            data: {
                handler() {
                    this.item = Object.assign({}, this.item, this.data)
                },
                deep: true,
                immediate: true
            },
            option: {
                handler() {
                    console.log('option改变', this.option)
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            style() {
                return {
                    left: this.setPx(this.item.left),
                    top: this.setPx(this.item.top),
                    width: this.setPx(this.item.width),
                    height: this.setPx(this.item.height),
                    zIndex: this.item.zIndex
                }
            },
            dianStyle() {
                let size = 6 * (1 / this.option.scale || 1)
                return {
                    width: size + 'px',
                    height: size + 'px'
                }
            }
        },
        methods:{
            setPx(val){
                try{
                    return Number(val) + 'px'
                }catch (e) {
                    return '0px'
                }
            },
            down(e){
                if(!this.option.dragable) return

                this.sb_bkx = e.clientX - e.target.offsetLeft;
                this.sb_bky = e.clientY - e.target.offsetTop;
                this.start = {
                    x: e.clientX,
                    y: e.clientY
                }
                this.isDown = true
                document.onmousemove = e => {
                    this.move(e)
                }
                document.onmouseup = e => {
                    this.up(e)
                }
                this.$emit('movestart', {
                    start: this.start,
                    item: this.item
                })
            },
            move(e){
                if(!this.option.dragable) return
                if(!this.isDown) return
                let left = e.clientX - this.sb_bkx
                let top = e.clientY - this.sb_bky
                this.item.left = left
                this.item.top = top

                // 移动选中组件时 偏移的坐标
                let cha = {
                    offsetx: e.clientX - this.start.x,
                    offsety: e.clientY - this.start.y,
                }
                this.$emit('moving', cha)
            },
            up(e){
                this.isDown = false
                this.dianIsDown = false
                document.onmousemove = null
                document.onmouseup = null
                this.$emit('movestop', this.item)
            },
            clickStop(){
                return false
            },
            dian(e, obj, type){
                if(!this.option.dragable) return
                this.dianIsDown = true
                let start =  {
                    startx: e.clientX,
                    starty: e.clientY
                }
                let o_width = obj.width
                let o_height = obj.height
                let o_left = obj.left
                let o_top = obj.top
                let positon = type
                let currObj = obj
                document.onmousemove = (e) => {
                    if(!this.option.dragable) return
                    if(!this.dianIsDown) return
                    let cha = {
                        x: e.clientX - start.startx,
                        y: e.clientY - start.starty,
                    }
                    switch(positon){
                        case 'left-top':
                            currObj.width = this.numVal(o_width - cha.x)
                            currObj.height = this.numVal(o_height - cha.y)
                            currObj.left = o_left + cha.x
                            currObj.top = o_top + cha.y
                            break
                        case 'left-center':
                            currObj.width = this.numVal(o_width - cha.x)
                            currObj.left = o_left + cha.x
                            break
                        case 'left-bottom':
                            currObj.width = this.numVal(o_width - cha.x)
                            currObj.height = this.numVal(o_height + cha.y)
                            currObj.left = o_left + cha.x
                            break
                        case 'left-bottom':
                            currObj.width = this.numVal(o_width - cha.x)
                            currObj.height = this.numVal(o_height + cha.y)
                            currObj.left = o_left + cha.x
                            break
                        case 'top':
                            currObj.height = this.numVal(o_height - cha.y)
                            currObj.top = o_top + cha.y
                            break
                        case 'bottom':
                            currObj.height = this.numVal(o_height + cha.y)
                            break
                        case 'right-top':
                            currObj.width = this.numVal(o_width + cha.x)
                            currObj.height = this.numVal(o_height - cha.y)
                            currObj.top = o_top + cha.y
                            break
                        case 'right-center':
                            currObj.width = this.numVal(o_width + cha.x)
                            break
                        case 'right-bottom':
                            currObj.width = this.numVal(o_width + cha.x)
                            currObj.height = this.numVal(o_height + cha.y)
                            break
                    }
                }
                document.onmouseup = e => {
                    this.up(e)
                }
            },
            numVal(val){
                return val < 10 ? 10 : val
            },
            mouseover(e){
                if(!this.option.dragable) return
                this.$emit('focus')
            },
            mouseleave(e){
                if(!this.option.dragable) return
                this.$emit('blur')
            }
        }
    }
</script>

<template>
    <div class="drag"
         :ref="key"
         :class="{active: item.active}"
         :style="style"
         @mousedown.stop="down"
         @mouseover.stop="mouseover"
         @mouseleave="mouseleave"
         @click.stop="clickStop"
    >
        <slot></slot>
        <template v-if="item.active">
            <div class="drag-dian drag-left-top" :style="dianStyle" @mousedown.stop="dian($event, item, 'left-top')"></div>
            <div class="drag-dian drag-left-center" @mousedown.stop="dian($event, item, 'left-center')"></div>
            <div class="drag-dian drag-left-bottom" @mousedown.stop="dian($event, item, 'left-bottom')"></div>
            <div class="drag-dian drag-top" @mousedown.stop="dian($event, item, 'top')"></div>
            <div class="drag-dian drag-bottom" @mousedown.stop="dian($event, item, 'bottom')"></div>
            <div class="drag-dian drag-right-top" @mousedown.stop="dian($event, item, 'right-top')"></div>
            <div class="drag-dian drag-right-center" @mousedown.stop="dian($event, item, 'right-center')"></div>
            <div class="drag-dian drag-right-bottom" @mousedown.stop="dian($event, item, 'right-bottom')"></div>
        </template>
    </div>
</template>

<style scoped>
    .drag{background-color: skyblue; z-index: 999; width: 50px; height: 50px; position: absolute; cursor: pointer; user-select: none;}
    .drag.active{background-color: red;}

    .drag-dian{position: absolute; width: 6px; height: 6px; background-color: #000; border: 1px solid #000;}
    .drag-left-top{left: -3px; top: -3px; cursor: nw-resize;}
    .drag-left-center{left: -3px; top: calc(50% - 3px); cursor: w-resize;}
    .drag-left-bottom{left: -3px; bottom: -3px; cursor: sw-resize}
    .drag-right-top{right: -3px; top: -3px; cursor: ne-resize;}
    .drag-right-center{right: -3px; top: calc(50% - 3px); cursor: e-resize;}
    .drag-right-bottom{right: -3px; bottom: -3px; cursor: se-resize;}
    .drag-top{left: calc(50% - 3px); top: -3px; cursor: n-resize;}
    .drag-bottom{left: calc(50% - 3px); bottom: -3px; cursor: s-resize;}

</style>
