export class DropdownSelect extends HTMLElement {
    constructor() {
        super();
        this.label_text = this.getAttribute('label-text');
    }
    
    connectedCallback() {
        //this.setAttribute('tabindex', 100);

        this.list = document.createElement('ul');
        this.list.setAttribute('class', 'items');

        this.anchor = document.createElement('span');
        this.anchor.setAttribute('class', 'anchor');
        this.anchor.textContent = this.label_text;

        this.appendChild(this.anchor);
        this.appendChild(this.list);

        this.addEventListener('focusout', this);
        document.addEventListener('click', this);

        this.visible = false;

        this.items = {};
        this.selected_item = null;

        this.selected_color = 'cyan';
        this.normal_color = 'white';

        this.style.display = 'inline-block';

        this.new_item_button = document.createElement('li');
        const new_item_label = document.createElement('span');
        new_item_label.innerText = '+ New';
        this.new_item_button.appendChild(new_item_label);
        this.list.appendChild(this.new_item_button);

        const style = document.createElement('style');
        style.innerHTML = `
            .anchor {
                position: relative;
                cursor: pointer;
                display: inline-block;
                padding: 5px 50px 5px 10px;
                border: 1px solid #ccc;
            }

            .anchor:after {
                position: absolute;
                content: "";
                border-left: 2px solid black;
                border-top: 2px solid black;
                padding: 5px;
                right: 10px;
                top: 20%;
                -moz-transform: rotate(-135deg);
                -ms-transform: rotate(-135deg);
                -o-transform: rotate(-135deg);
                -webkit-transform: rotate(-135deg);
                transform: rotate(-135deg);
            }

            .anchor:active:after {
                right: 8px;
                top: 21%;
            }

            ul.items {
                z-index: 1;
                padding: 2px;
                display: none;
                margin: 0;
                border: 1px solid #ccc;
                border-top: none;
                position: fixed;
                background-color: white;
            }

            ul.items li {
                list-style: none;
            }
            ul.items li span {
                margin-left: 4px;
            }

            .visible .anchor {
                color: #0094ff;
            }

            .visible .items {
                display: block;
            }
        `;

        this.appendChild(style);

    }

    getNewItemInput() {
        let new_item = prompt("Enter new item name: ");
        this.addItem(new_item);
        this.setSelectedItem(new_item);
        if (this.visible) this.toggleVisible();
    }


    toggleVisible() {
        if (this.visible) {
            this.classList.remove('visible');
            this.visible = false;
        }
        else {
            this.classList.add('visible');
            this.visible = true;
        }
    }
    handleEvent(evt) {
        if (evt.type == "click") {
            if (evt.target == this.anchor) {
                this.toggleVisible();
            }
            else if (this.visible && !this.list.contains(evt.target)) {
                //click outside the list, so hide
                this.toggleVisible();
            }
            else if (this.visible && this.new_item_button.contains(evt.target)) {
                this.getNewItemInput();
            }
            else if (this.visible && this.contains(evt.target) ) {
                let name_to_select = null;
                if (evt.target.tagName == 'SPAN') name_to_select = evt.target.innerText;
                else {
                    name_to_select = evt.target.childNodes[0].innerText;

                }
                this.setSelectedItem(name_to_select);
                this.toggleVisible();
            }

        }
    }
    hasItem(name) {
        return (name in this.items);
    }
    getSelectedItem() {
        return this.selected_item;
    }
    setSelectedItem(name) {
        if (this.selected_item != null) {
            this.items[this.selected_item].style.backgroundColor = this.normal_color;
        }
        this.selected_item = name;
        this.items[name].style.backgroundColor = this.selected_color;
        this.anchor.textContent = `${this.label_text}: ${name}`;
        this.dispatchEvent(new Event('change'));

    }
    addItem(name) {
        if (name in this.items) {
            return;
        }
        let list_item = document.createElement('li');

        let label = document.createElement('span');
        label.innerText = name;
        list_item.appendChild(label);

        this.list.appendChild(list_item);

        this.items[name] = list_item;
        if (this.selected_item == null) this.setSelectedItem(name);
    }
}

customElements.define('dropdown-select', DropdownSelect);