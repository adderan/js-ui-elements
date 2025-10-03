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


        const style = document.createElement('style');
        style.innerHTML = `
        checkbox-list {
            display: inline-block;
            .anchor {
                cursor: pointer;
                position: relative;
                display: inline-block;
                padding: 5px 50px 5px 10px;
                border: 1px solid #ccc;
            }

            .anchor:after {
                content: "";
                position: absolute;
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
            ul {
                display: none;
                position: absolute;
            }

            ul.items {
                padding: 2px;
                margin: 0;
                border: 1px solid #ccc;
                border-top: none;
                background-color: white;
            }

            ul.items li {
                list-style: none;
            }
            ul.items li span {
                margin-left: 4px;
            }
        }
        checkbox-list[visible="true"] {

            .anchor {
                color: #0094ff;
            }

            ul {
                display: block;
            }
        }
        `;

        this.appendChild(style);

    }
    clear() {
        this.list.replaceChildren();
        this.checkboxes = {};

    }


    toggle_visible() {
        if (this.visible) {
            this.setAttribute('visible', false);
            this.visible = false;
        }
        else {
            this.setAttribute("visible", true);
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
    get_changed_item(event) {
        const list_item = event.target.parentElement;
        const item_name = list_item.getAttribute("item_name");
        const new_value = this.checkboxes[item_name].checked;
        return [item_name, new_value];

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
        list_item.setAttribute("item_name", name);

        this.list.appendChild(list_item);
        this.checkboxes[name] = checkbox;
    }
}
customElements.define('checkbox-list', CheckBoxList);