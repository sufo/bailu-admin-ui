<template>
	<div class="sales-rank">
    <n-tabs type="segment" animated size="small" @update:value="changeDate">
      <template #prefix>
        <span>热门商品排名</span>
      </template>
      <n-tab-pane :name="item.value" :tab="item.label" v-for="(item, index) in options.type">
        <n-table striped>
          <thead>
            <tr>
              <th>排名</th>
              <th>商品名称</th>
              <th>商品金额</th>
              <th>下单次数</th>
              <th>日涨幅</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in 7">
              <td>{{ n }}</td>
              <td>pixel xl</td>
              <td>7800</td>
              <td>10034</td>
              <td>3</td>
            </tr>
            </tbody>
        </n-table>
      </n-tab-pane>
      <template #suffix>
        <n-date-picker v-model="date" :type="(dateType as DatePickerType)" />
      </template>
    </n-tabs>
		
    

			<!-- <ul class="sales-rank__list">
				<li>
					<span>1</span>
					<span>北京市朝阳区三里屯路</span>
					<span>323201</span>
				</li>
				<li>
					<span>2</span>
					<span>北京市朝阳区建国路-华贸购物中心</span>
					<span>278442</span>
				</li>
				<li>
					<span>3</span>
					<span>北京市朝阳区朝阳北路</span>
					<span>202368</span>
				</li>
				<li>
					<span>4</span>
					<span>北京市东城区王府井大街</span>
					<span>156320</span>
				</li>
				<li>
					<span>5</span>
					<span>北京市西城区西单北大街-大悦城</span>
					<span>98852</span>
				</li>
			</ul> -->
	</div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { DatePickerType } from "naive-ui/es/date-picker/src/config";

// 日期
const date = ref(dayjs().format("YYYY-MM-DD"));

// 类型
const dateType = ref("day");

// 选项
const options = reactive({
	type: [
		{
			label: "今日",
			value: "day"
    },
		{
			label: "本周",
			value: "week"
		},
		{
			label: "本月",
			value: "month"
		},
		{
			label: "全年",
			value: "year"
		}
	]
});

function changeDate(value: string) {
	dateType.value = value;
}

</script>

<style lang="scss">
.sales-rank {
  padding: 10px 16px;
  .n-tabs-nav--segment-type{
    .n-tabs-nav__prefix{
      white-space: nowrap;
      flex:1;
    }
    .n-tabs-rail{width: 200px;}
  }
}
</style>
