import type { UI } from './ui';

/** Simplified Chinese interface strings. Have a native speaker review before launch. */
export const zh: UI = {
  htmlLang: 'zh-CN',
  skip: '跳转到主要内容',
  nav: { home: '首页', about: '关于我们', services: '服务', news: '新闻', contact: '联系我们', quote: '获取报价', menu: '菜单', close: '关闭菜单', primary: '主导航', allServices: '全部服务' },
  learnMore: '了解详情', readMore: '阅读文章', backToNews: '返回新闻列表', published: '发布于',
  relatedServices: '其他服务', keyBenefits: '主要优势', serviceProcess: '服务流程', overview: '概述',
  quickQuote: { title: '快速询价', service: '服务', origin: '起运地', destination: '目的地', originPh: '城市或国家', destPh: '城市或国家', go: '前往报价表单', any: '选择服务' },
  contactCard: { address: '地址', phone: '电话', email: '电子邮箱', map: '在 Google 地图中查看', mapTitle: '我们的位置', mapNote: '在 Google 地图中打开我们的位置' },
  channelNames: { phone: '电话', email: '电子邮箱', wechat: '微信', line: 'LINE', whatsapp: 'WhatsApp', facebook: 'Facebook', linkedin: 'LinkedIn', telegram: 'Telegram', other: '联系方式' },
  footer: { explore: '导航', services: '服务', contact: '联系', privacy: '隐私政策', language: '语言' },
  services: { air: '空运', sea: '海运', land: '陆运', intl: '国际物流解决方案' },
  form: {
    required: '必填', optional: '选填',
    fullName: '姓名', company: '公司名称', email: '电子邮箱', phone: '电话号码',
    serviceType: '服务类型', selectService: '请选择服务',
    origin: '起运地', destination: '目的地', cargo: '货物描述', weight: '预估货物重量', volume: '预估货物体积',
    extra: '其他要求', subject: '主题', message: '留言',
    ph: { weight: '例如：250 公斤', volume: '例如：1.5 立方米', origin: '城市、港口或国家', destination: '城市、港口或国家', cargo: '您要运送什么？如已知，请注明包装类型和数量。', extra: '其他需要我们了解的信息，例如截止日期或特殊处理要求。' },
    serviceOptions: { 'air-freight': '空运', 'sea-freight': '海运', 'land-freight': '陆运', 'international-logistics': '国际物流解决方案', other: '暂不确定' },
    submitQuote: '提交报价申请', submitContact: '发送留言', sending: '发送中…',
    successTitle: '谢谢，我们已收到您的消息。', successQuote: '我们的团队将审阅您的申请，并通过邮件或电话回复。', successContact: '我们的团队将通过邮件或电话回复。',
    sendAnother: '再提交一个申请',
    errorTitle: '您的消息尚未发送。',
    err: {
      validation: '请检查标出的字段后重试。',
      captcha: '我们无法确认您是真人，请完成验证后重试。',
      captchaMissing: '发送前请先完成人机验证。',
      origin: '出于安全原因，请求已被拦截。请刷新页面后重试。',
      server: '我们这边出了点问题。请重试，或直接发送邮件至',
      network: '无法连接到服务器。请检查网络后重试，或直接发送邮件至',
      rate: '请求过多，请稍候再试。'
    },
    privacyNote: '我们仅将您提供的信息用于回复您的请求。'
  },
  notFound: { title: '页面未找到', body: '您要找的页面不存在或已移动。', home: '返回首页', quote: '获取报价' },
  adminOnly: ''
};
