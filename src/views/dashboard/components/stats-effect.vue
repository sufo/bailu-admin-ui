<template>
	<div class="stats-effect">
		<div class="card">
			<div class="card__header">
				<span class="label">总销售额</span>
				<span class="value">￥15920</span>
			</div>

			<div class="card__container">
				<n-progress :percentage="value" :stroke-width="10" :show-text="false" />
			</div>

			<div class="card__footer">
				<ul class="stats-effect__cop">
					<li>
						<span>周同比</span>

						<div class="fall">
							<icon icon="carbon:arrow-down-right" />

							<span>-4%</span>
						</div>
					</li>

					<li>
						<span>日同比</span>

						<div class="rise">
							<icon icon="carbon:arrow-top-right" />

							<span>+7%</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref(0);

setTimeout(() => {
	value.value = Math.random() * 30 + 30;
}, 0);
</script>

<style lang="scss" scoped>
.stats-effect {
	&__cop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		li {
			display: flex;
			list-style: none;
			flex: 1;

			.fall,
			.rise {
				display: flex;
				align-items: center;
				margin-left: 10px;
			}

			.fall {
				color: #13ae7c;
			}

			.rise {
				color: #f21e37;
			}
		}
	}

	.card__container {
		padding-top: 15px;
		box-sizing: border-box;
	}
}
</style>
