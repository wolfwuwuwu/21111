import {
    ajaxPromise
} from './until.js'
class galssZoom {
    constructor(id) {
        this.root = document.querySelector(id)
        this.box = this.root.querySelector('.box')
        this.moveDiv = this.root.querySelector('.moveDiv')
        this.moveimgEle = this.root.querySelector('.rightbox>img')
        this.ulEle = this.root.querySelector('ul')
        this.bigGlass = this.root.querySelector('.rightbox')
        this.boxImg = this.root.querySelector('.boxImg')

    }
    async onload() {
        let url = location.href
        let id = url.substring(location.href.indexOf('?') + 1).split('=')[1]
        let data = await ajaxPromise({
            method: 'get',
            url: 'https://www.xiongmaoyouxuan.com/api/detail',
            data: {
                id
            }
        })
        let content = data.data.detail.photo
        this.boxImg.src = content[0].url
        this.moveimgEle.src = content[0].url
        content.forEach((item, index) => {
            this.ulEle.innerHTML += `
            <li data-index=${index}><img src="${item.url}"alt="" ></li>
            `
        });
        this.change(content)
        this.moveObj()

    }
    change(content) {
        let ulList = document.querySelectorAll('.wrap li')
        let that = this
        for (let i = 0; i < ulList.length; i++) {
            ulList[i].onmouseover = function () {
                that.clearClass()
                this.classList.add('active')
                that.boxImg.src = content[i].url
                that.moveimgEle.src = content[i].url
            }
        }

    }
    clearClass() {
        let ulList = document.querySelectorAll('ul>li')
        for (let i = 0; i < ulList.length; i++) {
            ulList[i].classList.remove('active')
        }
    }
    moveObj() {
        this.box.onmousemove = (e) => {
            e = e || window.event
            let x = e.offsetX - (this.moveDiv.offsetWidth) / 2
            let y = e.offsetY - (this.moveDiv.offsetHeight) / 2
            if (x < 0) x = 0
            if (y < 0) y = 0
            if (x > this.box.offsetWidth - this.moveDiv.offsetWidth) x = this.box.offsetWidth - this.moveDiv.offsetWidth
            if (y > this.box.offsetHeight - this.moveDiv.offsetHeight) y = this.box.offsetHeight - this.moveDiv.offsetHeight
            this.moveDiv.style.left = x + "px"
            this.moveDiv.style.top = y + "px"
            this.moveimgEle.style.width = this.bigGlass.offsetWidth * this.box.offsetWidth / this.moveDiv.offsetWidth + 'px'
            this.moveimgEle.style.height = this.bigGlass.offsetHeight * this.box.offsetHeight / this.moveDiv.offsetHeight + 'px'
            let moveX = (x * this.bigGlass.offsetWidth / this.moveDiv.offsetWidth)
            let moveY = (y * this.bigGlass.offsetHeight / this.moveDiv.offsetHeight)
            this.moveimgEle.style.left = -moveX + "px"
            this.moveimgEle.style.top = -moveY + "px"
        }
        this.box.onmouseover = () => {
            this.moveDiv.style.display = "block"
            this.moveimgEle.style.display = "block"
            this.bigGlass.style.display = "block"

        }
        this.box.onmouseout = () => {
            this.moveDiv.style.display = "none"
            this.moveimgEle.style.display = "none"
            this.bigGlass.style.display = "none"
        }
    }
}
class Product {
    constructor(id) {
        this.root = document.querySelector(id)
        this.title = this.root.querySelector('.top')
        this.orginPrice = this.root.querySelector('#orginPrice')
        this.price = this.root.querySelector('#price')
        this.color = this.root.querySelector('#color')
        this.boxImg = this.root.querySelector('.boxImg')
        this.shopImg = this.root.querySelector('#shopImg')
        this.shopName = this.root.querySelector('.shop-name')
        this.describe = this.root.querySelectorAll('.describe')
        this.size = this.root.querySelector('.size')
        this.shopImgEle = document.querySelector('.shopImgEle')
        this.cartIpt = document.querySelector('.cartIpt')
        this.carts = this.root.querySelector('.carts span:first-child')
    }

