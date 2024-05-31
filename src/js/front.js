import * as auth from './auth';

let create_product = document.querySelector("#createProductButton");
let createProductModal = document.querySelector("#createProductModal");

let editProductPreview = document.querySelector("#editProductPreview")
let editProduct = document.querySelectorAll("#editProduct");
let editProductModal = document.querySelector("#editProductModal");
let id_edit_product = null;

let deleteProductPreview = document.querySelector("#deleteProductPreview")
let deleteProductEdit = document.querySelector("#deleteProductEdit");
let deleteProduct = document.querySelectorAll("#deleteProduct");
let deleteProductModal = document.querySelector("#deleteProductModal");
let id_delete_product = null;

let previewProduct = document.querySelectorAll("#previewProduct");
let previewProductModal = document.querySelector("#previewProductModal");
let id_preview_product = null;

let checkboxes = document.querySelectorAll("#checkbox-table-search");

let images_edit = [];
let check_products = [];

create_product?.addEventListener("click", () => {
    createProductModal.style.display = "flex"
    editProductModal.style.display = "none"
    deleteProductModal.style.display = "none"
    previewProductModal.style.display = "none"
})

let closeCreateProductModal = document.querySelector("#closeCreateProductModal");

closeCreateProductModal?.addEventListener("click", () => {
    createProductModal.style.display = "none"
});

let discardProductCreate = document.querySelector("#discardProductCreate");

discardProductCreate?.addEventListener("click", () => {
    createProductModal.style.display = "none"
    let inputs = createProductModal.querySelectorAll("input");
    inputs.forEach(input => {
        input.value = "";
    });

    let textareas = createProductModal.querySelectorAll("textarea");
    textareas.forEach(textarea => {
        textarea.value = "";
    });

    images_edit = [];
    let content_images_create = document.querySelector("#content-images-create");
    content_images_create.innerHTML = "";

    let category = createProductModal.querySelector("#category");
    category.selectedIndex = 0;

});

editProductModal?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(editProductModal);

    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    formObject.id_product = id_edit_product;
    formObject.images = images_edit;

    const edit_product = await fetch('http://localhost:4000/products/edit', {
        method: 'PUT',
        body: JSON.stringify(formObject),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if(!edit_product.ok){
        alert("Ha ocurrido un error.")
    }

    editProductModal.style.display = "none"
    window.location.reload();
    images_edit = [];
})

let dropzone_image = document.querySelector("#dropzone_image");
let dropzone_image_preview = document.querySelector("#preview-dopzone-image")

dropzone_image?.addEventListener("change", (e) => {
    let files = Array.from(e.target.files);
    let content_images_create = document.querySelector("#content-images-create");

    files.forEach((file) => {
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = function () {
            let div = document.createElement("div");
            div.classList.add("relative", "rounded-lg", "sm:w-36", "sm:h-36", "bg-gray-700");
            div.id = "delete_image_edit";
            let img = document.createElement("img");
            img.src = reader.result;
            img.classList.add("rounded-lg", "hover:opacity-80", "cursor-pointer", "transition-all", "duration-100", "ease-in");
            div.appendChild(img);
            let button = document.createElement("button");
            button.type = "button";
            button.classList.add("absolute", "text-red-500", "hover:text-red-400", "bottom-1", "left-1");
            button.innerHTML = `
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <span class="sr-only">Remove image</span>
            `;
            div.appendChild(button);
            content_images_create.appendChild(div);
            images_edit.push(reader.result);

            div.addEventListener("click", function() {
                let index = images_edit.indexOf(div.querySelector("img").src);
                images_edit.splice(index, 1);
                div.remove();
            });
        }
    });
});

let closeEditProductModal = document.querySelector("#closeEditProductModal");

closeEditProductModal?.addEventListener("click", () => {
    editProductModal.style.display = "none"
});

deleteProduct?.forEach(item => {
    item?.addEventListener("click", () => {
        deleteProductModal.style.display = "flex"
        createProductModal.style.display = "none"
        editProductModal.style.display = "none"
        previewProductModal.style.display = "none"
        id_delete_product = item.getAttribute("data-id")
    });
})

