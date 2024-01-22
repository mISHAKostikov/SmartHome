import {Component} from '../Component.js';


export class Screen extends Component {
    get visibility() {
        return this._visibli;
    }

    set visibility(value) {
        this._visibli = !!value;

        this.attribute__set('_visibli', this._visibli);
    }


    static _url = import.meta.url;

    static html = false;

    _visibli = false;


    async _build() {
        await super._build();

        Array.from(this.children).forEach((item) => this._shadow.append(item));
    }
}




Screen.init();
