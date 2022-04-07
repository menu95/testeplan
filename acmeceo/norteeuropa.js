'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_clientnorte')) ?? []
const setLocalStorage = (dbClientnorte) => localStorage.setItem("db_clientnorte", JSON.stringify(dbClientnorte))

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClientnorte = readClient()
    dbClientnorte.splice(index, 1)
    setLocalStorage(dbClientnorte)
}

const updateClient = (index, client) => {
    const dbClientnorte = readClient()
    dbClientnorte[index] = client
    setLocalStorage(dbClientnorte)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClientnorte = getLocalStorage()
    dbClientnorte.push (client)
    setLocalStorage(dbClientnorte)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}








//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveClient = () => {
    debugger
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            data: document.getElementById('data').value,
            email: document.getElementById('email').value,

        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
            
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td data-label="nome">${client.nome}</td>
        <td data-label="cpf">${client.cpf}</td>
        <td data-label="data de admissão">${client.data}</td>
        <td data-label="e-mail">${client.email}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClientnorte = readClient()
    clearTable()
    dbClientnorte.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('cpf').value = client.cpf
    document.getElementById('data').value = client.data
    document.getElementById('email').value = client.email
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o funcionário ${client.nome} do plano ?`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)