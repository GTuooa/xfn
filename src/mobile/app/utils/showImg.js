export default function showImg (imageOrFile,fileName) {
	if(imageOrFile=='TRUE'){
		return 'https://www.xfannix.com/utils/img/icons/attachment/image.png'
	}else{
		if(fileName.lastIndexOf(".")){//能匹配到后缀名
			let name=fileName.substring(fileName.lastIndexOf(".")+1);
			if(name=='doc'||name=='docx'){
				return "https://www.xfannix.com/utils/img/icons/attachment/docx.png";
			}else if(name=='keynote'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/keynote.png'
			}else if(name=='numbers'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/numbers.png'
			}else if(name=='pages'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/pages.png'
			}else if(name=='pdf'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/pdf.png'
			}else if(name=='ppt'||name=='pptx'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/pptx.png'
			}else if(name=='rar'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/rar.png'
			}else if(name=='tar'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/tar.png'
			}else if(name=='xls'||name=='xlsx'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/xlsx.png'
			}else if(name=='zip'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/zip.png'
			}else if(name=='html'){
				return 'https://www.xfannix.com/utils/img/icons/attachment/html.png'
			}
			else{
				return 'https://www.xfannix.com/utils/img/icons/attachment/tongyonggeshi.png'
			}
		}else{//匹配不到后缀名
			return 'https://www.xfannix.com/utils/img/icons/attachment/tongyonggeshi.png'
		}
	}
}
