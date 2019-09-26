<template>
    <div class="dagre-graph-container" :id="containerId">
        <svg class="dagre" :width="width" :height="height">
            <g class="container" :id="gId"></g>
        </svg>
    </div>
</template>
<script>
/**
 * 流程图
 */
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'
export default {
    name: 'DagreGraph',
    props: ['nodes', 'edges'],
    data() {
        return {
            id: '',
            renderer: null,
            g: null,
            zoom: null,
            containerId: '',
            gId: '',
            svg: null,
            width: 0,
            height: 0,
        }
    },
    watch: {
        nodes() {
            this.strokeNodes();
        },
    },
    created() {
        this.containerId = this.uuid();
        this.gId = this.uuid();
        this.g = new dagreD3.graphlib.Graph().setGraph({});
    },
    mounted () {
        this.$nextTick(() => {
            this.width = document.getElementById(this.containerId).clientWidth;
            this.height = document.getElementById(this.containerId).clientHeight - 5;
            this.renderer = new dagreD3.render();
            this.svg = d3.select(this.$el).select('svg.dagre');
            this.container = this.svg.select('g.container');
            // transform
            const transform = d3.zoomIdentity.translate(Math.floor(this.width / 3), Math.floor(this.height / 6)).scale(1) 
            this.zoom = d3.zoom()
                .scaleExtent([1 / 2, 2])
                .on('zoom', this.zoomed)
            this.container.transition().duration(750).call(this.zoom.transform, transform)
            this.svg.call(this.zoom.transform, transform)
            this.svg.call(this.zoom);
            this.strokeNodes();
        })
    },
    methods: {
        uuid () {
            function s4 () {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
            }
            return (
                s4() + s4() + '-' + s4() + '-' + s4() +  '-' + s4() + '-' + s4() + s4() + s4()
            )
        },
        /** 
         * @description control the canvas zoom to up or down
         */
        zoomed () {
            var transform = d3.event.transform,
                gCon = document.getElementById(this.gId).getBoundingClientRect(),
                gWidth = Math.ceil(gCon.width),
                gHeight = Math.ceil(gCon.height);
            if(transform.x < 0) {
                transform.x = 0;
            }
            if(transform.y < 0) {
                transform.y = 0;
            }
            if(gWidth + 200 > this.width) {
                this.width = gWidth + 200;
            }
            if(gHeight + 200 > this.height) {
                this.height = gHeight + 200;
            }
            if(transform.x + gWidth > this.width) {
                transform.x = this.width - gWidth;
            }
            if(transform.y + gHeight > this.height) {
                transform.y = this.height - gHeight;
            }
            this.container.attr('transform', transform)
        },
        /** 
         * @description 画节点
         */
        strokeNodes () {
            // 获取之前的nodes缓存并清除
            let nodes = this.g.nodes()
            if (nodes.length) {
                nodes.forEach(
                    item => {
                        this.g.removeNode(item)
                    }
                )
            }
            
            this.nodes.forEach((item) => {
                let type = 'no-status';
                if(item.type == 1) {
                    type = 'success';
                }
                if(item.state) {
                    type = item.state;
                }
                let shape = 'rect'

                let use = ''
                if(item.hasOwnProperty('use') && item.type != 1) {
                    use = 'use'
                }
                
                this.g.setNode(item.id, {
                    label: item.name,
                    shape: shape, 
                    class: use + ' dagre ' + type,
                    rx: 5,
                    ry: 5,
                });
            })
            this.strokeEdges();
        },
        /** 
         * @description 画线
         */
        strokeEdges () {
            //一个脚本节点时：不渲染eage
            if (this.nodes.length > 1) {
                this.edges.forEach(
                    (item) => {
                        var params = {
                            curve: d3.curveBasis, 
                            style: item.hasOwnProperty('line') ? 'fill: transparent;stroke-dasharray: 5, 5;' : ''
                        }
                        this.g.setEdge(item.from, item.to, params)
                    }
                )
            }
            this.renderer(this.container, this.g)
        }
    },
}
</script>

<style lang="scss">
.dagre-graph-container {
    overflow: auto;
    background: whitesmoke;
}
.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
/************ 图表变量 ***************/
$fail: #f77d6b;
$success: #61b2e4;
$running: #87d86f;
$skipped: #faec91;
$queued: #43e3ed;
$retry: #f8b96c;
$no-status: #fff;
$upstream_failed: rgb(163, 108, 108);
/**************** dagre 节点图************************/

g.node.dagre {
    tspan {
        fill: #fff;
        cursor: pointer;
    }
    &.no-status {
        rect {
            stroke: #333;
            fill: #fff;
        }
        ellipse {
            stroke: #333;
            fill: #fff;
        }
        circle {
            stroke: #333;
            fill: #fff;
        }
        tspan {
            fill: #333;
        }
    }
    &.use {
        tspan {
            fill: #999;
        }
        rect {
            stroke: #999;
            fill: #fff;
        }
    }
    &.success {
        rect {
            fill: $success;
        }
        ellipse {
            fill: $success;
        }
        circle {
            fill: $success;
        }
    }
    &.failed {
        rect {
            fill: $fail;
        }
        ellipse {
            fill: $fail;
        }
        circle {
            fill: $fail;
        }
    }
    &.upstream_failed {
        rect {
            fill: $upstream_failed;
        }
        ellipse {
            fill: $upstream_failed;
        }
        circle {
            fill: $upstream_failed;
        }
    }
    &.running {
        rect {
            fill: $running;
        }
        ellipse {
            fill: $running;
        }
        circle {
            fill: $running;
        }
    }
    &.skipped {
        rect {
            fill: $skipped;
        }
        ellipse {
            fill: $skipped;
        }
        circle {
            fill: $skipped;
        }
    }
    &.queued {
        rect {
            fill: $queued;
        }
        ellipse {
            fill: $queued;
        }
        circle {
            fill: $queued;
        }
    }
    &.BashOperator {
        &:hover {
            & > rect {
                cursor: pointer;
                fill: #7cc9fa;
            }  
        }
    }
    &.BranchPythonMapOperator {
        &:hover {
            & > ellipse {
                cursor: pointer;
                fill: #c52bd3;
            }  
        }
    }
    &.JoinOperator {
        &:hover {
            & > circle {
                cursor: pointer;
                fill: #0beb8d;
            }  
        }
    }
}
// g.node.dagre.use tspan {
//     fill: #999
// }
</style>