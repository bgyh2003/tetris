<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'
import Game from './lib/Game';

// 获取画布dom引用
const stageDom = useTemplateRef('stage')

// 游戏实例
let game = null
let start = () => {
    game.createElement('T')
}


onMounted(() => {

    console.time("init game")

    // 实例化化游戏
    game = new Game({
        view: stageDom.value, // 画布dom
        cols: 13,
        rows: 20,
        viewHeight: 600,
        viewWidth: 400,
        squareSize: 30,
        squareSpace: 1
    })

    console.timeEnd("init game")

})


</script>

<template>

    <div class="flex bg-white p-2" style="min-width: 230px;">

        <a-form layout="vertical" size="mini">
            <a-form-item field="name" label="Username">
                <a-input placeholder="please enter your username..." />
            </a-form-item>
            <a-form-item field="post" label="Post">
                <a-input placeholder="please enter your post..." />
            </a-form-item>
            <a-form-item field="isRead">
                <a-checkbox>
                    I have read the manual
                </a-checkbox>
            </a-form-item>
            <a-form-item>
                <a-button @click="start">start</a-button>

            </a-form-item>
            <a-form-item>
                <a-button @click="game.moveLeft()">left</a-button>
                <a-button @click="game.moveRight()">right</a-button>
                <a-button @click="game.moveDown()">down</a-button>
                <a-button @click="game.rotate()">rotate</a-button>
            </a-form-item>

            <a-form-item>
                <a-button @click="game.moveToBottom()">buttom</a-button>
                <a-button @click="game.merge()">merge</a-button>
                <a-button @click="game.clearRow()">clearRow</a-button>
            </a-form-item>
        </a-form>


    </div>

    <div class="flex flex-1 justify-center items-center gap-5 bg-white">
        <div class="h-auto bg-amber-100">
            <div ref="stage"></div>
        </div>
        <!-- <div class=" h-auto bg-slate-200" style="height: 600px; width: 200px;"></div> -->
    </div>


</template>

<style scoped></style>