deleteProductPreview?.addEventListener("click", () => {
    deleteProductModal.style.display = "flex"
    createProductModal.style.display = "none"
    editProductModal.style.display = "none"
    previewProductModal.style.display = "none"
    id_delete_product = deleteProductPreview.getAttribute("data-id")
})

deleteProductEdit?.addEventListener("click", () => {
    deleteProductModal.style.display = "flex"
    createProductModal.style.display = "none"
    editProductModal.style.display = "none"
    previewProductModal.style.display = "none"
    id_delete_product = deleteProductEdit.getAttribute("data-id")
});

let closeDeleteProductModal = document.querySelector("#closeDeleteProductModal");
let deleteProductCancel = document.querySelector("#deleteProductCancel");

closeDeleteProductModal?.addEventListener("click", () => {
    deleteProductModal.style.display = "none"
});

deleteProductCancel?.addEventListener("click", () => {
    deleteProductModal.style.display = "none"
});

let closePreviewProductModal = document.querySelector("#closePreviewProductModal");

closePreviewProductModal?.addEventListener("click", () => {
    previewProductModal.style.display = "none"
});

createProductModal.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(createProductModal);

    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    formObject.images = images_edit;
    formObject.id_user = auth.getCookie("ID-USER");

    let reader = new FileReader();
    reader.readAsDataURL(formObject.dropzone_image);
    reader.onloadend = async function () {
        formObject.dropzone_image = reader.result;

        const create_product = await fetch('http://localhost:4000/products/create', {
            method: 'POST',
            body: JSON.stringify(formObject),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    
        if(!create_product.ok){
            alert("Ha ocurrido un error.")
        }
    
        createProductModal.style.display = "none"
        window.location.reload();
        images_edit = [];
    }
});

let deleteProductConfirm = document.querySelector("#deleteProductConfirm");

deleteProductConfirm?.addEventListener("click", async () => {
    const data = {
        id_product: id_delete_product
    }

    const delete_product = await fetch(`http://localhost:4000/products/delete`, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if(!delete_product.ok){
        alert("Ha ocurrido un error.")
    }

    deleteProductModal.style.display = "none"
    window.location.reload();
    images_edit = [];
});

let closeDeleteProductSelectModal = document.querySelector("#closeDeleteProductSelectModal");
let deleteProductSelectCancel = document.querySelector("#deleteProductSelectCancel");
let deleteProductSelectModal = document.querySelector("#deleteProductSelectModal")

closeDeleteProductSelectModal?.addEventListener("click", () => {
    deleteProductSelectModal.style.display = "none"
});

deleteProductSelectCancel?.addEventListener("click", () => {
    deleteProductSelectModal.style.display = "none"
});

let deleteProductSelect = document.querySelector("#deleteProductSelect");

deleteProductSelect?.addEventListener("click", () => {
    deleteProductSelectModal.style.display = "flex"
    createProductModal.style.display = "none"
    editProductModal.style.display = "none"
    previewProductModal.style.display = "none"
    deleteProductModal.style.display = "none"
});

let deleteProductSelectConfirm = document.querySelector("#deleteProductSelectConfirm");

deleteProductSelectConfirm?.addEventListener("click", async () => {
    const data = {
        id_product: check_products
    }

    const delete_product = await fetch(`http://localhost:4000/products/delete`, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if(!delete_product.ok){
        alert("Ha ocurrido un error.")
    }

    deleteProductModal.style.display = "none"
    window.location.reload();
    images_edit = [];
    check_products = [];
});

let logout = document.querySelector("#logout");
logout?.addEventListener("click", async () => {
    auth.deleteCookie("ID-USER");
    window.location.href = "/SignIn";
});

function checkbox_all(){
    let checkbox_all = document.querySelector("#checkbox-all");
    checkbox_all?.addEventListener("change", () => {
        let checkboxes = document.querySelectorAll("#checkbox-table-search");
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkbox_all.checked;
            let data_id = checkbox.getAttribute("data-id");
            if(checkbox.checked){
                check_products.push(data_id);
            }
        });
    });
}

