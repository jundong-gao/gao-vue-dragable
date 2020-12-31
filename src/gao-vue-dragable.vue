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
                hoverDrag: false
            }
        },
        watch: {
            // data: {
            //     handler() {
            //         this.item = Object.assign({}, this.item, this.data)
            //     },
            //     deep: true,
            //     immediate: true
            // },
            option: {
                handler() {
                    // console.log('option改变', this.option)

                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            style() {
                return {
                    left: this.setPx(this.data.left),
                    top: this.setPx(this.data.top),
                    width: this.setPx(this.data.width),
                    height: this.setPx(this.data.height),
                    zIndex: this.data.zIndex
                }
            },
            dragXStyle() {
                return {
                    transform: `scale(${1 / this.option.scale})`,
                    'transform-origin': 'right bottom'
                }
            },
            dragYStyle() {
                return {
                    transform: `scale(${1 / this.option.scale}) rotate(-90deg)`,
                    'transform-origin': '0 0'
                }
            },
            dianStyle() {
                return function (position) {
                    let size = 3 * ((1 / this.option.scale) || 1)
                    let config = {
                        width: size + 'px',
                        height: size + 'px'
                    }
                    switch (position) {
                        case 'left-center':
                            config.top = `calc(50% - ${size / 2}px)`
                            break
                        case 'top':
                            config.left = `calc(50% - ${size / 2}px)`
                            break
                        case 'right-center':
                            config.top = `calc(50% - ${size / 2}px)`
                            break
                        case 'bottom':
                            config.left = `calc(50% - ${size / 2}px)`
                            break
                    }
                    return config
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

                this.sb_bkx = e.clientX;
                this.sb_bky = e.clientY;
                this.start = {
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    left: this.data.left,
                    top: this.data.top
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
                // let left = e.clientX - this.sb_bkx
                // let top = e.clientY - this.sb_bky
                // this.item.left = left
                // this.item.top = top

                // 移动选中组件时 偏移的坐标
                // let cha = {
                //     offsetx: (e.clientX - this.start.x) * 2,
                //     offsety: (e.clientY - this.start.y) * 2,
                //
                //     offsetx1: (e.clientX - this.start.x) ,
                //     offsety1: (e.clientY - this.start.y) ,
                //
                //     left: left ,
                //     top: top
                // }
                // console.log(JSON.stringify(cha))


                let newLeft = this.round(this.start.left + (e.clientX - this.start.mouseX) / this.option.scale)
                let newTop = this.round(this.start.top + (e.clientY - this.start.mouseY) / this.option.scale)

                this.$emit('moving', {
                    left: newLeft,
                    top: newTop
                })
            },
            up(e){
                this.isDown = false
                this.dianIsDown = false
                document.onmousemove = null
                document.onmouseup = null

                let left = e.clientX - this.sb_bkx
                let top = e.clientY - this.sb_bky
                this.$emit('movestop')
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
                            currObj.width = this.round(this.numVal(o_width - cha.x / this.option.scale))
                            currObj.height = this.round(this.numVal(o_height - cha.y / this.option.scale))
                            currObj.left = this.round(o_left + cha.x / this.option.scale)
                            currObj.top = this.round(o_top + cha.y / this.option.scale)
                            break
                        case 'left-center':
                            currObj.width = this.round(this.numVal(o_width - cha.x / this.option.scale))
                            currObj.left = this.round(o_left + cha.x / this.option.scale)
                            break
                        case 'left-bottom':
                            currObj.width = this.round(this.numVal(o_width - cha.x / this.option.scale))
                            currObj.height = this.round(this.numVal(o_height + cha.y / this.option.scale))
                            currObj.left = this.round(o_left + cha.x / this.option.scale)
                            break
                        case 'left-bottom':
                            currObj.width = this.round(this.numVal(o_width - cha.x / this.option.scale))
                            currObj.height = this.round(this.numVal(o_height + cha.y / this.option.scale))
                            currObj.left = this.round(o_left + cha.x / this.option.scale)
                            break
                        case 'top':
                            currObj.height = this.round(this.numVal(o_height - cha.y / this.option.scale))
                            currObj.top = this.round(o_top + cha.y / this.option.scale)
                            break
                        case 'bottom':
                            currObj.height = this.round(this.numVal(o_height + cha.y / this.option.scale))
                            break
                        case 'right-top':
                            currObj.width = this.round(this.numVal(o_width + cha.x / this.option.scale))
                            currObj.height = this.round(this.numVal(o_height - cha.y / this.option.scale))
                            currObj.top = this.round(o_top + cha.y / this.option.scale)
                            break
                        case 'right-center':
                            currObj.width = this.round(this.numVal(o_width + cha.x / this.option.scale))
                            break
                        case 'right-bottom':
                            currObj.width = this.round(this.numVal(o_width + cha.x / this.option.scale))
                            currObj.height = this.round(this.numVal(o_height + cha.y / this.option.scale))
                            break
                    }
                }
                document.onmouseup = e => {
                    this.$emit('change-size-stop', this.data)
                    this.up(e)
                }
            },
            numVal(val){
                return val < 10 ? 10 : val
            },
            mouseover(e){
                if(!this.option.dragable) return
                this.hoverDrag = true
                this.$emit('focus')
            },
            mouseleave(e){
                if(!this.option.dragable) return
                this.hoverDrag = false
                this.$emit('blur')
            },
            round(val){
                return Math.round(Number(val))
            }
        }
    }
</script>

<template>
    <div class="drag"
         :data-left="data.left"
         :data-top="data.top"
         :data-scale="2"
         :ref="key"
         :class="{active: data.active, hover: hoverDrag}"
         :style="style"
         @mousedown.stop="down"
         @mouseover.stop="mouseover"
         @mouseleave="mouseleave"
         @click.stop="clickStop"
    >
        <slot></slot>
        <template v-if="data.active">
            <div class="drag-x flex-aic" :style="dragXStyle">X：{{data.left}}</div>
            <div class="drag-y flex-aic" :style="dragYStyle">Y：{{data.top}}</div>
        </template>
        <template v-if="data.active">
            <div class="drag-dian drag-left-top" :style="dianStyle('left-top')" @mousedown.stop="dian($event, data, 'left-top')"></div>
            <div class="drag-dian drag-left-center" :style="dianStyle('left-center')" @mousedown.stop="dian($event, data, 'left-center')"></div>
            <div class="drag-dian drag-left-bottom" :style="dianStyle('left-bottom')" @mousedown.stop="dian($event, data, 'left-bottom')"></div>
            <div class="drag-dian drag-top" :style="dianStyle('top')" @mousedown.stop="dian($event, data, 'top')"></div>
            <div class="drag-dian drag-bottom" :style="dianStyle('bottom')" @mousedown.stop="dian($event, data, 'bottom')"></div>
            <div class="drag-dian drag-right-top" :style="dianStyle('right-top')" @mousedown.stop="dian($event, data, 'right-top')"></div>
            <div class="drag-dian drag-right-center" :style="dianStyle('right-center')" @mousedown.stop="dian($event, data, 'right-center')"></div>
            <div class="drag-dian drag-right-bottom" :style="dianStyle('right-bottom')" @mousedown.stop="dian($event, data, 'right-bottom')"></div>
        </template>
    </div>
</template>

<style scoped>
    .drag{z-index: 1; width: 50px; height: 50px; position: absolute; cursor: pointer; user-select: none;}
    .drag.active .drag-x{font-size: 12px; line-height: 15px;  display: block; position: absolute; left: -100px; top: -15px; width: 100px; text-align: right; color: rgba(0,0,255,.5); border-bottom: 1px solid rgba(0,0,255,.1); padding-right: 10px; box-sizing: border-box;}
    .drag.active .drag-y{font-size: 12px; line-height: 15px;  display: block; position: absolute; left: 0; top: 0; padding-left: 10px; box-sizing: border-box; width: 100px;  color: rgba(0,0,255,.5);  border-top: 1px solid rgba(0,0,255,.1);}
    .drag.hover{background-color: rgba(0,0,255, 0.1);}
    .drag.active{background-color: rgba(0,0,255, 0.3);}

    .drag-dian{position: absolute; background-color: #fff; border: 1px solid #000;}
    .drag-left-top{left: 0px; top: 0px; cursor: nw-resize;}
    .drag-left-center{left: 0px; cursor: w-resize;}
    .drag-left-bottom{left: 0px; bottom: 0px; cursor: sw-resize}
    .drag-right-top{right: 0px; top: 0px; cursor: ne-resize;}
    .drag-right-center{right: 0px; cursor: e-resize;}
    .drag-right-bottom{right: 0; bottom: 0; cursor: se-resize;}
    .drag-top{top: 0px; cursor: n-resize;}
    .drag-bottom{bottom: 0px; cursor: s-resize;}
</style>
