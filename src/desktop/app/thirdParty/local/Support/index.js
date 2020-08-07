export function openLink (opts) {
    // window.location.href = opts.url

    // console.log(opts);
    
    window.open(opts.url)
}

export function downloadFile (opts) {
    // window.location.href = opts.url
    window.open(opts.url, 'downloadFile');
    // window.location.href = opts.url
}
