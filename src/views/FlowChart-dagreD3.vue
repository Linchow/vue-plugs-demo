<template>
    <div class="flowChart-box">
        <DagreGraph :nodes="nodes" :edges="edges" style="width: 100%; height: 100%;"></DagreGraph>
    </div>
</template>
<script>
import DagreGraph from '@/components/DagreGraph'
export default {
    name: 'flowChart-dagreD3',
    data() {
        return {
            nodes: [
                {
                    "name": "超额拖欠-开场白",
                    "id": 199,
                    "type": "1",
                    state: 'failed'
                }, {
                    "name": "本人",
                    "id": 179,
                    "type": "2"
                }, {
                    "name": "非正面描述",
                    "id": 180,
                    "type": "2",
                    use: 1
                }, {
                    "name": "要求重述",
                    "id": 181,
                    "type": "2"
                }, {
                    "name": "不是本人",
                    "id": 182,
                    "type": "2"
                }, {
                    "name": "超额拖欠",
                    "id": 200,
                    "type": "1"
                }, {
                    "name": "还款可以",
                    "id": 173,
                    "type": "2"
                }, {
                    "name": "3天内有时间",
                    "id": 174,
                    "type": "2"
                }, {
                    "name": "3天后有时间",
                    "id": 175,
                    "type": "2"
                }, {
                    "name": "资金问题",
                    "id": 176,
                    "type": "2"
                }, {
                    "name": "时间、资金都有问题",
                    "id": 177,
                    "type": "2"
                }, {
                    "name": "超额拖欠-施压",
                    "id": 201,
                    "type": "1"
                }, {
                    "name": "用户确认",
                    "id": 171,
                    "type": "2"
                }, {
                    "name": "超额拖欠-申请期限说明",
                    "id": 202,
                    "type": "1"
                }, {
                    "name": "好的，我知道了",
                    "id": 157,
                    "type": "2"
                }, {
                    "name": "超额拖欠-无法延期说明",
                    "id": 203,
                    "type": "1"
                }, {
                    "name": "好的，我知道了",
                    "id": 159,
                    "type": "2"
                }, {
                    "name": "超额拖欠-最小金额说明",
                    "id": 204,
                    "type": "1"
                }, {
                    "name": "好的，我知道了",
                    "id": 167,
                    "type": "2"
                }, {
                    "name": "超额拖欠-无法延期及最小金额说明",
                    "id": 205,
                    "type": "1"
                }, {
                    "name": "好的，我知道了",
                    "id": 165,
                    "type": "2"
                }, {
                    "name": "超额拖欠-确认接听人是否认识客户",
                    "id": 206,
                    "type": "1"
                }, {
                    "name": "认识",
                    "id": 187,
                    "type": "2"
                }, {
                    "name": "我不认识这个人",
                    "id": 188,
                    "type": "2"
                }, {
                    "name": "超额拖欠-接听人认识客户",
                    "id": 207,
                    "type": "1"
                }, {
                    "name": "没听明白，你重新说",
                    "id": 190,
                    "type": "2"
                }, {
                    "name": "行，我告诉他",
                    "id": 191,
                    "type": "2"
                }, {
                    "name": "不行，我找不到他",
                    "id": 192,
                    "type": "2"
                }, {
                    "name": "接听人要帮客户还钱",
                    "id": 193,
                    "type": "2"
                }, {
                    "name": "超额拖欠-接听人要帮客户还钱",
                    "id": 208,
                    "type": "1"
                }, {
                    "name": "没听明白，你重新说",
                    "id": 195,
                    "type": "2"
                }, {
                    "name": "我是他的家人",
                    "id": 196,
                    "type": "2"
                }, {
                    "name": "超额拖欠-结束语",
                    "id": 209,
                    "type": "1"
                }, {
                    "name": "再见",
                    "id": 144,
                    "type": "2"
                }
            ],
            edges: [
                {
                    "from": 199,
                    "to": 179,
                    line: 1
                }, {
                    "from": 199,
                    "to": 180,
                    line: 1
                }, {
                    "from": 199,
                    "to": 181,
                    line: 1
                }, {
                    "from": 199,
                    "to": 182,
                    line: 1
                }, {
                    "from": 179,
                    "to": 200,
                    line: 1
                }, {
                    "from": 180,
                    "to": 199,
                    line: 1
                }, {
                    "from": 181,
                    "to": 199
                }, {
                    "from": 182,
                    "to": 206
                }, {
                    "from": 200,
                    "to": 173
                }, {
                    "from": 200,
                    "to": 174
                }, {
                    "from": 200,
                    "to": 175
                }, {
                    "from": 200,
                    "to": 176
                }, {
                    "from": 200,
                    "to": 177
                }, {
                    "from": 176,
                    "to": 204
                }, {
                    "from": 177,
                    "to": 205
                }, {
                    "from": 173,
                    "to": 201
                }, {
                    "from": 174,
                    "to": 202
                }, {
                    "from": 175,
                    "to": 203
                }, {
                    "from": 201,
                    "to": 171
                }, {
                    "from": 171,
                    "to": 209
                }, {
                    "from": 202,
                    "to": 157
                }, {
                    "from": 157,
                    "to": 201
                }, {
                    "from": 203,
                    "to": 159
                }, {
                    "from": 159,
                    "to": 201
                }, {
                    "from": 204,
                    "to": 167
                }, {
                    "from": 167,
                    "to": 201
                }, {
                    "from": 205,
                    "to": 165
                }, {
                    "from": 165,
                    "to": 201
                }, {
                    "from": 206,
                    "to": 187
                }, {
                    "from": 206,
                    "to": 188
                }, {
                    "from": 187,
                    "to": 207
                }, {
                    "from": 188,
                    "to": 209
                }, {
                    "from": 207,
                    "to": 190
                }, {
                    "from": 207,
                    "to": 191
                }, {
                    "from": 207,
                    "to": 192
                }, {
                    "from": 207,
                    "to": 193
                }, {
                    "from": 192,
                    "to": 209
                }, {
                    "from": 193,
                    "to": 208
                }, {
                    "from": 190,
                    "to": 207
                }, {
                    "from": 191,
                    "to": 209
                }, {
                    "from": 208,
                    "to": 195
                }, {
                    "from": 208,
                    "to": 196
                }, {
                    "from": 195,
                    "to": 208
                }, {
                    "from": 196,
                    "to": 200
                }, {
                    "from": 209,
                    "to": 144
                }
            ]
        }
    },
    components: {
        DagreGraph
    },
    created() {
        
    },
    methods: {
        
    },
}
</script>

<style scoped>
.flowChart-box {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>