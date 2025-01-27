<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'
import Game from './lib/Game';

// 获取画布dom引用
const container = useTemplateRef('container')

// 游戏实例
let game = null

onMounted(() => {

    // 实例化游戏
    game = new Game({
        container: container.value, // 画布dom
        cols: 13,
        rows: 20,
        viewHeight: 500,
        viewWidth: 330,
        squareSize: 30,
        squareSpace: 1,

        onClearRow: (num, total) => {
            console.log('本次消除了' + num + '行')
            console.log('当前总消除行数' + total)
        },

        onGameOver: () => {
            console.log('游戏结束')
        }
    })

})

</script>

<template>

    <div class="flex flex-1 flex-col gap-2 max-w-screen-sm">
        <div class="flex  p-2 bg-white">
            1
        </div>

        <div ref="container" class="flex flex-1 p-2 bg-white justify-center items-center"></div>

        <div class="flex p-2 bg-white">
            3
        </div>


    </div>






</template>

<style scoped></style>
