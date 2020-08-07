// 降序
export function descOrder(x, y) {
    if (x - y < 0) {
        return 1
    } else if (x - y > 0) {
        return -1
    } else {
        return 0
    }
}
