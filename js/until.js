function ajaxPromise(option) {
    return new Promise((resolve, reject) => {
        // 1. 创建AJAX核心对象
        const xhr = new window.XMLHttpRequest()
        const method = option.method.toUpperCase() //请求方法转大写

        if (method == 'GET') {
            // 2. 建立连接
            xhr.open(option.method, option.url + '?' + formateParme(option.data))
            // 3.发送请求
            xhr.setRequestHeader('x-platform','pc')
            xhr.send()
        } else if (method == 'POST') {
            // 2. 建立连接
            xhr.open(option.method, option.url)
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
            // 3.发送请求
            xhr.send(formateParme(option.data))
        }

        //4.处理响应
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let data = xhr.responseText
                    resolve(JSON.parse(data))
                } else {
                    reject('网络出错' + xhr.status + '-' + xhr.statusText)
                }
            }
        }
    })
}

function formateParme(data) {
    let arr = []
    for (const key in data) {
        let item = `${key}=${data[key]}` // username=admin ,password=123
        arr.push(item) //[username=admin,password=123]
    }
    return arr.join('&')
}
export {
    ajaxPromise
}