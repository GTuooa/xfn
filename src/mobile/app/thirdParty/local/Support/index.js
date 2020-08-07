import toast from 'app/thirdParty/common/Toast'

export function setTitle (opts) {
    console.log('setTitle:', opts.title)
}

export function setRight (opts) {
    console.log('setRight:', opts.show)
}

export function setIcon (opts) {
    console.log('showIcon:', opts.showIcon)
}

export function setMenu (opts) {
    console.log('setMenu:', opts)
}

export function openLink (opts) {
    window.location.href = opts.url
}

export function ddToast (opts) {
    toast.info(opts.text, opts.duration)
}
