export class CheckBoxList extends HTMLElement {
    constructor() {
        super();
        this.label_text = this.getAttribute('label-text');
        this.default_checked = this.getAttribute('default-checked');
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

        this.checkboxes = {};

        this.style.display = 'inline-block';

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


    toggle_visible() {
        if (this.visible) {
            this.classList.remove('visible');
            this.visible = false;
        }
        else {
            this.classList.add('visible');
            this.visible = true;
        }
    }
    get_selected_items() {
        let selected_items = [];
        for (let [item_name, checkbox] of Object.entries(this.checkboxes)) {
            if (checkbox.checked) selected_items.push(item_name);
        }
        return selected_items;
    }
    item_selected(name) {
        return (name in this.checkboxes && this.checkboxes[name].checked);
    }
    handleEvent(evt) {
        if (evt.type == "click") {
            if (evt.target == this.anchor) {
                this.toggle_visible();
            }
            else if (this.visible && !this.list.contains(evt.target)) {
                //click outside the list, so hide
                this.toggle_visible();
            }

        }
    }
    has_item(name) {
        return (name in this.checkboxes);
    }
    add_item(name) {
        if (name in this.checkboxes) {
            return;
        }
        let list_item = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');

        if (this.default_checked) {
            checkbox.checked = true;
        }
        let label = document.createElement('span');
        label.innerHTML = name;
        list_item.appendChild(checkbox);
        list_item.appendChild(label);

        this.list.appendChild(list_item);
        this.checkboxes[name] = checkbox;
    }
}
customElements.define('checkbox-list', CheckBoxList);