const URL_DESTINO = "http://192.168.113.153:5501/Pizzeria/";
const RECURSO = "datos.json";
let datos;

function obtenerDatos() {
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                procesarRespuesta(this.responseText);
            } else {
                alert("uh-oh");
            }
        }
    };

    xmlHttp.open("GET", URL_DESTINO + RECURSO, true);
    xmlHttp.send(null);
}

function procesarRespuesta(jsonDoc) {
    let objetoJson = JSON.parse(jsonDoc);
    datos = objetoJson;

    console.log(objetoJson);

    let div, input, label, text;
    let tamañosDiv = document.getElementById("tamaños-container");
    let ingredientesDiv = document.getElementById("ingredientes-container");

    objetoJson.tamaños.map((tamaño) => {
        div = document.createElement("div");
        div.classList = "tamaño-radio";

        input = document.createElement("input");
        input.type = "radio";
        input.id = tamaño.nombre.toLowerCase();
        input.name = "tamaño";
        input.value = tamaño.nombre;

        label = document.createElement("label");
        label.for = tamaño.nombre.toLowerCase();

        text = document.createTextNode(tamaño.nombre);

        label.appendChild(text);
        div.appendChild(input);
        div.appendChild(label);

        tamañosDiv.appendChild(div);
    });

    objetoJson.ingredientes.map((ingrediente, index) => {
        if (ingrediente.estaDisponible) {
            div = document.createElement("div");
            div.classList = "ingrediente-checkbox";

            input = document.createElement("input");
            input.type = "checkbox";
            input.id = ingrediente.nombre.toLowerCase();
            input.name = `ingrediente${index + 1}`;
            input.value = ingrediente.nombre;

            label = document.createElement("label");
            label.for = ingrediente.nombre.toLowerCase();

            text = document.createTextNode(ingrediente.nombre);

            label.appendChild(text);
            div.appendChild(input);
            div.appendChild(label);

            ingredientesDiv.appendChild(div);
        }
    });
}

function isStringEmpty(string) {
    if (string.trim(" ") === "") {
        return true;
    }

    return false;
}

function validateInputText(inputs) {
    let inputText;

    for (let input of inputs) {
        if (input.type === "text") {
            inputText = document.getElementById(input.id);

            if (isStringEmpty(inputText.value)) {
                return false;
            }
        }
    }

    return true;
}

function validateInputRadio(name) {
    let tamañoPizza = document.getElementsByName(name);

    for (let i = 0; i < tamañoPizza.length; i++) {
        if (tamañoPizza[i].checked) {
            return true;
        }
    }

    return false;
}

function precioDeTamañoPizza() {
    let tamañoPizza = document.getElementsByName("tamaño");
    let precioTamañoPizza;

    for (let i = 0; i < tamañoPizza.length; i++) {
        if (tamañoPizza[i].checked) {
            datos.tamaños.map((tamaño) => {
                if (tamaño.nombre === tamañoPizza[i].value)
                    precioTamañoPizza = tamaño.precio;
            });
        }
    }

    console.log(precioTamañoPizza);

    return precioTamañoPizza;
}

function validateInputCheckbox(inputs) {
    for (let input of inputs) {
        if (input.type === "checkbox" && input.checked) {
            return true;
        }
    }

    return false;
}

function precioDeIngredientes() {
    let camposInput = document.getElementsByTagName("input");
    let precioTotalIngredientes = 0;

    for (let input of camposInput) {
        if (input.type === "checkbox" && input.checked) {
            datos.ingredientes.map((ingrediente) => {
                if (ingrediente.nombre === input.value)
                    precioTotalIngredientes += ingrediente.precio;
            });
        }
    }

    console.log(precioTotalIngredientes);

    return precioTotalIngredientes;
}

function validateForm() {
    let camposInput = document.getElementsByTagName("input");

    if (!validateInputText(camposInput)) {
        alert("Se debe rellenar todos los campos de texto.");
        return false;
    }

    if (!validateInputRadio("tamaño")) {
        alert("Se debe seleccionar el tamaño de la pizza");
        return false;
    }

    if (!validateInputCheckbox(camposInput)) {
        alert("Debe seleccionar al menos 1 ingrediente.");
        return false;
    }

    return true;
}

function procesarPedido() {
    if (validateForm()) {
        let precioTotal = precioDeTamañoPizza() + precioDeIngredientes();

        let p = document.createElement("p");
        let pContenido = document.createTextNode(
            `El precio total seria : ${precioTotal}€`
        );

        p.appendChild(pContenido);

        document.body.appendChild(p);
    }
}

window.onload = function () {
    obtenerDatos();

    let button = document.getElementById("form-button");
    let buttonActualizar = document.getElementById("actualizar-button");

    button.onclick = procesarPedido;
    buttonActualizar.onclick = () => location.reload();
};
