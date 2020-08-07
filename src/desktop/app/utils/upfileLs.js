import getFileNameNoExt from './getFileNameNoExt'

export default function upfile (config) {
    // console.log('config',config)

            var file = config.file
            var dir = config.dir || ""
            var token = config.token
            var callback = config.callback || function () {}
            var retries = config.retries || 0
            var maxSize = config.maxSize || 0
            var configName = config.name||file.name
            var upload_url = "https://upload.media.aliyun.com/api/proxy/upload"
            var blockInit = "https://upload.media.aliyun.com/api/proxy/blockInit"
            var blockUpload = "https://upload.media.aliyun.com/api/proxy/blockUpload"
            var blockComplete = "https://upload.media.aliyun.com/api/proxy/blockComplete"
            var chunkSize = config.chunkSize||10 * 1024 * 1024
            var offset = 0
            var blob = file
            var id   //上传唯一id，上传初始化请求获得
            var uploadId  //分片上传id，上传初始化请求获得
            var tags = [] //每次分片上传得到的md5
            var curChunkSize = [], chunkBlob = [];  //分块上传的各个块

            function handleError(result, finish, chunk, status) {
                //重试
                if (retries-- > 0 && !finish && status != 599) {
                    if (file.size > chunkSize) {
                        //分块上传
                        uploadNextChunk(chunk, curChunkSize[chunk], chunkBlob[chunk]);
                    } else {
                        //普通上传
                        uploadSingle();
                    }
                } else {
                    callback(-1, result);
                }
            }

            //上传分块之前需要提交个start请求，上传结束需要提交个finish请求
            function startChunks() {
                var tmp = 0, size;
                while (tmp < blob.size) {
                    size = Math.min(chunkSize, blob.size - tmp);
                    curChunkSize.push(size);
                    chunkBlob.push(blob.slice(tmp, tmp + size));
                    tmp += size;
                }
                uploadNextChunk(0, curChunkSize[0], chunkBlob[0])
            }

            function uploadNextChunk(chunk, curchunksize, chunkblob) {
                var formData = new FormData();
                formData.append('size', curchunksize);
                var url;
                if (chunk == 0) {
                    formData.append('dir', dir);
                    formData.append('name', configName);
                    url = blockInit;
                } else {
                    formData.append('id', id);
                    formData.append('uploadId', uploadId);
                    formData.append('partNumber', chunk + 1); //chunk从0开始,partNumber从1开始
                    url = blockUpload;
                }
                formData.append('content', chunkblob, blob.name);

                ajax(url, formData, function (e) {
                    var status = e.status,
                        message = e.statusText || "";
                    if (status == 200 && message == "OK") {
                        var result = JSON.parse(e.responseText);
                        tags[chunk] = result.eTag;
                        offset += curchunksize;

                        var percent = Math.ceil(offset / file.size * 100);
                        //改变显示的中间状态
                        callback(percent);

                        if (chunk == 0) {
                            id = result.id;
                            uploadId = result.uploadId;
                            for (var i = 1; i < chunkBlob.length; i++) {
                                uploadNextChunk(i, curChunkSize[i], chunkBlob[i])
                            }
                        }

                        // Check if file is uploaded
                        if (offset >= blob.size) {
                            blob = null;
                            chunkblob = formData = null; // Free memory
                            finishChunks();
                        }
                    } else {
                        handleError(JSON.parse(e.responseText), 0, chunk, status);
                    }

                });
            }

            function finishChunks() {
                var parts = [];
                for (var i = 0; i < tags.length; i++) {
                    parts[i] = {
                        "partNumber": i + 1,
                        "eTag": tags[i]
                    }
                }
                parts = btoa(JSON.stringify(parts));
                var formData = new FormData();
                formData.append('id', id);
                formData.append('uploadId', uploadId);
                formData.append('parts', parts);

                ajax(blockComplete, formData, function (e) {
                    var status = e.status,
                        message = e.statusText || "";
                    if (status == 200 && message == "OK") {
                        callback(100, JSON.parse(e.responseText));
                    } else {
                        handleError(JSON.parse(e.responseText), 1, "", status);  //分片上传已经完成就不能重试了
                    }
                })
            }

            function uploadSingle() {
                var formData = new FormData();
                formData.append('dir', dir);
                formData.append('name', configName);
                formData.append('size', file.size);
                formData.append('content', file);
                var url = upload_url;

                ajax(url, formData, function (e) {
                    var status = e.status,
                        message = e.statusText || "";
                    if (status == 200 && message == "OK") {
                        callback(100, JSON.parse(e.responseText));
                    } else {
                        handleError(JSON.parse(e.responseText), "", "", status);
                    }
                });
            }

            function ajax(url,data,complete){
                var request = new XMLHttpRequest();
                var query = 'Authorization=' + token + '&UserAgent=ALIMEDIASDK_WORKSTATION';
                if(url.indexOf('?') > -1){
                    url += '&' + query;
                }else{
                    url += '?' + query;
                }
                request.open('POST', url);

                request.onload = function(e) {
                    complete(request);
                };
                request.send(data);
            }

            if (!file || !token) {
                callback(-1, '上传文件参数必须配置file以及token');
                return;
            }

            if (maxSize && file.size > maxSize) {
                //callback(-1, "文件大小不能超过"+maxSize);
                callback(-1, "文件大小不能超过10M");

                return;
            }

            const fileNameNoExt = getFileNameNoExt(file.name)
            if (fileNameNoExt && fileNameNoExt.length > 40) {
                callback(-1, "文件名称不能超过40个字符");

                return;
            }

            if (file.size > chunkSize) {
                //分块上传
                startChunks();
            } else {
                //普通上传
                uploadSingle();
            }
        // }
}
