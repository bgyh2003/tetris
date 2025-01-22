<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'
import Tetris from './lib/Tetris'

// 获取画布dom引用
const stageDom = useTemplateRef('stage')

// 游戏实例
let game = null

onMounted(() => {

    console.time("aaa")
    // 实例化化游戏
    game = new Tetris({
        view: stageDom.value, // 画布dom
        cols: 13,
        rows: 20,
        viewHeight: 600,
        squareSize: 30,
        squareSpace: 1
    })

    console.timeEnd("aaa")

})


</script>

<template>

    <div class="flex bg-slate-400" style="min-width: 300px;">

    </div>

    <div class="flex flex-1 justify-center items-center gap-5 bg-stone-300">
        <div class="h-auto bg-amber-100">
            <div ref="stage"></div>
        </div>
        <div class=" h-auto bg-slate-200" style="height: 600px; width: 200px;"></div>
    </div>


</template>

<style scoped></style>
