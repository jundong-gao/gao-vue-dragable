<script>
    import Vue from 'vue';
    import GaoVueDragable from '@/gao-vue-dragable.vue';

    export default Vue.extend({
        name: 'ServeDev',
        components: {
            GaoVueDragable
        },
        data() {
            return {
                lists: [
                    {left: 0, top: 0, active: false, index: '111', width: 100, height: 50, zIndex: 10},
                    {left: 100, top: 100, active: false, index: '222', width: 200, height: 100, zIndex: 20},
                ],
                option: { // 整个页面关于drag的统一配置
                    scale: 1,
                    dragable: true
                }
            }
        },
        methods: {
            changeSizeStop(e){
                console.log('changeSizeStop')
            },
            movestart(e){
                this.lists.forEach(item => {
                    item.active = false
                    item.zIndex = 10
                })
                e.active = true
                e.zIndex = 9999
                this.oldLeft = e.left
                this.oldTop = e.top
                console.log('start:::::::::')
            },
            moving(e,item){

                item.left = e.left
                item.top = e.top

                // console.log('chachahhhhhchhchhchc', )


            },
            movestop(e, item){
               console.log('movestop')

            },
            clearMove(){
                this.lists.forEach(item => {
                    item.active = false
                })
            },
            focus(item){
            },
            blur(item){
            }
        }
    });
</script>

<template>
    <div id="app" @click.stop="clearMove">
        <gao-vue-dragable
                v-for="item,index in lists"
                :key="index"
                :data="item"
                :option="option"
                @movestart="movestart(item)"
                @movestop="movestop($event, item)"
                @moving="moving($event,item)"
                @focus="focus(item)"
                @change-size-stop="changeSizeStop"
                @blur="blur(item)">{{index}}</gao-vue-dragable>
    </div>
</template>

<style>
    html,body{margin: 0; padding: 0; width: 100%; height: 100%;}
    #app{width: 100%; height: 100%; transform: scale(1); transform-origin: 0 0 ;}
</style>
