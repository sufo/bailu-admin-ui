<!--
 * @Author: sufo
 * @version: 
 * 
 * @Email: ouamour@Gmail.com
 * @LastEditTime: 2024-11-20 15:46:58
 * @Desc: 
-->
<template>
<div>
  <!---增加这一层div是为了解决n-scrollbar会产生两个div，导致transition警告--->
  <n-scrollbar class="view-dashboard" :x-scrollable="false">
    <n-grid cols="24" :x-gap="15" :y-gap="15" item-responsive responsive="screen">
      <n-gi span="24"><top-header /></n-gi>
      <n-gi span="24 m:12 l:6"><stats-user /></n-gi>
      <n-gi span="24 m:12 l:6"><stats-view /></n-gi>
      <n-gi span="24 m:12 l:6"><stats-paid /></n-gi>
      <n-gi span="24 m:12 l:6"><stats-effect /></n-gi>

      <n-gi span="24 l:14"><tab-chart /></n-gi>
      <n-gi span="24 l:10"><sales-rank /></n-gi>

      <n-gi span="24 l:14"><hot-search /></n-gi>
      <n-gi span="24 l:10"><category-ratio /></n-gi>

    </n-grid>
  </n-scrollbar>
</div>
</template>
<script setup lang="ts">
import statsUser from './components/stats-user.vue';
import statsView from './components/stats-view.vue';
import statsPaid from './components/stats-paid.vue';
import statsEffect from './components/stats-effect.vue';
import hotSearch from './components/hot-search.vue';
import salesRank from './components/sales-rank.vue';
import tabChart from './components/tab-chart.vue';
import categoryRatio from './components/category-ratio.vue';
import topHeader from './components/top-header.vue';
</script>
<style lang="scss">
.view-dashboard{
  overflow-x: hidden;

  .card {
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 12px;
    letter-spacing: 0.5px;
    line-height: 1;

    &__header {
      display: flex;
      align-items: center;
      height: 50px;
      padding: 0 20px;

      .label {
        font-size: 12px;
      }

      .value {
        font-size: 18px;
        font-weight: bold;
        margin-left: 10px;
      }
    }

    &__container {
      padding: 0 20px;
      height: 50px;
      overflow-x: hidden;
    }

    &__footer {
      display: flex;
      align-items: center;
      height: 50px;
      border-top: 1px solid #f7f7f7;
      font-size: 12px;
      margin: 0 5px;
      padding: 0 15px;
      box-sizing: border-box;

      .label {
        margin-right: 10px;
      }

      .value {
        font-size: 13px;
      }
    }
  }
  .n-grid>div{
    background-color: #fff;
    border-radius: 6px;
  }
}
.dark .view-dashboard{
  .n-grid>div{
    background-color: var(--background);
  }
}
</style>