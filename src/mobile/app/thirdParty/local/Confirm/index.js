
export default function Confirm (opts) {

    if (confirm(opts.message)) {

        const result = {buttonIndex: 1}
        opts.onSuccess(result)

    } else {

        const result = {buttonIndex: 0}
        opts.onSuccess(result)
    }

}
