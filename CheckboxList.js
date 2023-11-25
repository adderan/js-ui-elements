export class CheckBoxList {
    constructor(root_div, label_text, update_callback) {
        this.root_div = root_div;
        this.root_div.setAttribute('class', 'checkbox-list');
        this.root_div.setAttribute('tabindex', '100');

        this.list = document.createElement('ul');
        this.list.setAttribute('class', 'items');

        this.anchor = document.createElement('span');
        this.anchor.setAttribute('class', 'anchor');
        this.anchor.innerHTML = label_text;

        this.root_div.appendChild(this.anchor);
        this.root_div.appendChild(this.list);

        //this.anchor.addEventListener('click', this);
        document.addEventListener('click', this);
        this.visible = false;

        this.checkboxes = {};
        this.update_callback = update_callback;

    }
    toggle_visible() {
        if (this.visible) {
            this.root_div.classList.remove('visible');
            this.visible = false;
        }
        else {
            this.root_div.classList.add('visible');
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
    handleEvent(evt) {
        if (evt.type == "click") {
            if (evt.target == this.anchor) {
                console.log("anchor clicked");
                this.toggle_visible();
            }
            else if (this.visible && !this.list.contains(evt.target)) {
                //click outside the list, so hide
                this.root_div.classList.remove('visible');
                this.visible = false;
            }
        }
    }
    add_item(name) {
        let list_item = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.onchange = this.update_callback;
        let label = document.createElement('span');
        label.setAttribute('style', 'margin-left:4px');
        label.innerHTML = name;
        list_item.appendChild(checkbox);
        list_item.appendChild(label);

        this.list.appendChild(list_item);
        this.checkboxes[name] = checkbox;
    }
}