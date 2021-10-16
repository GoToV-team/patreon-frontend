import Component from './basecomponent.js';

/**
 * Компонент лайка
 */

class Like extends Component {
    constructor ({
        user = null,
        liked = false,
        count = 0
    }) {
        super();
        this.attributes.user = user;
        this.attributes.liked = liked;
        this.attributes.count = count;
    }

    render () {
        const element = (
            <div className="like">
                <button className="like-link">
                    <img className="like-image" src="../../imgs/not-liked.png" alt="like" />
                </button>
                <span className="likes-count">{this.attributes.count}</span>
            </div>
        );

        element.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.attributes.liked) {
                document.querySelector('.like-image').setAttribute('src', '../../imgs/liked.png');

                this.attributes.count++;
                this.attributes.liked = true;
            } else {
                document.querySelector('.like-image').setAttribute('src', '../../imgs/not-liked.png');

                this.attributes.count--;
                this.attributes.liked = false;
            }
        });

        return element;
    }
}

export default Like;

const styles = `
.like {
    display: flex;
    align-items: center;
}

.like-link {
    display: flex;
    padding: 0;
    border: none;
    font: inherit;
    color: inherit;
    background-color: transparent;
    cursor: pointer;
}

.likes-count {
    margin-left: 10px;

    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 23px;
}
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.body.appendChild(styleElement);
