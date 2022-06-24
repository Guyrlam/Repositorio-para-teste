//DOM elements
//initial elements
const productName = document.querySelector('#name');
const description = document.querySelector('#description');
const price = document.querySelector('#price');
const cadastreButton = document.querySelector('#cadastre');
const listButton = document.querySelector('#list-view');
//products table
const table = document.querySelector('#product-list');
const listExibition = document.querySelector('#booking-container');
//details modal
const modalBox = document.querySelector('#modal');
const modalId = document.querySelector('#id-modal');
const modalName = document.querySelector('#name-modal');
const modalDescription = document.querySelector('#description-modal');
const modalPrice = document.querySelector('#price-modal');
const modalInclude = document.querySelector('#include-modal');
//edit modal
const editBox = document.querySelector('#edit');
const productNameEdit = document.querySelector('#name-edit');
const descriptionEdit = document.querySelector('#description-edit');
const priceEdit = document.querySelector('#price-edit');
const editBtn = document.querySelector("#change");
//table header
const nameTh = document.querySelector('#name-th');
const priceTh = document.querySelector('#price-th');
//search
const searchBar = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-button');

//VARIABLES
//tbody create
const tbody = document.createElement('tbody');
table.appendChild(tbody);
//products array
let products = [];
//verifications variable
let verification;


//LISTENERS
//cadastre
cadastreButton.addEventListener('click', addVerification);
//list exibition
listButton.addEventListener('click', listView);
//sort names
nameTh.addEventListener('click', sortNames);
//sort price
priceTh.addEventListener('click', sortPrice);
//search
searchButton.addEventListener('click', searchFilter);


//FUNCTIONS

//add verification function
function addVerification() {
    try {
        productName.style.borderColor = 'white';
        description.style.borderColor = 'white';
        price.style.borderColor = 'white';
        document.querySelector('#feedback').style.color = 'transparent';

        verification = productName;
        if (productName.value === '') {
            throw new Error(`Certifique-se de preencher todos os campos!`);
        };
        verification = description;
        if (description.value === '') {
            throw new Error(`Certifique-se de preencher todos os campos!`);
        };
        verification = price;
        if (price.value === '') {
            throw new Error(`Certifique-se de preencher todos os campos!`);
        };
        verification = description;
        if (description.value.length < 5) {
            throw new Error(`Crie uma descrição com pelo menos 5 caracteres!`);
        };
        verification = price;
        if (isNaN((price.value).replace(',','.')) === true ) {
            throw new Error(`Preencha o campo de valor somente com números!`);
        };
        verification = price;
        if (Number((price.value).replace(',','.')) < 0) {
            throw new Error(`Preencha o campo de valor somente com números positivos!`);
        };

        document.querySelector('#feedback').style.color = '#00c000';
        document.querySelector('#feedback').innerHTML = 'O produto foi adicionado à lista com sucesso!';
        add(); 
    } catch (error) {
        document.querySelector('#feedback').style.color = '#e32636';
        verification.style.borderColor = '#e32636';
        document.querySelector('#feedback').innerHTML = error.message;
    };
};

//add products function
function add(){
    //id creator
    let id = 0;
    if (products.length > 0) {
        for(let i = 0; i <= products[products.length - 1].id; i++) {
            id++;
        };
    };

    //object creator
    const object = {
        "id": id,
        "name": productName.value,
        "description": description.value,
        "price": price.value.replace(',','.'),
        "date": Date.now()
    };

    //array add
    products.push(object);

    list(products);
}

//list view function
function listView() {
    try {
        if(products.length === 0) {
            throw new Error('Não há produtos listados. Adicione um e tente novamente.');
        };
        listExibition.style.display = 'flex';
        window.scrollTo({ top: 1460, behavior: 'smooth' });
    } catch (error) {
        document.querySelector('#feedback').style.color = '#e32636';
        document.querySelector('#feedback').innerHTML = error.message;
    };
};


