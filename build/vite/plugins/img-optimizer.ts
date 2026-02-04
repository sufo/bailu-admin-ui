import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default ViteImageOptimizer({
    /* 默认配置适合大多数项目 */
    test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
    exclude: undefined,
    include: undefined,
    includePublic: true, // 是否包含 public 文件夹
    logStats: true,      // 控制台打印压缩统计
    ansiColors: true,

    // 常用格式的具体优化参数
    png: {
        quality: 80,
    },
    jpeg: {
        quality: 80,
    },
    jpg: {
        quality: 80,
    },
    webp: {
        lossless: true, // 推荐使用无损，或根据需求设为 quality: 80
    },
    svg: {
        plugins: [
            {
                name: 'removeViewBox',
                active: false,
            },
            {
                name: 'addAttributesToSVGElement',
                params: {
                    attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                },
            },
        ],
    },
    gif: {
        // 数值越高，CPU 消耗越多，体积越小
        effort: 7,
        //开启隔行扫描/渐进式加载
        progressive: true,
        // 减少颜色数也能显著减小体积（2-256）
        colors: 128,
        // 允许帧间透明度误差，稍微调高（如 1-5）可以大幅压缩体积
        interFrameMaxError: 3,
    },
})