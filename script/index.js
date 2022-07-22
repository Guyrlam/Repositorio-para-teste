//DOM ELEMENTS
const app = document.querySelector("#app");

//LISTENERS
window.addEventListener("load", initialPage);

//FUNCTIONS

//PROMISES

function initialPromise(){
    return new Promise((resolve,reject)=>{
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then((resp) => {
            if(resp.status === 200){
                return (resp.json())
            } else {
                reject('[ERROR]: Não foi possível selecionar este estado.');
            }
        })
        .then((data) => {
            const sort = data.sort((a, b) => {
            return a.nome.localeCompare(b.nome);
            });

            const arr = [];

            sort.forEach((el) => {
                obj = {
                    "value": el.sigla,
                    "nome": el.nome
                }
                arr.push(obj)
            });

            resolve(arr)
        });
    });
}

function cityPromise(uf){
    return new Promise((resolve,reject)=>{
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then((resp) => {
            if(resp.status === 200){
                return (resp.json())
            } else {
                reject('[ERROR]: Não foi possível selecionar este município.');
            }
        })
        .then((data) => {
            const sort = data.sort((a, b) => {
            return a.nome.localeCompare(b.nome);
            });

            const arr = [];

            sort.forEach((el) => {
                obj = {
                    "value": el.id,
                    "nome": el.nome
                }
                arr.push(obj)
            });

            resolve(arr)
        });
    });
}

function climatePromise(geocode){
    return new Promise((resolve,reject)=>{
        fetch(`https://apiprevmet3.inmet.gov.br/previsao/${geocode}`)
        .then((resp) => {
            if(resp.status === 200){
                return (resp.json())
            } else {
                reject('[ERROR]: Não foi possível exibir os dados relacionados a esse município.');
            }
        })
        .then((resp) => {
            return resp[geocode];
        })
        .then((resp) => {
            const date = new Date()
            let dateString;
            let obj = {};
            
            for(let i = 0; i < 4; i++){
                if(date.getMonth() < 9){
                    dateString = `${date.getDate()+i}/0${date.getMonth()+1}/${date.getFullYear()}`
                } else {
                    dateString = `${date.getDate()+i}/${date.getMonth()+1}/${date.getFullYear()}`
                }

                const reference = resp[dateString]

                if(i<2){
                    obj[dateString] = {
                        "manha": {
                            "data": dateString,
                            "dia_da_semana": reference.manha.dia_semana,
                            "icone": reference.manha.icone,
                            "resumo_da_previsao": reference.manha.resumo,
                            "temp_min": reference.manha.temp_min,
                            "temp_max": reference.manha.temp_max
                        },
                        "tarde": {
                            "data": dateString,
                            "dia_da_semana": reference.tarde.dia_semana,
                            "icone": reference.tarde.icone,
                            "resumo_da_previsao": reference.tarde.resumo,
                            "temp_min": reference.tarde.temp_min,
                            "temp_max": reference.tarde.temp_max
                        },
                        "noite": {
                            "data": dateString,
                            "dia_da_semana": reference.noite.dia_semana,
                            "icone": reference.noite.icone,
                            "resumo_da_previsao": reference.noite.resumo,
                            "temp_min": reference.noite.temp_min,
                            "temp_max": reference.noite.temp_max
                        }
                    }
                } else {
                    obj[dateString] = {
                        "data": dateString,
                        "dia_da_semana": reference.dia_semana,
                        "icone": reference.icone,
                        "resumo_da_previsao": reference.resumo,
                        "temp_min": reference.temp_min,
                        "temp_max": reference.temp_max
                    }
                }
            }
            resolve(obj)
        })
    })
} 


//REDIRECTORS

function initialPage() {
    app.innerHTML = `
        <div id="initial-page">

            <h2>Previsão do Tempo</h2>

            <p>Selecione um estado e uma cidade abaixo para conferir a previsão do tempo para eles</p>

            <span id="message">Mensagem de erro</span>
            
            <div id="state">
                <select class="select" name="state" id="state-select">
                    <option value="null" class="state-item" disabled selected>Selecione um Estado</option>
                </select>
            </div>

            <div id="city">
                <div class="select">Selecione uma Cidade</div>
            </div>
        </div>
        `;
    const state = document.querySelector("#state-select");
    document.querySelector("#message").style.color = 'transparent';

  
    async function selectDetails(){
        try {
            const resp = await initialPromise()
            constructSelect(resp,state)
        } catch (err) {
            messageExibition(err)
        }
    }
    selectDetails()

    state.addEventListener("change", () => {
        citySelect(state.value);
    });
}

