import {
    ajaxPromise
} from './until.js'

class Product {
    constructor(id) {
        this.root = document.querySelector(id)
        this.ulLIst = this.root.querySelector('ul')
        this.moreEle = document.querySelector('.more')
        this.isEnd = document.querySelector('.isEnd')
    }
    async products() {
        let data = await ajaxPromise({
            method: 'get',
            url: 'http://www.xiongmaoyouxuan.com/api/column/3183/items',
            data: {
                start: 0
            }
        })
        let content = data.data.list
        // if (content.length % 4 !== 0) {
        //     content.splice(content.length - 1, 1)
        // }
        this.addProduct(content)
        this.paging(content)
    }
    clickItem() {
        this.ulLIst.onclick = function (e) {
            e = e || event
            let target = e.target || event.srcElement
            if (target.nodeName == 'IMG' || target.nodeName == 'DIV') {
                let id = target.parentElement.getAttribute('data-index')
                location.href = "../pages/details.html?id=" + id
            }
        }
    }
    addProduct(content) {
        content.forEach(item => {
            this.ulLIst.innerHTML += `
            <li data-index=${item.id}>
                <img src="${item.image}"
                    alt="">
                <div class="item">
                    <div class="text">${item.title}</div>
                    <div class="keyword">
                        <span>淘宝</span>
                        <span>包邮</span>
                    </div>
                    <div class="buttom">
                        <div class="item1">
                            <span>￥</span>
                            <span>${parseInt(item.price)}</span>
                            <span>${String(item.price).substring(1)}</span>
                            <span><i>${item.saleNum}</i>人已买</span>
                        </div>
                        <div class="item2">
                            <span>${item.couponValue}</span>
                        </div>
                    </div>
                </div>
            </li>
            `
        })
    }
    async ajaxList(num) {
        let data = await ajaxPromise({
            method: 'get',
            url: 'http://www.xiongmaoyouxuan.com/api/column/3183/items',
            data: {
                start: num,
                sort: 0
            }
        })
        let content2 = data.data.list
        let temp = content2
        temp = [...temp, ...content2]
        if (!data.data.isEnd) {
            this.isEnd.style.display = "block"
            this.isEnd.innerHTML = "加载中..."
        } else {
            this.isEnd.innerHTML = "到底了..."
        }
        this.addProduct(temp)
    }
    async paging(content) {
        let that = this
        let num = 20
        let flag = false
        this.moreEle.onclick = async function () {
            that.ajaxList(num)
            window.onscroll = () => {
                let scrllTop = document.documentElement.scrollTop
                let scrollHeight = document.documentElement.scrollHeight
                if ((scrollHeight - scrllTop) <= 1370 && (scrollHeight - scrllTop) >= 1290) {
                    flag = true
                    setTimeout(() => {
                        if (flag) {
                            num += 20
                            that.ajaxList(num)
                            console.log(num);
                        }
                        flag = false
                    }, 500)
                }
            }
            this.style.display = "none"
        }
    }

}
class Backtop {
    constructor(id) {
        this.backTop = document.querySelector(id)
    }
    backtopObj() {
        this.backTop.onclick = function () {
            let timer = setInterval(() => {
                document.documentElement.scrollTop -= 200
                if (document.documentElement.scrollTop <= 0) {
                    clearInterval(timer)
                }
            }, 20)
        }
        window.onscroll = () => {
            if (document.documentElement.scrollTop >= 400) {
                this.backTop.style.display = 'block'
            } else {
                this.backTop.style.display = 'none'
            }
        }
    }
}
class Switch {
    constructor(id) {
        this.root = document.querySelector(id)
        this.liList = this.root.querySelectorAll('li')
    }
    toggleTab() {
        let liList = this.liList
        liList[0].classList.add('active')
        for (let i = 0; i < liList.length; i++) {
            liList[i].onclick = () => {
                console.log(11);
                this.clearClass()
                liList[i].classList.add('active')
                switch (i) {
                    case 0:
                        location.href = '../pages/index.html'
                        break;
                    case 1:
                        location.href = '../pages/baoyou.html'
                        break;
                    case 2:
                        location.href = '../pages/super.html'
                        break;


                }
            }
        }
    }
    clearClass() {
        for (let i = 0; i < this.liList.length; i++) {
            this.liList[i].classList.remove('active')
        }
    }
}


const productItem = new Product('.productItem')
productItem.products()
productItem.clickItem()
const backtop = new Backtop('.backTop')
backtop.backtopObj()
const switchObj = new Switch('.nav')
switchObj.toggleTab()