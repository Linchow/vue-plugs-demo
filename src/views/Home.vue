<template>
    <div class="box">
        <div class="container">
            <h1>vue-plugs-demo</h1>
            <p>总结一些vue插件的用法，定期更新~</p>
            <ul>
                <li>
                    <router-link to="/flowChart-gojs">flowChart-gojs - 流程图gojs</router-link>
                </li>
                <li>
                    <router-link to="/flowChart-dagreD3">flowChart-dagreD3 - 流程图dagreD3</router-link>
                </li>
                <li>
                    <router-link to="/print">print - 打印</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'home'
}
</script>

<style scoped>
.box {
    max-width: 1000px;
    min-height: 300px;
    margin: 30px auto;
    background: #fff;
    border-radius: 5px;
}
.container {
    padding: 30px;
    text-align: justify;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 16px;
    line-height: 1.7;
}
@media screen and (max-width: 768px) {
    .container {
        padding: 15px;
    }
}
.container h1 {
    color: #000;
    font-size: 26px;
    margin-bottom: 30px;
    font-weight: 700;
    font-family: PingHei,'Microsoft JhengHei','Microsoft YaHei',STHeiti,SimHei;
}
.container p {
    margin: 15px 0;
    color: #333;
}
.container li {
    list-style-type: disc;
}
.container ul {
    list-style-type: disc;
    margin-left: 2em;
    font-size: 16px;
    line-height: 1.7;
}
.container a {
    color: #08c;
}
</style>