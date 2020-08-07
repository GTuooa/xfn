import { Modal } from 'antd';

export default function Alert (message) {

    // alert(message)
    // console.log('alert', message);
    // alert(message)
    Modal.confirm({
        title: '提示',
        content: message ? message : '',
        okText: '确认'
    })
}