//list creator
function list(array) {
    //variables
    let i =0;
    let object;

    //cleaning the table
    tbody.innerHTML = '';

    //adding the products to the table
    
    array.forEach(() => {
        object = array[i];

        //ELEMENTS CREATION
        //line creation
        const newLine = document.createElement('tr');

        //name cell creation
        const nameCell = document.createElement('td');
        //name cell class
        const nameClass = document.createAttribute('class');
        nameClass.value = `name-cell`;
        nameCell.setAttributeNode(nameClass);
        //name cell style
        const namePointer = document.createAttribute('style');
        namePointer.value = 'cursor: pointer;';
        nameCell.setAttributeNode(namePointer);
        //name cell content
        const nameContent = document.createTextNode(`${object.name}`);
        nameCell.appendChild(nameContent);
        //name cell id
        const locale = document.createAttribute('id');
        locale.value = `${i}`;
        nameCell.setAttributeNode(locale);

        //price cell creation
        const priceCell = document.createElement('td');
        //price cell content
        const priceContent = document.createTextNode(`${Number(object.price.replace(',','.')).toLocaleString('pt-BR',{style:'currency', currency: 'BRL'})}`);
        priceCell.appendChild(priceContent);
        //price cell class
        const priceClass = document.createAttribute('class');
        priceClass.value = `price-cell p${i}`;
        priceCell.setAttributeNode(priceClass);

        //edit cell creation
        const editCell = document.createElement('td');
        //edit cell content
        const editImg = document.createElement('span');
        const editClass = document.createAttribute('class');
        editClass.value = 'material-icons edit';
        editImg.setAttributeNode(editClass);
        const editContent = document.createTextNode('edit');
        editImg.appendChild(editContent);
        editCell.appendChild(editImg);
        //edit cell id
        const edition = document.createAttribute('id');
        edition.value = `${i}`;
        editCell.setAttributeNode(edition);

        //delete cell
        const deleteCell = document.createElement('td');
        //delete cell content
        const deleteImg = document.createElement('span');
        const deleteClass = document.createAttribute('class');
        deleteClass.value = 'material-icons delete';
        deleteImg.setAttributeNode(deleteClass);
        const deleteContent = document.createTextNode('delete');
        deleteImg.appendChild(deleteContent);
        deleteCell.appendChild(deleteImg);
        //delete cell id
        const line = document.createAttribute('id');
        line.value = `${i}`;
        deleteCell.setAttributeNode(line);

        //align elements
        newLine.appendChild(nameCell);
        newLine.appendChild(priceCell);
        newLine.appendChild(editCell);
        newLine.appendChild(deleteCell);
        tbody.appendChild(newLine);

        
        //LINE FUNCTIONS
        //details modal function
        nameCell.onclick = function modal() {
            const object2 = products[locale.value];
            const date = new Date(object2.date);

            modalId.innerHTML = (`Id: ${object2.id}`);
            modalName.innerHTML = (`Nome: ${object2.name}`);
            modalDescription.innerHTML = (`Descrição: ${object2.description}`);
            modalPrice.innerHTML = (`Valor: ${Number(object2.price).toLocaleString('pt-BR',{style:'currency', currency: 'BRL'})}`);
            modalInclude.innerHTML = (`Inclusão: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
            
            modalBox.style.display = 'flex';
        };
        //close details modal
        document.querySelector('#modal svg').onclick = function closeModal() {
            modalBox.style.display = 'none';
        };

        //edit modal function
        editImg.onclick = function editLine(){
            const object2 = products[edition.value];
            
            productNameEdit.value = (`${object2.name}`);
            descriptionEdit.value = (`${object2.description}`);
            priceEdit.value = (`${Number(object2.price)}`);
            editBox.style.display = 'flex';

        
            editBtn.onclick = function(){
                try {
                    productNameEdit.style.borderColor = 'black';
                    descriptionEdit.style.borderColor = 'black';
                    priceEdit.style.borderColor = 'black';
                    document.querySelector('#feedback2').style.color = 'transparent';
            
                    verification = productNameEdit;
                    if (productNameEdit.value === '') {
                        throw new Error(`Certifique-se de preencher todos os campos!`);
                    };
                    verification = descriptionEdit;
                    if (descriptionEdit.value === '') {
                        throw new Error(`Certifique-se de preencher todos os campos!`);
                    };
                    verification = priceEdit;
                    if (priceEdit.value === '') {
                        throw new Error(`Certifique-se de preencher todos os campos!`);
                    };
                    verification = descriptionEdit;
                    if (descriptionEdit.value.length < 5) {
                        throw new Error(`Crie uma descrição com pelo menos 5 caracteres!`);
                    };
                    verification = priceEdit;
                    if (isNaN(priceEdit.value) === true ) {
                        throw new Error(`Preencha o campo de valor somente com números!`);
                    };
                    verification = priceEdit;
                    if (Number(priceEdit.value) < 0) {
                        throw new Error(`Preencha o campo de valor somente com números positivos!`);
                    };

                    object2.name = productNameEdit.value;
                    object2.description = descriptionEdit.value;
                    object2.price = priceEdit.value;

                    list(products);

                    editBox.style.display = 'none';

                } catch (error) {
                    document.querySelector('#feedback2').style.color = '#e32636';
                    verification.style.borderColor = '#e32636';
                    document.querySelector('#feedback2').innerHTML = error.message;
                };
            };
        }
        //close edit modal
        document.querySelector('#edit svg').onclick = function closeEdit() {
            editBox.style.display = 'none';
            const object2 = products[edition.value];
            productNameEdit.value = (`${object2.name}`);
            descriptionEdit.value = (`${object2.description}`);
            priceEdit.value = (`${Number(object2.price)}`);
        };

        //delete line function
        deleteImg.onclick = function deleteLine(){
            products.splice(line.value, 1)
            list(products);
        };

        i++;
 
    });

    //cleaning initial inputs
    productName.value = '';
    description.value = '';
    price.value = '';
};

//sort names
function sortNames() {
    const sorted = products.sort((a,b) => {
        return (a.name).localeCompare(b.name);
    });
    list(sorted);
}

//sort price
function sortPrice() {
    const sorted = products.sort((a,b) => {
        return (a.price) - (b.price);
    });
    list(sorted);
}

//search
function searchFilter () {
    if(products.value = ''){
        list(products);
    } else {const array = products.filter((obj) => {
            if(obj.name.includes(searchBar.value) || obj.price === searchBar.value || obj.price === searchBar.value.replace(',','.')){
                return true;
            } else {
                return false;
            };
        });
        list(array)
    }
}