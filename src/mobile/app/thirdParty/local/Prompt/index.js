
export default function Prompt (opts) {

    var value = prompt(opts.message, "")

    if (value !== null && value !== "") {
        const result = {
            buttonIndex: 1,
            value: value
        }
        opts.onSuccess(result)
    }
}