function checkboxesProduct(preview){
    preview.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            let data_id = checkbox.getAttribute("data-id");
            if(checkbox.checked){
                check_products.push(data_id);
            }else{
                let index = check_products.indexOf(data_id);
                check_products.splice(index, 1);
            }
        });
    });
}

function previewAllProduct(preview){
    preview?.forEach(item => {
        item?.addEventListener("click", () => {
            previewProductModal.style.display = "flex"
            createProductModal.style.display = "none"
            editProductModal.style.display = "none"
            deleteProductModal.style.display = "none"
            id_preview_product = item.getAttribute("data-id")
        
            const get_product = async () => {
                const response = await fetch(`http://localhost:4000/products/product?id_product=${id_preview_product}`);
                const data = await response.json();
                return data;
            }
        
            get_product().then(data => {
                previewProductModal.querySelector("#name_product").textContent = data[0].name;
                previewProductModal.querySelector("#description_product").textContent = data[0].description;
                previewProductModal.querySelector("#brand_product").textContent = data[0].brand;
                previewProductModal.querySelector("#price_product").textContent = "$" + data[0].price;
                previewProductModal.querySelector("#weight_product").textContent = data[0].item_weight + "kg";
                previewProductModal.querySelector("#dimensions_product").textContent = `${data[0].length} x ${data[0].breadth} x ${data[0].width}`;
                deleteProductPreview.setAttribute("data-id", data[0].id_product);
                editProductPreview.setAttribute("data-id", data[0].id_product);
                
        
                let content_images_preview = document.querySelector("#content-images-preview");
                content_images_preview.innerHTML = "";
                JSON.parse(data[0].images).forEach(image => {
                    let div = document.createElement("div");
                    div.classList.add("p-2", "w-auto", "rounded-lg", "bg-gray-700");
                    let img = document.createElement("img");
                    img.src = image;
                    img.classList.add("w-full", "h-full");
                    div.appendChild(img);
                    content_images_preview.appendChild(div);
                });
            })
        });
    })
}

function editAllProduct(preview){
    preview?.forEach(item => {
        item?.addEventListener("click", () => {
            editProductModal.style.display = "flex"
            createProductModal.style.display = "none"
            deleteProductModal.style.display = "none"
            previewProductModal.style.display = "none"
            id_edit_product = item.getAttribute("data-id")
        
            const get_product = async () => {
                const response = await fetch(`http://localhost:4000/products/product?id_product=${id_edit_product}`);
                const data = await response.json();
                return data;
            }
        
            get_product().then(data => {
                editProductModal.querySelector("#name_product").value = data[0].name;
                editProductModal.querySelector("#description_product").value = data[0].description;
                editProductModal.querySelector("#brand_product").value = data[0].brand;
                editProductModal.querySelector("#weight_product").value = data[0].item_weight;
                editProductModal.querySelector("#length_product").value = data[0].length;
                editProductModal.querySelector("#breadth_product").value = data[0].breadth;
                editProductModal.querySelector("#width_product").value = data[0].width;
                deleteProductEdit.setAttribute("data-id", data[0].id_product);
        
                let category = editProductModal.querySelector("#category_product");
                let options = category.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value == data[0].category) {
                        category.selectedIndex = i;
                        break;
                    }
                }
        
                let content_images_edit = document.querySelector("#content-images-edit");
                content_images_edit.innerHTML = "";
                JSON.parse(data[0].images).forEach(image => {
                    let div = document.createElement("div");
                    div.classList.add("relative", "rounded-lg", "sm:w-36", "sm:h-36", "bg-gray-700");
                    div.id = "delete_image_edit";
                    let img = document.createElement("img");
                    img.src = image;
                    img.classList.add("w-full", "h-full", "rounded-lg", "hover:opacity-80", "cursor-pointer", "transition-all", "duration-100", "ease-in");
                    div.appendChild(img);
                    let button = document.createElement("button");
                    button.type = "button";
                    button.classList.add("absolute", "text-red-500", "hover:text-red-400", "bottom-1", "left-1");
                    button.innerHTML = `
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">Remove image</span>
                    `;
                    div.appendChild(button);
                    content_images_edit.appendChild(div);
                    images_edit.push(image);
                    
                    div.addEventListener("click", function() {
                        let index = images_edit.indexOf(div.querySelector("img").src);
                        images_edit.splice(index, 1);
                        div.remove();
                    });

                    button.addEventListener("click", function() {
                        let index = images_edit.indexOf(div.querySelector("img").src);
                        images_edit.splice(index, 1);
                        div.remove();
                    });
                })
            })
        });
    })
}

