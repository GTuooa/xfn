// 仅用于数字排序
// 升序
export default function ascOrder(x, y) {
    if (x - y > 0) {
        return 1
    } else if (x - y < 0) {
        return -1
    } else {
        return 0
    }
}
