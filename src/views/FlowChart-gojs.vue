<template>
	<div>
		<div style="width: 100%; display: flex; justify-content: space-between">
			<div id="myPaletteDiv" style="width: 100px; margin-right: 2px; background-color: whitesmoke; border: solid 1px black"></div>
			<div id="myDiagramDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div>
		</div>
		<button @click="getData">获取数据</button>
		<button @click="loadData">加载数据</button>
	</div>
</template>

<script>
import go from "gojs";

export default {
	name: "flowChart-gojs",
	data() {
		return {
			myDiagram: null,
			Select_Port: null,
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			var _this = this;
			var $ = go.GraphObject.make; 

			_this.myDiagram =
				$(go.Diagram, "myDiagramDiv",
				{
					"LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
					"LinkRelinked": showLinkLabel,
					"grid.visible": true, // 显示网格
					allowCopy: false,
					"undoManager.isEnabled": true  // 支持 Ctrl-Z 和 Ctrl-Y 操作
				});

			// 当有变化时 title 加* 并且启用button 否则禁用
			_this.myDiagram.addDiagramListener("Modified", function() {
				var button = document.getElementById("SaveButton");
				if (button) button.disabled = !_this.myDiagram.isModified;
				var idx = document.title.indexOf("*");
				if (_this.myDiagram.isModified) {
					if (idx < 0) document.title += "*";
				} else {
					if (idx >= 0) document.title = document.title.substr(0, idx);
				}
			});

			// 节点位置
			function nodeStyle() {
				return [
					new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
					{
						locationSpot: go.Spot.Center
					}
				];
			}

			// 控制连线方向 样式
			function makePort(name, align, spot, output, input) {
				var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
				return $(go.Shape,
				{
					fill: "transparent",  // changed to a color in the mouseEnter event handler
					strokeWidth: 0,  // no stroke
					width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
					height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
					alignment: align,  // align the port on the main Shape
					stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
					portId: name,  // declare this object to be a "port"
					fromSpot: spot,  // declare where links may connect at this port
					fromLinkable: output,  // declare whether the user may draw links from here
					toSpot: spot,  // declare where links may connect at this port
					toLinkable: input,  // declare whether the user may draw links to here
					cursor: "pointer",  // show a different cursor to indicate potential link point
					mouseEnter: function(e, port) {  // the PORT argument will be this Shape
						if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
					},
					mouseLeave: function(e, port) {
						port.fill = "transparent";
					}
				});
			}

			// 字体样式
			function textStyle() {
				return {
					font: "bold 12pt Helvetica, Arial, sans-serif",
					stroke: "whitesmoke"
				}
			}

			// 方框
			_this.myDiagram.nodeTemplateMap.add("Step", 
				$(go.Node, "Table", nodeStyle(),
					$(go.Panel, "Auto",
						$(go.Shape, "Rectangle",
						{ strokeWidth: 0 },
						new go.Binding("figure", "figure"),
						new go.Binding("fill", "color"),),
						$(go.TextBlock, textStyle(),
						{
							margin: 8,
							maxSize: new go.Size(160, NaN),
							wrap: go.TextBlock.WrapFit,
							editable: true
						},
						new go.Binding("text").makeTwoWay())
					),
					makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
					makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
					makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
					makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
				)
			);

			// 选择框
			_this.myDiagram.nodeTemplateMap.add("Conditional",
				$(go.Node, "Table", nodeStyle(),
					$(go.Panel, "Auto",
						$(go.Shape, "Diamond",
						{ fill: "#00A9C9", strokeWidth: 0 },
						new go.Binding("figure", "figure")),
						$(go.TextBlock, textStyle(),
						{
							margin: 8,
							maxSize: new go.Size(160, NaN),
							wrap: go.TextBlock.WrapFit,
							editable: true
						},
						new go.Binding("text").makeTwoWay())
					),
					makePort("T", go.Spot.Top, go.Spot.Top, false, true),
					makePort("L", go.Spot.Left, go.Spot.Left, true, true),
					makePort("R", go.Spot.Right, go.Spot.Right, true, true),
					makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
				)
			);

			// 开始
			_this.myDiagram.nodeTemplateMap.add("Start",
				$(go.Node, "Table", nodeStyle(),
				$(go.Panel, "Auto",
					$(go.Shape, "Circle",
					{ minSize: new go.Size(40, 40), fill: "#79C900", strokeWidth: 0 }),
					$(go.TextBlock, "Start", textStyle(),
					new go.Binding("text"))
				),
				makePort("L", go.Spot.Left, go.Spot.Left, true, false),
				makePort("R", go.Spot.Right, go.Spot.Right, true, false),
				makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
				)
			);

			// 结束
			_this.myDiagram.nodeTemplateMap.add("End",
				$(go.Node, "Table", nodeStyle(),
				$(go.Panel, "Auto",
					$(go.Shape, "Circle",
					{ minSize: new go.Size(40, 40), fill: "#DC3C00", strokeWidth: 0 }),
					$(go.TextBlock, "End", textStyle(),
					new go.Binding("text"))
				),
				makePort("T", go.Spot.Top, go.Spot.Top, false, true),
				makePort("L", go.Spot.Left, go.Spot.Left, false, true),
				makePort("R", go.Spot.Right, go.Spot.Right, false, true)
				)
			);

			// 自定义图形 file
			go.Shape.defineFigureGenerator("File", function(shape, w, h) {
				var geo = new go.Geometry();
				var fig = new go.PathFigure(0, 0, true); // starting point
				geo.add(fig);
				fig.add(new go.PathSegment(go.PathSegment.Line, .75 * w, 0));
				fig.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
				fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
				fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
				var fig2 = new go.PathFigure(.75 * w, 0, false);
				geo.add(fig2);
				// The Fold
				fig2.add(new go.PathSegment(go.PathSegment.Line, .75 * w, .25 * h));
				fig2.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
				geo.spot1 = new go.Spot(0, .25);
				geo.spot2 = go.Spot.BottomRight;
				return geo;
			});

			// comment
			_this.myDiagram.nodeTemplateMap.add("Comment",
				$(go.Node, "Auto", nodeStyle(),
				$(go.Shape, "File",
					{ fill: "#DEE0A3", strokeWidth: 0 }),
				$(go.TextBlock, textStyle(),
					{
					margin: 5,
					maxSize: new go.Size(200, NaN),
					wrap: go.TextBlock.WrapFit,
					textAlign: "center",
					editable: true,
					font: "bold 12pt Helvetica, Arial, sans-serif",
					stroke: '#454545'
					},
					new go.Binding("text").makeTwoWay())
				)
			);

			// 替换默认连线
			_this.myDiagram.linkTemplate =
				$(go.Link,  // the whole link panel
				{
					routing: go.Link.AvoidsNodes,
					curve: go.Link.JumpOver,
					corner: 5, toShortLength: 4,
					relinkableFrom: true,
					relinkableTo: true,
					reshapable: true,
					resegmentable: true,
					// mouse-overs subtly highlight links:
					mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
					mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
					selectionAdorned: false
				},
				new go.Binding("points").makeTwoWay(),
				$(go.Shape,  // the highlight shape, normally transparent
					{ isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
				$(go.Shape,  // the link path shape
					{ isPanelMain: true, stroke: "gray", strokeWidth: 2 },
					new go.Binding("stroke", "isSelected", function(sel) { return sel ? "dodgerblue" : "gray"; }).ofObject()),
				$(go.Shape,  // the arrowhead
					{ toArrow: "standard", strokeWidth: 0, fill: "gray" }),
				$(go.Panel, "Auto",  // the link label, normally not visible
					{ visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
					new go.Binding("visible", "visible").makeTwoWay(),
					$(go.Shape, "RoundedRectangle",  // the label shape
					{ fill: "#F8F8F8", strokeWidth: 0 }),
					$(go.TextBlock, "Yes",  // the label
					{
						textAlign: "center",
						font: "10pt helvetica, arial, sans-serif",
						stroke: "#333333",
						editable: true
					},
					new go.Binding("text").makeTwoWay())
				)
			);

			function showLinkLabel(e) {
				var label = e.subject.findObject("LABEL");
				if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
			}

			_this.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
			_this.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

			this.loadData();  // load an initial diagram from some JSON text

			// 初始化页面左侧的菜单
			$(go.Palette, "myPaletteDiv", 
				{
					nodeTemplateMap: _this.myDiagram.nodeTemplateMap,
					model: new go.GraphLinksModel([
						{ category: "Start", text: "开始" },
						{ category: "Step", color: "#00A9C9", text: "Step" },
						{ category: "Conditional", text: "???" },
						{ category: "End", text: "结束" },
						{ category: "Comment", text: "Comment" }
					])
				}
			);
		},
		getData() {
			console.log(JSON.parse(this.myDiagram.model.toJson()))
			alert(this.myDiagram.model.toJson())
			this.myDiagram.isModified = false;
		},
		loadData() {
			let str = `{ "class": "GraphLinksModel",
				"nodeDataArray": [ 
				{"category":"Start", "text":"Start", "key":-1, "location":"-319.95270462864556 -234.97569392592823"},
				{"category":"End", "text":"End", "key":-4, "location":"246.0472953713545 146.02430607407177"},
				{"category":"Step","color": "#00A9C9", "text":"测试数据", "key":-2, "location":"-24.952704628645506 -63.975693925928226"}
				],
				"linkDataArray": [ 
				{"from":-1, "to":-2, "points":[-293.4606079716688,-234.97569392592823,-283.4606079716688,-234.97569392592823,-179.20665630015716,-234.97569392592823,-179.20665630015716,-63.975693925928226,-74.9527046286455,-63.975693925928226,-64.9527046286455,-63.975693925928226]},
				{"from":-2, "to":-4, "points":[15.047295371354494,-63.975693925928226,25.047295371354494,-63.975693925928226,119.56664493530798,-63.975693925928226,119.56664493530798,146.02430607407177,214.08599449926146,146.02430607407177,224.08599449926146,146.02430607407177]}
				]}`
			this.myDiagram.model = go.Model.fromJson(str);

		}
	}
};
</script>

<style scope>
button {
	margin: 0 10px;
	border: 1px solid #ddd;
	padding: 5px;
	background: #fff;
}
</style>
