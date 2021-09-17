import Component from './basecomponent.js'

class Button extends Component {
    constructor ({
        text = '',
        color = 'default',
        rounded = false
    }) {
        super()
        this.attributes.text = text
        this.attributes.color = color
        this.attributes.rounded = rounded
    }

    render () {
        const element = document.createElement('button')
        element.innerText = this.attributes.text

        element.className = `btn btn-${this.attributes.color} ${this.attributes.rounded ? 'btn-rounded' : ''}`
        return element
    }
}
export default Button

const styles = `
.btn {
    display:block;
    width:100%;
    background:#fff;
    border: 1px solid #DCDFE6;
    box-shadow: 0px 1px 4px 0px #0000000D;
    font-size:12px;
    padding: 8px;
    border-radius:5px;
    cursor:pointer;
    transition: background-color 0.1s;
}
.btn-rounded {
    border-radius:40px;
}
.btn-primary{
    background: var(--color-primary);
    color:#fff;
}
.btn-primary:hover{
    background: var(--color-primary-light);
}
.btn-primary:active{
    background: var(--color-primary-dark);
}

.btn-success{
    background: var(--color-success);
    color:#fff;
}
.btn-success:hover{
    background: var(--color-success-light);
}
.btn-success:active{
    background: var(--color-success-dark);
}


.btn-grey{
    background: var(--color-grey);
    color:#fff;
}
.btn-grey:hover{
    background: var(--color-grey-light);
}
.btn-grey:active{
    background: var(--color-grey-dark);
}

.btn-warning{
    background: var(--color-warning);
    color:#fff;
}
.btn-warning:hover{
    background: var(--color-warning-light);
}
.btn-warning:active{
    background: var(--color-warning-dark);
}

.btn-accent{
    background: var(--color-accent);
    color:#fff;
}
.btn-accent:hover{
    background: var(--color-accent-light);
}
.btn-accent:active{
    background: var(--color-accent-dark);
}





`
const styleElement = document.createElement('style')
styleElement.innerHTML = styles
document.body.appendChild(styleElement)
