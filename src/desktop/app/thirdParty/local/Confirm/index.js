import { Modal } from 'antd'

export default function Confirm (opts) {

    // alert(message)
    // console.log('alert', message);
    Modal.confirm({
        title: opts.title ? opts.title : '提示',
        content: opts.message,
        okText: opts.buttonLabels[1],
        cancelText: opts.buttonLabels[0],
        onOk: () => opts.onSuccess({buttonIndex: 1}),
        onCancel: () => opts.onSuccess({buttonIndex: 0})
    })
    // if (confirm(opts.message)) {
    //
    //     const result = {buttonIndex: 1}
    //
    //
    //
    //     opts.onSuccess(result)
    //
    // } else {
    //     const result = {buttonIndex: 0}
    //
    //     opts.onSuccess(result)
    // }

}
