const $saveBtn = document.querySelector("#save-btn");
const $usersForm = document.querySelector("#form-users");
const $result = document.querySelector("#result-body");
const $savBtn = document.querySelector("#save-btn");
const $name = document.querySelector("#firstName")
const $lastname = document.querySelector("#lastName")
const $country = document.querySelector("#country")
const $address = document.querySelector("#address")
const $email = document.querySelector(" .email")
const $number = document.querySelector("#number")
const $age = document.querySelector("#age")
const $updateForm = document.querySelector("#update-form")
const $addFormWrapper = document.querySelector(".add-form-wrapper")
const $updateFormWrapper = document.querySelector(".update-form-wrapper")
const $addBtn = document.querySelector("#add-btn")
const $exitBtn = document.querySelector("#exit-btn")
const $exit2 = document.querySelector("#exit-update-btn")
const $pagination = document.querySelector("#pagination")


form = {}
let users = []
let edit_index = 1
let current_page = 1
let product_per_page = 3

document.addEventListener("DOMContentLoaded", function () {
    getUsers()
})
const ToastifyDisplay = (message, type) => {
    return Toastify({
        className: type === "succes" ? "succes" : "error",
        text: message,
        duration: 3000
    })
}

async function getUsers() {

    try {
        const response = await fetch("http://localhost:3000/users")
        users = await response.json()
        displayUsers(users)
    } catch (error) {
        console.log(error)
    }
    console.log(users)
    displayPagination(users)
}

const displayUsers = (user) => {

    $result.innerHTML = ""
    let start_index = (current_page - 1) * product_per_page
    let end_index = start_index + product_per_page
    let pagination_products = users.slice(start_index, end_index)
    pagination_products.forEach((user, index) => {

        let tr = document.createElement("tr")
        tr.innerHTML = `
             <td>${index + 1}</td>
             <td>${user.firstName}</td>
             <td>${user.lastName}</td>
             <td>${user.country}</td>
             <td>${user.address}</td>
             <td>${user.email}</td>
             <td>${user.number}</td>
             <td>${user.age}</td>
             <td class="btn-wrap">
             <button onclick="editUsers('${user.id}')"  id="edit">edit</button>
             <button onclick="deleteUsers('${user.id}')" id="delete">delete</button>
             </td>
        `
        $result.appendChild(tr)
    })
}

async function deleteUsers(id) {
    try {
        await fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE"
        })
    } catch (error) {
        console.log(error)
    }
}


const handleUpdateProduct = (e) => {
    e.preventDefault()
    const id = e.target.dataset.currentUpdateProductId;
    let user = {
        firstName: $name.value,
        lastName: $lastname.value,
        country: $country.value,
        address: $address.value,
        number: $number.value,
        email: $email.value,
        age: $age.value,
    }
    fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(data => {
            window.location.reload()
        })
}


async function editUsers(id) {
    $updateFormWrapper.classList.add("show2")
    const ID = id
    fetch(`http://localhost:3000/users/${ID}`)
        .then(response => response.json())
        .then(data => {
            $name.value = data.firstName
            $lastname.value = data.lastName
            $country.value = data.country
            $address.value = data.address
            $email.value = data.email
            $number.value = data.number
            $age.value = data.age
            $updateForm.setAttribute("data-current-update-product-id", id)
        })


}


const handleChange = (event) => {
    event.preventDefault()
    const { name, value } = event.target
    form = { ...form, [name]: value }
    console.log(form)
}

const handleSaveUsers = async (event) => {
    event.preventDefault()
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        ToastifyDisplay("Succesfully save user", "succes").showToast()

    } catch (error) {
        ToastifyDisplay(`${error}`, "error").showToast()
    }
}

function displayPagination() {
    $pagination.innerHTML = " "
    let page_count = Math.ceil(users.length / product_per_page)
    for (let i = 1; i <= page_count; i++) {
        let btn = document.createElement("button")
        btn.innerText = i
        btn.className = current_page === i ? "btn btn-success mx-1" : "btn btn-outline-success mx-1"
        btn.addEventListener('click', function () {
            current_page = i
            displayUsers()
        })
        $pagination.appendChild(btn)
    }
}


$usersForm.addEventListener("submit", handleSaveUsers);
$updateForm.addEventListener("submit", handleUpdateProduct)
$addBtn.addEventListener("click", function () {
    $addFormWrapper.classList.add("show")
})
$exitBtn.addEventListener("click", function () {
    $addFormWrapper.classList.remove("show")
})
$exit2.addEventListener("click", function () {
    $addFormWrapper.classList.remove("show2")
})




// document.querySelector("input[name='firstName']").value = obj.firstName
// document.querySelector("input[name='lastName']").value = obj.lastName
// document.querySelector("input[name='country']").value = obj.country
// document.querySelector("input[name='address']").value = obj.address
// document.querySelector("input[name='email']").value = obj.email
// document.querySelector("input[name='number']").value = obj.number
// document.querySelector("input[name='age']").value = obj.age