function citySelect(uf) {
    document.querySelector('body').style.cursor = ('wait');
    const page = document.querySelector("#city");

    page.innerHTML = `
            <select class="select" name="city" id="city-select">
                <option value="null" class="city-item" disabled selected>Selecione uma Cidade</option>
            </select>
        `;

    const city = document.querySelector("#city-select");

    
    async function selectDetails(){
        try {
            const resp = await cityPromise(uf)
            constructSelect(resp,city)
        } catch (err) {
            messageExibition(err)
        }
    }
    selectDetails()

    city.addEventListener("change", () => {
        climateInfo(city.value);
    });
}

async function climateInfo(geocode){
    try {
        document.querySelector('body').style.cursor = ('wait');
        const resp = await climatePromise(geocode)
        constructClimate(resp)
    } catch (err) {
        document.querySelector('body').style.cursor = ('default');
        messageExibition(err)
    }
}


//CONSTRUCTS

function constructClimate(reference) {
    const page = document.querySelector('#app')
    page.innerHTML = (`
        <div id="climate">
        </div>
    `)
    const climate = document.querySelector('#climate')

    let i = 0;
    for(const date in reference){

        const obj = reference[date]

        if(i < 2){
            climate.innerHTML += `
                <div class="climate-infos">
                <h2>${obj.manha.data} - ${obj.manha.dia_da_semana}</h2>
                    <div id="turn">
                        <div>
                            <h3>Manhã</h3>
                            <div>
                                <img src="${obj.manha.icone}" alt="imagem do tempo">
                            </div>
                            <div>
                                <span class="label">Resumo da Previsão :</span>
                                <span>${obj.manha.resumo_da_previsao}</span>
                            </div>
                            <div>
                                <span class="label">Temperatura Mínima :</span>
                                <span>${obj.manha.temp_min}</span>
                            </div>
                            <div>
                                <span class="label">Temperatura Máxima :</span>
                                <span>${obj.manha.temp_max}</span>
                            </div>
                        </div>
                        <div>
                            <h3>Tarde</h3>
                            <div>
                                <img src="${obj.tarde.icone}" alt="imagem do tempo">
                            </div>
                            <div>
                                <span class="label">Resumo da Previsão :</span>
                                <span>${obj.tarde.resumo_da_previsao}</span>
                            </div>
                            <div>
                                <span class="label">Temperatura Mínima :</span>
                                <span>${obj.tarde.temp_min}</span>
                            </div>
                            <div>
                                <span class="label">Temperatura Máxima :</span>
                                <span>${obj.tarde.temp_max}</span>
                            </div>
                        </div>
                        <div>
                            <h3>Noite</h3>
                            <div>
                                <img src="${obj.noite.icone}" alt="imagem do tempo">
                            </div>
                            <div>
                                <span class="label">Resumo da Previsão :</span>
                                <span>${obj.noite.resumo_da_previsao}</span>
                            </div>
                            <div>
                                <span class="label">Temperatura Mínima :</span>
                                <span>${obj.noite.temp_min}</span>
                            </div>
                            <div>
                                <span class="label">Temperatura Máxima :</span>
                                <span>${obj.noite.temp_max}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else{
            climate.innerHTML += `
                <div class="climate-infos">
                    <h2>${obj.data} - ${obj.dia_da_semana}</h2>
                    <div>
                        <div>
                            <img src="${obj.icone}" alt="imagem do tempo">
                        </div>
                        <div>
                            <span class="label">Resumo da Previsão :</span>
                            <span>${obj.resumo_da_previsao}</span>
                        </div>
                        <div>
                            <span class="label">Temperatura Mínima :</span>
                            <span>${obj.temp_min}</span>
                        </div>
                        <div>
                            <span class="label">Temperatura Máxima :</span>
                            <span>${obj.temp_max}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        i++
    }

    climate.innerHTML += ('<button onclick="initialPage()" id="return">Voltar</button>');
    document.querySelector('body').style.cursor = ('default');
}

function constructSelect(arr,select){
    arr.forEach((el) => {
        select.innerHTML += `
                <option value="${el.value}" class="state-item">${el.nome}</option>
            `;
    });
    document.querySelector('body').style.cursor = ('default');
}


//MESSAGE

function messageExibition(err) {
    const message = document.querySelector("#message")
    message.style.color = 'red';
    message.innerHTML = (err);
}