function editAllProductPreview(preview){
    preview?.addEventListener("click", () => {
        editProductModal.style.display = "flex"
        createProductModal.style.display = "none"
        deleteProductModal.style.display = "none"
        previewProductModal.style.display = "none"
        id_edit_product = editProductPreview.getAttribute("data-id")

        const get_product = async () => {
            const response = await fetch(`http://localhost:4000/products/product?id_product=${id_edit_product}`);
            const data = await response.json();
            return data;
        }

        get_product().then(data => {
            editProductModal.querySelector("#name_product").value = data[0].name;
            editProductModal.querySelector("#description_product").value = data[0].description;
            editProductModal.querySelector("#brand_product").value = data[0].brand;
            editProductModal.querySelector("#weight_product").value = data[0].item_weight;
            editProductModal.querySelector("#length_product").value = data[0].length;
            editProductModal.querySelector("#breadth_product").value = data[0].breadth;
            editProductModal.querySelector("#width_product").value = data[0].width;
            deleteProductEdit.setAttribute("data-id", data[0].id_product);

            let category = editProductModal.querySelector("#category_product");
            let options = category.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value == data[0].category) {
                    category.selectedIndex = i;
                    break;
                }
            }

            let content_images_edit = document.querySelector("#content-images-edit");
            content_images_edit.innerHTML = "";
            JSON.parse(data[0].images).forEach(image => {
                let div = document.createElement("div");
                div.classList.add("relative", "rounded-lg", "sm:w-36", "sm:h-36", "bg-gray-700");
                div.id = "delete_image_edit";
                let img = document.createElement("img");
                img.src = image;
                img.classList.add("w-full", "h-full", "rounded-lg", "hover:opacity-80", "cursor-pointer", "transition-all", "duration-100", "ease-in");
                div.appendChild(img);
                let button = document.createElement("button");
                button.type = "button";
                button.classList.add("absolute", "text-red-500", "hover:text-red-400", "bottom-1", "left-1");
                button.innerHTML = `
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">Remove image</span>
                `;
                div.appendChild(button);
                content_images_edit.appendChild(div);
                images_edit.push(image);
                    
                div.addEventListener("click", function() {
                    let index = images_edit.indexOf(div.querySelector("img").src);
                    images_edit.splice(index, 1);
                    div.remove();
                });

                button.addEventListener("click", function() {
                    let index = images_edit.indexOf(div.querySelector("img").src);
                    images_edit.splice(index, 1);
                    div.remove();
                });
            });

        })
    });
}

function deleteAllProduct(preview, preview2, preview3){
    preview?.forEach(item => {
        item?.addEventListener("click", () => {
            deleteProductModal.style.display = "flex"
            createProductModal.style.display = "none"
            editProductModal.style.display = "none"
            previewProductModal.style.display = "none"
            id_delete_product = item.getAttribute("data-id")
        });
    })
    
    preview2?.addEventListener("click", () => {
        deleteProductModal.style.display = "flex"
        createProductModal.style.display = "none"
        editProductModal.style.display = "none"
        previewProductModal.style.display = "none"
        id_delete_product = deleteProductPreview.getAttribute("data-id")
    })
    
    preview3?.addEventListener("click", () => {
        deleteProductModal.style.display = "flex"
        createProductModal.style.display = "none"
        editProductModal.style.display = "none"
        previewProductModal.style.display = "none"
        id_delete_product = deleteProductEdit.getAttribute("data-id")
    });
}

