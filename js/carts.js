class Carts {
    constructor(id) {
        this.root = document.querySelector(id)
        this.tableEle = this.root.querySelector('table')
        this.totalEle = document.querySelector('.totalEle')
        this.rightSpan=document.querySelector('.rightSpan')
    }

    addObj() {
        let product = localStorage.getItem('product')
        let productItem = JSON.parse(product)
        this.binding(productItem)
    }
    changeData(id, num) {
        let product = localStorage.getItem('product')
        let productItem = JSON.parse(product)
        let products = productItem.find(item => item.id == id)
        products.num = num
        localStorage.setItem('product', JSON.stringify(productItem))

    }
    userlog(){
        let userId=localStorage.getItem('userId')
        this.rightSpan.innerHTML=`<span>${userId}</span>`
    }
    operation() {
        let num = 0
        let stateAll = false
        let product = localStorage.getItem('product')
        let productItem = JSON.parse(product)
        this.tableEle.onchange = (e) => {
            e = e || event
            let target = e.target || event.srcElement
            if (target.getAttribute('name') == 'number') {
                let product = localStorage.getItem('product')
                let productItem = JSON.parse(product)
                let id = target.parentElement.getAttribute('data-index')
                let products = productItem.find(item => item.id == id)
                num = products.num
                if (target.value % 1 !== 0 || target.value < 0) {
                    alert('请输入大于零的整数')
                    target.value = num
                    return
                }
                num = target.value
                target.parentElement.nextElementSibling.innerHTML = (num * products.price).toFixed(2)
                this.changeData(id, num)
                this.totlePrice()
            }
        }
        this.tableEle.onclick = (e) => {

            e = e || event
            let target = e.target || event.srcElement
            if (target.getAttribute('name') == 'reduce') {
                let product = localStorage.getItem('product')
                let productItem = JSON.parse(product)
                let id = target.parentElement.getAttribute('data-index')
                let products = productItem.find(item => item.id == id)
                num = products.num
                num--
                if (num <= 0) {
                    num = 0
                }
                console.log(target);
                target.nextElementSibling.value = num
                target.parentElement.nextElementSibling.innerHTML = (num * products.price).toFixed(2)
                this.changeData(id, num)
                this.totlePrice()
            }
            if (target.getAttribute('name') == 'plus') {
                let product = localStorage.getItem('product')
                let productItem = JSON.parse(product)
                let id = target.parentElement.getAttribute('data-index')
                let products = productItem.find(item => item.id == id)
                num = products.num
                num++
                target.previousElementSibling.value = num
                target.parentElement.nextElementSibling.innerHTML = (num * products.price).toFixed(2)
                this.changeData(id, num)
                this.totlePrice()
            }
            if (target.getAttribute('class') == 'delet') {
                let isOk = confirm('是否确认删除')
                if (isOk) {
                    let product = localStorage.getItem('product')
                    let productItem = JSON.parse(product)
                    let id = target.parentElement.childNodes[7].getAttribute('data-index')
                    let products = productItem.find(item => item.id == id)
                    productItem.splice(productItem.indexOf(products), 1)
                    localStorage.setItem('product', JSON.stringify(productItem))
                    this.binding(productItem)
                    this.totlePrice()
                }
            }
            if (target.getAttribute('class') == 'choseAll') {
                stateAll = !stateAll
                let product = localStorage.getItem('product')
                let productItem = JSON.parse(product)
                if (stateAll) {
                    productItem.forEach(item => item.state = true)
                } else {
                    productItem.forEach(item => item.state = false)
                }
                this.binding(productItem, stateAll)
            }
            if (target.getAttribute('class') == 'chose') {

                let id = target.getAttribute('data-index')
                let item = productItem.find(item => item.id == id)
                item.state = !item.state
                console.log(item.state);
                stateAll = productItem.every(item => item.state)
                this.binding(productItem, stateAll)
            }
        }
    }
    totlePrice() {
        let product = localStorage.getItem('product')
        let productItem = JSON.parse(product)
        let num = productItem.reduce((s, item) => {
            return s + item.num * item.price
        }, 0).toFixed(2)
        this.totalEle.innerHTML = `合计:<span>&nbsp;${num}&nbsp;</span>元`

    }
    binding(productItem, stateAll = false) {
        this.tableEle.innerHTML = `<tr>
        <th>
             <label for="checkebox">全选</label>
             <input type="checkbox"  class="choseAll"  ${stateAll?'checked':''}>
        </th>
        <th>商品名称</th>
        <th>单价</th>
        <th>数量</th>
        <th>小计</th>
        <th>操作</th>
    </tr>`
        if (productItem.length == 0) {
            this.root.innerHTML += `<h3>请回到购物界面选择购买产品</h3>`
            stateAll = false
            return
        }
        productItem.forEach(item => {
            this.tableEle.innerHTML += `
            <tr>
                <td><input data-index=${item.id} type="checkbox" class="chose" ${item.state?'checked':''}></td>
                <td>
                    <img src=${item.pic} >
                    <p>${item.title}</p>
                </td>
                <td>${item.price}</td>
                <td data-index=${item.id}>
                    <input type="button" value="-" name="reduce"><input type="text" name="number" value="${item.num}"><input type="button" name="plus" value="+">
                </td>
                <td>${(item.price*item.num).toFixed(2)}</td>
                <td class='delet'>删除</td>
            </tr>
            `
        });
    }
}
const carts = new Carts('.content')
carts.addObj()
carts.operation()
carts.totlePrice()
carts.userlog()