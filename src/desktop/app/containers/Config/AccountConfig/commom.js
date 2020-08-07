export const typeList = [
    {
        key: 'cash',
        value: '现金'
    },
    {
        key: 'general',
        value: '一般户'
    },
    {
        key: 'basic',
        value: '基本户'
    },
    {
        key: 'spare',
        value: '备用金'
    },
    {
        key: 'Alipay',
        value: '支付宝'
    },
    {
        key: 'WeChat',
        value: '微信'
    },
    {
        key: 'other',
        value: '其它'
    }
]

export const typeStr = (type) => ({
    'cash': () => '现金',
    'general': () => '一般户',
    'basic': () => '基本户',
    'Alipay': () => '支付宝',
    'WeChat': () => '微信',
    'other': () => '其它',
    'spare': () => '备用金'
}[type] || (() => ''))()