function changeImageEdit(){
    let image_product_edit = document.querySelector("#image_product_edit");
    image_product_edit?.addEventListener("change", (e) => {
        let files = Array.from(e.target.files);
        let content_images_edit = document.querySelector("#content-images-edit");
    
        files.forEach((file) => {
            let reader = new FileReader();
    
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                let div = document.createElement("div");
                div.classList.add("relative", "rounded-lg", "sm:w-36", "sm:h-36", "bg-gray-700");
                div.id = "delete_image_edit";
                let img = document.createElement("img");
                img.src = reader.result;
                img.classList.add("w-full", "h-full", "rounded-lg", "hover:opacity-80", "cursor-pointer", "transition-all", "duration-100", "ease-in");
                div.appendChild(img);
                let button = document.createElement("button");
                button.type = "button";
                button.classList.add("absolute", "text-red-500", "hover:text-red-400", "bottom-1", "left-1");
                button.innerHTML = `
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">Remove image</span>
                `;
                div.appendChild(button);
                content_images_edit.appendChild(div);
                images_edit.push(reader.result);
    
                div.addEventListener("click", function() {
                    let index = images_edit.indexOf(div.querySelector("img").src);
                    images_edit.splice(index, 1);
                    div.remove();
                });

                button.addEventListener("click", function() {
                    let index = images_edit.indexOf(div.querySelector("img").src);
                    images_edit.splice(index, 1);
                    div.remove();
                });
            }
        });
    });
}

checkboxesProduct(checkboxes);
checkbox_all();
previewAllProduct(previewProduct);
editAllProduct(editProduct);
editAllProductPreview(editProductPreview);
deleteAllProduct(deleteProduct, deleteProductPreview, deleteProductEdit);
changeImageEdit();

let simple_search = document.querySelector("#simple-search");

