class Login {
    constructor(id) {
        this.root = document.querySelector(id)
        this.loginSpan = this.root.querySelectorAll('.loginSpan')
        this.registerSpan = this.root.querySelectorAll('.registerSpan')
        this.register = this.root.querySelector('.register')
        this.login = this.root.querySelector('.login')
    }
    tab() {
        for (let i = 0; i < this.loginSpan.length; i++) {
            this.loginSpan[i].onclick = () => {
                this.clearClass()
                this.loginSpan[0].classList.add('active')
                this.loginSpan[1].classList.add('active')
                this.register.style.display = "none"
                this.login.style.display = "block"
            }
            this.registerSpan[i].onclick = () => {
                this.clearClass()
                this.registerSpan[0].classList.add('active')
                this.registerSpan[1].classList.add('active')
                this.register.style.display = "block"
                this.login.style.display = "none"
            }
        }
    }
    clearClass() {
        for (let i = 0; i < this.loginSpan.length; i++) {
            this.registerSpan[i].classList.remove('active')
            this.loginSpan[i].classList.remove('active')
        }
    }
    registerObj() {
        this.register.onclick = (e) => {
            e = e || event
            let target = e.target || event.srcElement
            if (target.getAttribute('name') == 'btn') {
                let uesrName = target.parentNode.children[1].children[0].value
                let passWord = target.parentNode.children[2].children[0].value
                if (uesrName == "") {
                    target.parentNode.children[1].children[1].innerHTML = '请输入账号'
                }else{
                    target.parentNode.children[1].children[1].innerHTML = ''
                }
                if (passWord == "") {
                    target.parentNode.children[2].children[1].innerHTML = '请输入登录密码'
                }else{
                    target.parentNode.children[2].children[1].innerHTML = ''
                }
                if (uesrName == "" || passWord == "") {
                    return
                }
                let re = /^[A-Z]\w/
                if (!re.test(passWord)) {
                    target.parentNode.children[2].children[1].innerHTML = '密码必须是大写字母开头'
                    return
                }
               
                let itemData = localStorage.getItem('user') || []
                if (itemData.length == 0) {
                    let usertextItem = {
                        uesrName,
                        passWord
                    }
                    itemData.push(usertextItem)
                    localStorage.setItem('user', JSON.stringify(itemData))
                    localStorage.setItem('userId', uesrName)
                } else {
                    let userText = JSON.parse(itemData)
                    let usernameisOk = userText.some(item => {
                        return item.uesrName == uesrName
                    })
                    if (usernameisOk) {
                        target.parentNode.children[1].children[1].innerHTML = "用户名已存在"
                        return
                    } else {
                        let usertextItem = {
                            uesrName,
                            passWord
                        }
                        userText.push(usertextItem)
                        localStorage.setItem('user', JSON.stringify(userText))
                        localStorage.setItem('userId', uesrName)
                    }
                    alert('注册成功')
                    location.href = '../pages/cart.html'
                }

            }
        }
    }
    loginOBj() {
        this.login.onclick = (e) => {
            e = e || event
            let target = e.target || event.srcElement
            if (target.getAttribute('name') == 'btn') {
                let uesrName = target.parentNode.children[1].children[0].value
                let passWord = target.parentNode.children[2].children[0].value
                let itemData = localStorage.getItem('user') || []
                if (itemData.length == 0) {
                    alert('用户未注册,已为你自动注册')
                    let usertextItem = {
                        uesrName,
                        passWord
                    }
                    itemData.push(usertextItem)
                    localStorage.setItem('user', JSON.stringify(itemData))
                    localStorage.setItem('userId', uesrName)
                } else {
                    let userText = JSON.parse(itemData)
                    let usernameisOk = userText.some(item => {
                        return item.uesrName == uesrName
                    })
                    let uesrpsswordisOk = userText.some(item => {
                        return item.passWord == passWord
                    })
                    if (usernameisOk && uesrpsswordisOk) {
                        target.parentNode.children[1].children[1].innerHTML = ''
                        target.parentNode.children[2].children[1].innerHTML = ''
                        alert('登录成功')
                        localStorage.setItem('userId', uesrName)
                        location.href = "../pages/cart.html"
                    } else if (!usernameisOk) {
                        target.parentNode.children[1].children[1].innerHTML = '账号不正确'
                        target.parentNode.children[2].children[1].innerHTML = ''
                        return
                    } else if (!uesrpsswordisOk) {
                        target.parentNode.children[1].children[1].innerHTML = ''
                        target.parentNode.children[2].children[1].innerHTML = '密码不正确'
                    }
                }
            }
        }
    }

    verification() {
        this.root.onclick = (e) => {
            e = e || event
            let target = e.target || event.srcElement
            if (target.getAttribute('name') == 'btn') {
                let uesrName = target.parentNode.children[1].children[0].value
                let passWord = target.parentNode.children[2].children[0].value
                if (uesrName == "") {
                    target.parentNode.children[1].children[1].innerHTML = '请输入账号'
                }
                if (passWord == "") {
                    target.parentNode.children[2].children[1].innerHTML = '请输入登录密码'
                }
                if (uesrName == "" || passWord == "") {
                    return
                }
                let re = /^[A-Z]\w/
                if (!re.test(passWord)) {
                    target.parentNode.children[2].children[1].innerHTML = '密码必须是大写字母开头'
                    return
                }

            }
        }

    }
}
const login = new Login('.middle')
login.tab()
login.verification()
login.loginOBj()
login.registerObj()