    async senData(num) {
        let url = location.href
        let id = url.substring(location.href.indexOf('?') + 1).split('=')[1]
        let data = await ajaxPromise({
            method: 'get',
            url: 'http://www.xiongmaoyouxuan.com/api/detail',
            data: {
                id
            }
        })
        let rult = localStorage.getItem('product')
        let item = JSON.parse(rult) || []
        let productItem = item.find(item => item.id == id)
        console.log(data.data.detail);
        if (!productItem) {
            let product = {
                id,
                num,
                pic: data.data.detail.image,
                price: data.data.detail.price,
                title: data.data.detail.qunTitle,
                state: false
            }
            item.push(product)
            localStorage.setItem('product', JSON.stringify(item))
        } else {
            productItem.num = num
            localStorage.setItem('product', JSON.stringify(item))
        }
    }
    iptObj() {
        let ipt = document.querySelector('.cartIpt>input')
        let num = 0
        ipt.onchange = () => {
            if (ipt.value % 1 !== 0 || ipt.value < 0) {
                alert('请输入大于零的整数')
                ipt.value = num
                return
            }
            num = ipt.value
            this.senData(num)
        }
        this.cartIpt.onclick = (e) => {
            e = e || event
            let target = e.target || event.srcElement
            if (target.getAttribute('name') == 'reduce') {
                num--
                if (num <= 0) {
                    num = 0
                }
                ipt.value = num
                this.senData(num)

            }
            if (target.getAttribute('name') == 'plus') {
                num++
                ipt.value = num
                this.senData(num)
            }
        }
    }
    text(content) {
        this.title.innerHTML = content.detail.title
        this.orginPrice.innerHTML = '¥&nbsp;' + content.detail.originPrice
        this.price.innerHTML = '¥&nbsp;' + content.detail.price
        content.detail.photo.forEach((item, index) => {
            this.color.innerHTML += `<img data-index=${index} src="${item.url}"
            alt="">`
        })
        this.shopImg.src = content.shop.picUrl
        this.shopName.innerHTML = content.shop.nickname
        for (let i = 0; i < this.describe.length; i++) {
            this.describe[i].innerHTML = content.shop.deliveryScore
        }
        let photo = content.detail.descContentList
        photo.forEach(item => {
            this.shopImgEle.innerHTML += `<img src='${item.image.url}'>`
        })
    }
    clickPotot() {
        this.size.onclick = (e) => {
            e = e || e.event
            let target = e.target || event.srcElement
            if (target.nodeName == 'SPAN') {
                for (let i = 1; i < this.size.childNodes.length; i++) {
                    this.size.childNodes[i].classList.remove('active')
                }
                target.classList.add('active')
            }
        }
        this.color.onclick = (e) => {
            e = e || e.event
            let target = e.target || event.srcElement
            if (target.nodeName == 'IMG') {
                let colorImg = document.querySelectorAll('#color>img')
                let wrapUlList = document.querySelectorAll('#wrapUl>li')
                for (let i = 0; i < colorImg.length; i++) {
                    colorImg[i].classList.remove('active')
                    wrapUlList[i].classList.remove('active')
                }
                this.boxImg.src = target.src
                target.classList.add('active')
                // for (let i = 0; i < wrapUlList.length; i++) {
                //     if (target.getAttribute('data-index') == wrapUlList[i].getAttribute('data-index')) {
                //         wrapUlList[i].classList.add('active')
                //     }
                // }
            }
        }
    }
    async ajax() {
        let url = location.href
        let id = url.substring(location.href.indexOf('?') + 1).split('=')[1]
        let data = await ajaxPromise({
            method: 'get',
            url: 'http://www.xiongmaoyouxuan.com/api/detail',
            data: {
                id
            }
        })
        let content = data.data
        this.text(content)
    }
    cartsObj() {
        this.carts.onclick = () => {
            let isOk = confirm('请登录')
            if (isOk) location.href = "../pages/login.html"

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
let galss = new galssZoom('.wrap')
galss.onload()
let product = new Product('.product')
product.ajax()
product.clickPotot()
product.iptObj()
product.cartsObj()
const backtop = new Backtop('.backTop')
backtop.backtopObj()