simple_search?.addEventListener("input", async (e) => {
    let value = e.target.value;
    let data = {
        name: value,
        id_user: auth.getCookie("ID-USER")
    }

    const search_product = await fetch(`http://localhost:4000/products/search`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if(!search_product.ok){
        alert("Ha ocurrido un error.")
    }

    let products = await search_product.json();
    let table = document.querySelector("#body-products");
    table.innerHTML = "";

    if(!products.length > 0){
        let tr = document.createElement("tr");
        tr.classList.add("border-b", "w-full", "border-gray-600", "hover:bg-gray-700");
        let td = document.createElement("td");
        td.classList.add("p-4", "w-full");
        td.setAttribute("colspan", "10");
        let div = document.createElement("div");
        div.classList.add("flex", "items-center");
        let h1 = document.createElement("h1");
        h1.classList.add("text-base", "font-semibold");
        h1.textContent = "Not found products";
        div.appendChild(h1);
        td.appendChild(div);
        tr.appendChild(td);
        table.appendChild(tr);
        return;
    }

    products.forEach(item => {
        const tr = document.createElement("tr");
        tr.classList.add("border-b", "border-gray-600", "hover:bg-gray-700");
        tr.setAttribute("data-id", item.id_product);

        const td1 = document.createElement("td");
        td1.classList.add("p-4", "w-4");
        const div1 = document.createElement("div");
        div1.classList.add("flex", "items-center");
        const checkbox = document.createElement("input");
        checkbox.setAttribute("data-id", item.id_product);
        checkbox.id = "checkbox-table-search";
        checkbox.type = "checkbox";
        checkbox.onclick = function(event) {
            event.stopPropagation();
        };
        checkbox.classList.add("w-4", "h-4", "text-primary-600", "rounded", "focus:ring-primary-500", "focus:ring-primary-600", "ring-offset-gray-800", "focus:ring-2", "bg-gray-700", "border-gray-600");
        const label = document.createElement("label");
        label.setAttribute("for", "checkbox-table-search");
        label.classList.add("sr-only");
        div1.appendChild(checkbox);
        div1.appendChild(label);
        td1.appendChild(div1);

        const th = document.createElement("th");
        th.scope = "row";
        th.classList.add("px-4", "py-3", "font-medium", "whitespace-nowrap", "text-white");
        const div2 = document.createElement("div");
        div2.classList.add("flex", "items-center", "mr-3");
        const img = document.createElement("img");
        img.src = JSON.parse(item.images)[0] || "/favicon.svg";
        img.alt = item.name;
        img.classList.add("h-8", "w-auto", "mr-3");
        div2.appendChild(img);
        div2.innerHTML += item.name + "&#34;";
        th.appendChild(div2);

        const td2 = document.createElement("td");
        td2.classList.add("px-4", "py-3");
        const span = document.createElement("span");
        span.classList.add("bg-primary-100", "text-primary-800", "text-xs", "font-medium", "px-2", "py-0.5", "rounded", "bg-primary-900", "text-primary-300");
        span.textContent = item.category;
        td2.appendChild(span);

        const td3 = document.createElement("td");
        td3.classList.add("px-4", "py-3", "font-medium", "whitespace-nowrap", "text-white");
        const div3 = document.createElement("div");
        div3.classList.add("flex", "items-center");
        if (item.stock > 0 && item.stock < 50) {
            const div4 = document.createElement("div");
            div4.classList.add("h-4", "w-4", "rounded-full", "inline-block", "mr-2", "bg-red-700");
            div3.appendChild(div4);
        } else if (item.stock >= 50 && item.stock < 90) {
            const div5 = document.createElement("div");
            div5.classList.add("h-4", "w-4", "rounded-full", "inline-block", "mr-2", "bg-yellow-400");
            div3.appendChild(div5);
        } else {
            const div6 = document.createElement("div");
            div6.classList.add("h-4", "w-4", "rounded-full", "inline-block", "mr-2", "bg-green-400");
            div3.appendChild(div6);
        }
        div3.innerHTML += item.stock;
        td3.appendChild(div3);

        const td4 = document.createElement("td");
        td4.classList.add("px-4", "py-3", "font-medium", "whitespace-nowrap", "text-white");
        td4.textContent = item.sales_day;

        const td5 = document.createElement("td");
        td5.classList.add("px-4", "py-3", "font-medium", "whitespace-nowrap", "text-white");
        td5.textContent = item.sales_month;

        const td6 = document.createElement("td");
        td6.classList.add("px-4", "py-3", "font-medium", "whitespace-nowrap", "text-white");
        const div7 = document.createElement("div");
        div7.classList.add("flex", "items-center");
        const svg = document.createElement("svg");
        svg.setAttribute("aria-hidden", "true");
        svg.classList.add("w-5", "h-5", "text-yellow-400");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", "0 0 20 20");
        svg.innerHTML = '<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />';
        div7.appendChild(svg);
        const span2 = document.createElement("span");
        span2.classList.add("text-gray-400", "ml-1");
        span2.textContent = item.rating;
        div7.appendChild(span2);
        td6.appendChild(div7);

        const td7 = document.createElement("td");
        td7.classList.add("px-4", "py-3", "font-medium", "whitespace-nowrap", "text-white");
        const div8 = document.createElement("div");
        div8.classList.add("flex", "items-center");
        const svg2 = document.createElement("svg");
        svg2.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg2.setAttribute("viewBox", "0 0 24 24");
        svg2.setAttribute("fill", "currentColor");
        svg2.classList.add("w-5", "h-5", "text-gray-400", "mr-2");
        svg2.innerHTML = '<path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />';
        const span3 = document.createElement("span");
        span3.textContent = item.sales;
        div8.appendChild(svg2);
        div8.appendChild(span3);
        td7.appendChild(div8);

        const td8 = document.createElement("td");
        td8.classList.add("px-4", "py-3", "font-medium", "whitespace-nowrap", "text-white");
        td8.textContent = formatNumber(item.revenue);

        const td9 = document.createElement("td");
        td9.classList.add("px-4", "py-3", "font-medium", "whitespace-nowrap", "text-white");
        const div9 = document.createElement("div");
        div9.classList.add("flex", "items-center", "space-x-4");
        const button1 = document.createElement("button");
        button1.setAttribute("data-id", item.id_product);
        button1.id = "editProduct";
        button1.type = "button";
        button1.setAttribute("data-drawer-target", "drawer-update-product");
        button1.setAttribute("data-drawer-show", "drawer-update-product");
        button1.setAttribute("aria-controls", "drawer-update-product");
        button1.classList.add("py-2", "px-3", "flex", "items-center", "text-sm", "font-medium", "text-center", "text-white", "bg-primary-700", "rounded-lg", "focus:ring-4", "focus:outline-none", "bg-blue-600", "hover:bg-blue-700", "focus:ring-blue-800");
        button1.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 -ml-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"/></svg>Edit';
        const button2 = document.createElement("button");
        button2.setAttribute("data-id", item.id_product);
        button2.id = "previewProduct";
        button2.type = "button";
        button2.setAttribute("data-drawer-target", "drawer-read-product-advanced");
        button2.setAttribute("data-drawer-show", "drawer-read-product-advanced");
        button2.setAttribute("aria-controls", "drawer-read-product-advanced");
        button2.classList.add("py-2", "px-3", "flex", "items-center", "text-sm", "font-medium", "text-center", "focus:outline-none", "rounded-lg", "border", "hover:text-primary-700", "focus:z-10", "focus:ring-4", "focus:ring-gray-200", "focus:ring-gray-700", "bg-gray-800", "text-gray-400", "border-gray-600", "hover:text-white", "hover:bg-gray-700");
        button2.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-2 -ml-0.5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"/></svg>Preview';
        const button3 = document.createElement("button");
        button3.setAttribute("data-id", item.id_product);
        button3.id = "deleteProduct";
        button3.type = "button";
        button3.setAttribute("data-modal-target", "delete-modal");
        button3.setAttribute("data-modal-toggle", "delete-modal");
        button3.classList.add("flex", "items-center", "border", "focus:ring-4", "focus:outline-none", "font-medium", "rounded-lg", "text-sm", "px-3", "py-2", "text-center", "border-red-500", "text-red-500", "hover:text-white", "hover:bg-red-600", "focus:ring-red-900");
        button3.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 -ml-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>Delete';
        div9.appendChild(button1);
        div9.appendChild(button2);
        div9.appendChild(button3);
        td9.appendChild(div9);

        tr.appendChild(td1);
        tr.appendChild(th);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);

        table.appendChild(tr);

        checkboxesProduct([checkbox]);
        checkbox_all();
        previewAllProduct([button2]);
        editAllProduct([button1]);
        editAllProductPreview(editProductPreview);
        deleteAllProduct([button3], deleteProductPreview, deleteProductEdit);
        changeImageEdit();
    });
});

