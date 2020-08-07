//数字校验
export default function judgePermission(permissionItem) {

    const display = permissionItem && permissionItem.get('display') !== 'NO' ? true : false;
    const disabled = permissionItem && permissionItem.get('display') === 'SHOW' ? false : true;

    return {
        display,
        disabled,
    };
}
