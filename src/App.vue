<script setup>
import { ref, reactive, useTemplateRef, onMounted, nextTick } from 'vue'
import { Message } from '@arco-design/web-vue';
import Game from './lib/Game';


const form = reactive({
    groundFillColor: "#d1d5db",
    squareColor: "#555",
    squareSpace: 1,
    speed: "1000",
})



// 获取画布dom引用
const container = useTemplateRef('container')

// 下一个方块
let preview = useTemplateRef('preview')

// 游戏实例
let game = null

// 总分数
let score = ref(0)

// 总行数
let total = ref(0)

// 开始/暂停按钮
let btn = reactive(["开始", "暂停", "取消暂停", "重新开始"])

// 当前游戏状态 0:准备就绪 1:运行中 2:暂停中 3:游戏结束
let status = ref(0)

let resetScore = () => {
    score.value = 0
    total.value = 0
}

let start = () => {
    if (status.value === 0) {
        resetScore()
        game.start()
        status.value = 1
    } else if (status.value === 1) {
        game.pause()
        status.value = 2
    } else if (status.value === 2) {
        game.cancelPause()
        status.value = 1
    } else if (status.value === 3) {
        resetScore()
        game.stop()
        game.start()
        status.value = 1
    }
}

let stop = () => {
    game.stop()
    status.value = 0
}

let destroyGame = () => {
    if (game) {
        game.destroy()
        game = null
    }
}

let initGame = () => {

    // 实例化游戏
    game = new Game({
        container: container.value, // 画布dom
        preview: preview.value, // 下一个方块dom
        cols: 13,
        rows: 20,
        viewHeight: container.value.offsetHeight,
        viewWidth: container.value.offsetWidth,
        squareSize: 30,
        squareSpace: 1,

        groundFillColor: form.groundFillColor,
        squareColor: form.squareColor,
        squareSpace: form.squareSpace,
        speed: +form.speed,

        // 消除行回调
        onClearRow: (num) => {

            switch (num) {
                case 1:
                    score.value += 100
                    break;
                case 2:
                    score.value += 300
                    break;
                case 3:
                    score.value += 500
                    break;
                case 4:
                    score.value += 800
                    break;
            }

            total.value += num
        },

        // 游戏结束回调
        onGameOver: () => {
            status.value = 3
            Message.info('游戏结束')
        }
    })

}

let reset = async () => {
    status.value = 0
    resetScore()
    destroyGame()
    initGame()
}

onMounted(() => {

    initGame()

})

</script>

<template>

    <div class="flex flex-1 flex-col gap-2 max-w-md min-w-6">

        <!--顶部菜单-->
        <div class="flex  p-2 bg-white">

            <a-space>
                <a-color-picker v-model="form.groundFillColor" size="mini" disabledAlpha>
                    <a-tag :color="form.groundFillColor" style="color: #fff;" class="cursor-pointer"> 背景 </a-tag>
                </a-color-picker>

                <a-color-picker v-model="form.squareColor" size="mini" disabledAlpha>
                    <a-tag :color="form.squareColor" style="color: #fff;" class="cursor-pointer"> 方块 </a-tag>
                </a-color-picker>



                <a-select v-model="form.squareSpace" size="mini" :style="{ width: '80px' }">
                    <a-option v-for="i in 10" :value="i">间隔{{ i }}</a-option>

                </a-select>

                <a-select v-model="form.speed" size="mini" :style="{ width: '80px' }">
                    <a-option value="1000">速度1</a-option>
                    <a-option value="700">速度2</a-option>
                    <a-option value="400">速度3</a-option>
                    <a-option value="200">速度4</a-option>
                    <a-option value="100">速度5</a-option>
                </a-select>

                <a-button size="mini" @click="reset">确认设置</a-button>

            </a-space>

        </div>

        <!--画布-->
        <div class="flex flex-1 p-2 bg-white gap-2">
            <div ref="container" class="flex-1"></div>
            <div class="w-20 flex flex-col gap-4  p-2">
                <div>
                    <div class="a ba c" ref="preview"> </div>
                </div>
                <div>
                    <div>总分数</div>
                    <div class="flex-1">{{ score }}</div>
                </div>

                <div>
                    <div>总行数</div>
                    <div class="flex-1"> {{ total }} </div>
                </div>

                <div>
                    <a target="_blank" href="https://github.com/bgyh2003/tetris"> <icon-github
                            style="font-size: 32px;" /></a>

                </div>
            </div>
        </div>

        <!--控制按钮-->
        <div class="flex  bg-white  h-1/4  gap-1 ">

            <div class="flex-1 flex justify-center items-center ">
                <div @click="game.moveToBottom()"
                    class=" bg-blue-400 size-24 rounded-full shadow-md shadow-slate-500 cursor-pointer"> </div>
            </div>

            <div class=" flex flex-col p-2 gap-2 " style="width: 20%; font-size: 12px;">
                <div @click="start"
                    class=" flex justify-center items-center bg-blue-400 p-1 rounded-lg shadow-md shadow-slate-500 text-white cursor-pointer">
                    {{ btn[status] }}
                </div>
                <div @click="stop"
                    class=" flex justify-center items-center bg-blue-400 p-1 rounded-lg shadow-md shadow-slate-500 text-white cursor-pointer">
                    结束
                </div>

            </div>

            <div class=" flex-1 grid grid-cols-3 grid-rows-3  gap-1 ml-4 p-2">

                <div class="col-start-2 col-end-3">
                    <div @click="game.rotate()"
                        class="bg-blue-400 rounded-lg shadow-md shadow-slate-500  size-12 flex justify-center items-center text-white cursor-pointer">
                        <icon-arrow-up />
                    </div>
                </div>
                <div class="col-start-1 col-end-2">
                    <div @click="game.moveLeft()"
                        class="bg-blue-400 rounded-lg shadow-md shadow-slate-500  size-12 flex justify-center items-center text-white cursor-pointer">
                        <icon-arrow-left />
                    </div>
                </div>
                <div class="col-start-3 col-end-4">
                    <div @click="game.moveRight()"
                        class="bg-blue-400 rounded-lg shadow-md shadow-slate-500  size-12 flex justify-center items-center text-white cursor-pointer">
                        <icon-arrow-right />
                    </div>
                </div>
                <div class="col-start-2 col-end-3">
                    <div @click="game.moveDown()"
                        class="bg-blue-400 rounded-lg shadow-md shadow-slate-500  size-12 flex justify-center items-center text-white cursor-pointer">
                        <icon-arrow-down />
                    </div>
                </div>

            </div>


        </div>

    </div>

</template>

<style scoped></style>
