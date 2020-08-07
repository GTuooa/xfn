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


// import { message } from 'antd'
// import plupload from 'plupload'
// let g_object_name = ''
// let g_object_name_type = ''
// let tmp_name = ''
//
// function get_uploaded_object_name(filename)
// {
//     // if (g_object_name_type == 'local_name')
//     // {
//         tmp_name = g_object_name
//         tmp_name = tmp_name.replace("${filename}", filename);
//         return tmp_name
//     // }
//     // else if(g_object_name_type == 'random_name')
//     // {
//     //     return g_object_name
//     // }
// }
//
// function check_object_radio() {
//     var tt = document.getElementsByName('myradio');
//     for (var i = 0; i < tt.length ; i++ )
//     {
//         if(tt[i].checked)
//         {
//             g_object_name_type = tt[i].value;
//             break;
//         }
//     }
// }
//
// function set_upload_param(up, filename, ret)
// {
//     if (ret == false)
//     {
//         ret = get_signature()
//     }
//     g_object_name = key;
//     if (filename != '') { suffix = get_suffix(filename)
//         calculate_object_name(filename)
//     }
//     console.log(accessid);
//     new_multipart_params = {
//         'key' : g_object_name,
//         'policy': policyBase64,
//         'OSSAccessKeyId': accessid,
//         'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
//         'callback' : callbackbody,
//         'signature': signature,
//     };
//
//     up.setOption({
//         'url': host,
//         'multipart_params': new_multipart_params
//     });
//
//     up.start();
// }
//
// const uploader = new plupload.Uploader({
// 	runtimes : 'html5,flash,silverlight,html4',
// 	browse_button : 'selectfiles',
//     //multi_selection: false,
// 	container: document.getElementById('container'),
// 	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
// 	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
//     url : 'http://oss.aliyuncs.com',
//
//     filters: {
//         mime_types : [ //只允许上传图片和zip文件
//         { title : "Image files", extensions : "jpg,gif,png,bmp" },
//         { title : "Zip files", extensions : "zip,rar" },
//         { title : "Doc files", extensions : "xls,xlsx" }
//         ],
//         max_file_size : '10mb', //最大只能上传10mb的文件
//         prevent_duplicates : true //不允许选取重复文件
//     },
//
// 	init: {
// 		PostInit: function() {
// 			document.getElementById('ossfile').innerHTML = '';
// 			document.getElementById('postfiles').onclick = function() {
//             set_upload_param(uploader, '', false);
//             return false;
// 			};
// 		},
//
// 		// FilesAdded: function(up, files) {
// 		// 	plupload.each(files, function(file) {
// 		// 		document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
// 		// 		+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
// 		// 		+'</div>';
// 		// 	});
// 		// },
//
// 		BeforeUpload: function(up, file) {
//             check_object_radio();
//             set_upload_param(up, file.name, true);
//         },
//
// 		UploadProgress: function(up, file) {
// 			var d = document.getElementById(file.id);
// 			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
//             var prog = d.getElementsByTagName('div')[0];
// 			var progBar = prog.getElementsByTagName('div')[0]
// 			progBar.style.width= 2*file.percent+'px';
// 			progBar.setAttribute('aria-valuenow', file.percent);
// 		},
//
// 		FileUploaded: function(up, file, info) {
//             if (info.status == 200) {
//                 console.log('upload to oss success, object name:' + get_uploaded_object_name(file.name) + ' 回调服务器返回的内容是:' + info.response);
//                 // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name) + ' 回调服务器返回的内容是:' + info.response;
//             } else if (info.status == 203) {
//                 console.log('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response);
//                 // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response;
//             } else {
//                 console.log(info.response);
//                 // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
//             }
// 		},
//
// 		Error: function(up, err) {
//             if (err.code == -600) {
//                 message.info('选择的文件太大了，可以根据应用情况，在upload.js 设置一下上传的最大大小')
//                 // document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
//             } else if (err.code == -601) {
//                 message.info('选择的文件后缀不对，可以根据应用情况，在upload.js 进行设置可允许的上传文件类型')
//                 // document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
//             } else if (err.code == -602) {
//                 message.info('这个文件已经上传过一遍了')
//                 // document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
//             } else {
//                 message.info("Error xml:" + err.response)
//                 // document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
//             }
// 		}
// 	}
// });
//
// export default uploader
