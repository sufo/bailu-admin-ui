<template>
	<div class="sales-rank">
    <n-tabs type="segment" animated size="small" @update:value="changeDate">
      <template #prefix>
        <span>热门商品排名</span>
      </template>
      <n-tab-pane :name="item.value" :tab="item.label" v-for="item in options.type">
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
			
	</div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
// import { DatePickerType } from "naive-ui/es/date-picker/src/config";
type DatePickerType = 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year' | 'quarter' | 'monthrange' | 'quarterrange' | 'yearrange' | 'week';

// 日期
const date = ref(dayjs().format("YYYY-MM-DD"));

// 类型
const dateType = ref("date");

// 选项
const options = reactive({
	type: [
		{
			label: "今日",
			value: "date"
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
