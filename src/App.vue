<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'
import Tetris from './lib/Tetris';

// 获取画布dom引用
const stage = useTemplateRef('stage')

// 游戏实例
let game = null

onMounted(() => {

    // 实例化化游戏
    game = new Tetris({
        view: stage.value, // 画布dom
        width: 300, // 画面宽度
        height: 600, // 画面高度
        cols: 10,// 横向方块数
        rows: 20,// 纵向方块数
    })



})


</script>

<template>

    <div class="left">
        123
    </div>

    <div class="right">
        <div class="stage" ref="stage"></div>
    </div>


</template>

<style scoped>
.left {
    display: flex;
    width: 300px;
    height: 100%;
    background-color: rgb(118, 154, 187);
}

.right {
    display: flex;
    flex: 1;
    height: 100%;
    background-color: rgb(187, 118, 118);
    justify-content: center;
    align-items: center;
}

.stage {
    background-color: bisque;
}
</style>
