import {
    ajaxPromise
} from './until.js'
class Swiper {
    constructor(id) {
        this.root = document.querySelector(id)
        this.wrapper = this.root.querySelector('.swiper-wrapper')
        this.prev = this.root.querySelector('.swiper-button-prev')
        this.next = this.root.querySelector('.swiper-button-next')
        this.buchikui = document.querySelector('.buchikui')
        this.daejuan = document.querySelector('.daejuan')
        this.chuanda = document.querySelector('.chuanda')

    }
    async addObj() {
        let data = await ajaxPromise({
            method: 'get',
            url: 'http://www.xiongmaoyouxuan.com/api/tab/1',
            data: {
                start: 0
            }
        })
        let content = data.data
        this.buchikui.src = content.gridsV2[0].imageUrl
        this.daejuan.src = content.gridsV2[1].imageUrl
        this.chuanda.src = content.gridsV2[2].imageUrl
        this.bannerObj(content)
    }
    bannerObj(content) {
        if (content.banners == 0) {
            this.prev.style.display = 'none'
            this.next.style.display = 'none'
        } else {
            this.prev.style.display = 'block'
            this.next.style.display = 'block'
            let bannerImg = content.banners
            bannerImg.forEach(item => {
                this.wrapper.innerHTML += `<div class="swiper-slide"><img
                src="${item.imageUrl}"
                alt=""></div>`
            });
        }
    }

}
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
            url: 'http://www.xiongmaoyouxuan.com/api/tab/1/feeds',
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
            url: 'http://www.xiongmaoyouxuan.com/api/tab/1/feeds',
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
                this.clearClass()
                liList[i].classList.add('active')
                switch (i) {
                    case 1:
                        location.href = '../pages/baoyou.html'
                        break;
                    case 2:
                        location.href = '../pages/super.html'
                        break;
                    case 3:
                        location.href = '../pages/popularity.html'
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
class Exhibition {
    constructor(id) {
        this.root = document.querySelector(id)
        this.liList = this.root.querySelectorAll('li')
        this.tabCart = this.root.querySelector('.tabCart')
        this.tabCartTop = this.root.querySelector('.tabCartTop')
    }
    exhibitioncart() {
        for (let i = 0; i < this.liList.length; i++) {
            this.liList[i].onmouseover = () => {
                switch (i) {
                    case 0:
                        this.addTab1(2, 13)
                        break;
                    case 1:
                        this.addTab1(5, 19)
                        break;
                    case 2:
                        this.addTab1(3, 15)
                        break;
                    case 3:
                        this.addTab1(4, 14)
                        break;
                    case 4:
                        this.addTab1(10)
                        break;
                    case 5:
                        this.addTab1(24)
                        break;
                    case 6:
                        this.addTab1(6, 12)
                        break;
                    case 7:
                        this.addTab1(16)
                        break;
                    case 8:
                        this.addTab1(11, 7)
                        break;

                }
                this.tabCart.style.opacity = 1
            }

            this.tabCartTop.onmouseout = () => {
                this.tabCart.style.opacity = 0
            }
        }
    }
    addObj(content1, content2) {
        let str = `<div class="item"><h4>${content1.category.cname}</h4>`
        content1.categories.forEach(item => {
            str += `<span>${item.title}</span>`
        })
        str += `</div>`
        if (content2) {
            str += `<div class="item"><h4>${content2.category.cname}</h4>`
            content2.categories.forEach(item => {
                str += `<span>${item.title}</span>`
            })
            str += `</div>`
        }

        this.tabCart.innerHTML = str
    }
    async addTab1(num1, num2) {
        let data1 = await ajaxPromise({
            method: 'get',
            url: 'http://www.xiongmaoyouxuan.com/api/tab/' + num1,
            data: {
                start: 0
            }
        })

        let content1 = data1.data
        let content2
        if (num2) {
            let data2 = await ajaxPromise({
                method: 'get',
                url: 'http://www.xiongmaoyouxuan.com/api/tab/' + num2,
                data: {
                    start: 0
                }
            })
            content2 = data2.data
        }

        this.addObj(content1, content2)
    }
}
const swiper = new Swiper('.swiper-container')
swiper.addObj()
const productItem = new Product('.productItem')
productItem.products()
productItem.clickItem()
const backtop = new Backtop('.backTop')
backtop.backtopObj()
const switchObj = new Switch('.nav')
switchObj.toggleTab()
const exhibition = new Exhibition('.banner')
exhibition.exhibitioncart()