function formatNumber(number) {
    if (number >= 1e9) {
        return (number / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        return number.toString();
    }
}

async function generateProducts() {
    let names = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headphones", "Microphone", "Camera", "Smartphone", "Tablet", "Smartwatch"];
    let brands = ["Apple", "Samsung", "Dell", "HP", "Sony", "Bose", "Canon", "Nikon", "LG", "Microsoft"];
    let categories = ["Electronics", "Computers", "Smartphones", "Tablets", "Cameras", "Accessories", "Peripherals"];
    let descriptions = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id arcu nec odio aliquet ultricies. Ut in metus in odio tincidunt ultricies. Suspendisse potenti. Sed nec luctus tellus"];

    let randomName = names[Math.floor(Math.random() * names.length)];
    let randomBrand = brands[Math.floor(Math.random() * brands.length)];
    let randomCategory = categories[Math.floor(Math.random() * categories.length)];
    let randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    let randomPrice = Math.floor(Math.random() * 1000) + 1;
    let randomWeight = Math.floor(Math.random() * 100) + 1;
    let randomLength = Math.floor(Math.random() * 50) + 1;
    let randomBreadth = Math.floor(Math.random() * 50) + 1;
    let randomWidth = Math.floor(Math.random() * 50) + 1;
    let randomUserId = auth.getCookie("ID-USER")

    const data = {
        name: randomName,
        category: randomCategory,
        brand: randomBrand,
        price: randomPrice.toString(),
        weight: randomWeight.toString(),
        length: randomLength.toString(),
        breadth: randomBreadth.toString(),
        width: randomWidth.toString(),
        description: randomDescription,
        dropzone_image: "",
        images: [],
        id_user: randomUserId
    };

    const createProduct = await fetch('http://localhost:4000/products/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!createProduct.ok) {
        console.error('Failed to create product');
        return;
    }

    window.location.reload();
}

let generateProductsButton = document.querySelector("#generateProducts");

generateProductsButton?.addEventListener("click", async () => {
    for (let i = 0; i < 10; i++) {
        generateProducts();
    }
});