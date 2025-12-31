<template>
	<div class="hot-search">
		<div class="hot-search__header">
			<span>线上热门搜索</span>
		</div>

		<div class="hot-search__container">
			<n-grid class="hot-search__chart" :x-gap="20"
          cols="1 m:2" item-responsive responsive="screen">
				<n-gi>
					<div class="block">
						<div class="count">
							<div class="number">
								<span>搜索用户数</span>
								<span>1242</span>
							</div>
							<div class="rise">
								<i class="n-icon-top-right"></i>
								<span>+7%</span>
							</div>
						</div>

						<v-chart :option="chartOption()" autoresize />
					</div>
				</n-gi>

				<n-gi>
					<div class="block is-last">
						<div class="count">
							<div class="number">
								<span>关注用户数</span>
								<span>365</span>
							</div>
							<div class="rise">
								<i class="n-icon-top-right"></i>
								<span>+2%</span>
							</div>
						</div>

						<v-chart :option="chartOption()" autoresize />
					</div>
				</n-gi>
			</n-grid>

			<div class="hot-search__table">
				<n-data-table
          :columns="columns"
          :data="data"
          :bordered="false"/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";

const data = [
  {
    keyWord: "智能家居设备",
    users: 983,
    ud: 5
  },
  {
    keyWord: "智能音箱",
    users: 763,
    ud: -3
  },
  {
    keyWord: "家用投影仪",
    users: 328,
    ud: 7
  },
  {
    keyWord: "智能手表",
    users: 144,
    ud: 4
  },
  {
    keyWord: "智能手环",
    users: 121,
    ud: -1
  }
];
const columns = [
  {
    title: '排名',
    key: 'sort',
    width: 60
  },
  {
    title: "搜索关键词",
    key: "keyWord",
    minWidth: 100
  },
  {
    title: "用户数",
    key: "users",
    minWidth: 100
  },
  {
    title: "周涨幅",
    key: "ud",
    sortable: "desc",
    minWidth: 100
  }
];

function chartOption() {
	return {
		grid: {
			left: 0,
			top: 10,
			right: 0,
			bottom: 0
		},
		xAxis: {
			type: "category",
			data: [],
			boundaryGap: false
		},
		yAxis: {
			type: "value",
			splitLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLine: {
				show: false
			},
			axisLabel: {
				show: false
			}
		},
		series: [
			{
				name: "总访问量",
				type: "line",
				smooth: true,
				showSymbol: false,
				symbol: "circle",
				symbolSize: 6,
				data: new Array(12)
					.fill(1)
					.map(() => parseInt((Math.random() * 1000).toFixed(0)) + 500),
				areaStyle: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: "#D1E5FF"
							},
							{
								offset: 1,
								color: "#FFFFFF"
							}
						],
						false
					)
				},
				itemStyle: {
					color: "#4165d7"
				},
				lineStyle: {
					width: 2
				}
			}
		]
	};
}
</script>

<style lang="scss" scoped>
.hot-search {
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		padding: 0 20px;
	}

	&__container {
		padding-bottom: 10px;
	}

	&__chart {
		padding: 0 20px;

		.block {
			.count {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 10px;
				height: 40px;

				.fall,
				.rise {
					display: flex;
					align-items: center;
					margin-left: 10px;
					font-size: 15px;
				}

				.fall {
					color: #13ae7c;
				}

				.rise {
					color: #f21e37;
				}

				.number {
					display: flex;
					align-items: center;

					span {
						font-size: 13px;

						&:last-child {
							margin-left: 10px;
							font-size: 15px;
							font-weight: bold;
						}
					}
				}
			}

			.echarts {
				height: 70px;
				width: 100%;
			}
		}
	}

	&__table {
		margin: 0 10px;
	}
}
</style>
