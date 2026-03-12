# UV防护助手 - 移动端Web应用

这是一个专为澳大利亚环境设计的紫外线（UV）防护移动端Web应用，基于权威健康机构的科学数据，提供个性化的UV防护建议。

## 主要功能

### 🌞 US 1.1: 实时UV指数显示
- 基于地理位置显示当前UV指数（8-12之间的模拟数据）
- 直观的圆形仪表盘展示UV强度
- 实时更新和刷新功能
- UV等级颜色编码（低、中等、高、非常高、极高）
- 当UV指数≥8时显示紧急警告

### 📚 US 2.1: 本地化UV影响知识库
- 6大核心健康风险类别：
  - DNA损伤与细胞突变
  - 光老化与皮肤衰老
  - 皮肤癌风险评估
  - 眼部紫外线伤害
  - 维生素D与UV平衡
  - 儿童UV防护要点
- 每个类别包含：
  - 详细的生物学机制说明
  - 澳大利亚本地统计数据
  - 具体防护建议
  - 权威来源标注（Cancer Council, ARPANSA等）

### 👤 US 2.2: 肤色定制化分析工具
- Fitzpatrick肤色分类（I-VI级）
- 可视化肤色选择器
- 个性化晒伤时间计算
- 黑色素水平分析
- 维生素D合成需求评估
- 针对不同肤色的定制化防护建议
- 本地存储用户肤色设置

### 🧴 US 3.1: 精细化防晒霜用量建议
- 分部位防晒霜用量计算：
  - 面部和颈部
  - 双臂（含手）
  - 躯干前后
  - 双腿前后
- 多种计量单位切换：
  - 茶勺（澳大利亚常用）
  - 毫升（精确测量）
  - 手指长度法（直观操作）
- 总用量可视化展示
- UV≥8时的穿搭建议：
  - UPF 50+ 防晒衣
  - 宽檐帽（≥7.5cm）
  - UV400太阳镜
  - 长袖轻质衬衫
- UPF防护等级说明
- 热舒适度与防护平衡建议
- "Slip, Slop, Slap, Seek, Slide"澳大利亚防晒口诀

## 技术实现

### 架构
- **React 18** + **TypeScript**
- **React Router** 用于多页面导航
- **Tailwind CSS v4** 用于样式
- **Radix UI** 组件库
- **Lucide React** 图标库

### 核心特性
- 📱 移动端优先设计
- 🎨 响应式布局
- 💾 LocalStorage数据持久化
- 🔄 模拟API调用（可替换为真实API）
- 🌐 中文界面
- ⚡ 快速加载和流畅动画
- 🎯 iOS/Android安全区域支持

## 数据来源

所有健康和科学数据均基于以下权威机构：
- **Cancer Council Australia** - 澳大利亚癌症委员会
- **ARPANSA** - 澳大利亚辐射防护与核安全局
- **Melanoma Institute Australia** - 澳大利亚黑色素瘤研究所
- **Optometry Australia** - 澳大利亚验光协会
- **Australian Government Department of Health** - 澳大利亚卫生部

## 使用说明

### 首次使用
1. 应用会请求地理定位权限（可选）
2. 建议前往"肤色"页面设置您的Fitzpatrick肤色类型
3. 设置后，首页会显示个性化的晒伤时间预估

### 日常使用
1. **UV指数页**：查看当前UV强度，点击刷新获取最新数据
2. **知识页**：了解UV对健康的影响和科学防护知识
3. **肤色页**：设置或修改您的肤色类型
4. **防晒页**：查看防晒霜用量和穿搭建议

### 防护建议
- UV指数 3-7：使用SPF30+防晒霜，佩戴太阳镜和帽子
- UV指数 8-10：采取全面防护，避免上午10点至下午4点外出
- UV指数 11+：极高风险，建议待在室内或完全阴凉处

## API集成（可选）

当前应用使用模拟数据。如需集成真实UV API：

1. 注册OpenUV API（https://www.openuv.io/）
2. 替换 `Home.tsx` 中的 `fetchUVData` 函数：

```typescript
const fetchUVData = async (lat: number, lng: number) => {
  const response = await fetch(
    `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`,
    {
      headers: {
        'x-access-token': 'YOUR_API_KEY'
      }
    }
  );
  const data = await response.json();
  // 处理API返回的数据
};
```

⚠️ **注意**：API密钥不应暴露在前端代码中。建议使用Supabase Edge Functions或其他后端服务来安全地调用外部API。

## 免责声明

此应用仅供教育和信息参考，不能替代专业医疗建议。如有皮肤健康问题，请咨询皮肤科医生。所有统计数据和建议均基于公开发布的权威机构资料。

---

**开发时间**: 2026年3月9日  
**目标用户**: 澳大利亚居民及游客  
**适用平台**: iOS Safari、Android Chrome、移动端浏览器
