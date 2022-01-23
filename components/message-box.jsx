import React from 'react';

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
    }
    show(message) {
        this.msgBox.innerText = message;
        this.msgBox.classList.add("show");
        setTimeout(() =>{
            this.msgBox.classList.remove("show");
        }, this.props.duration);
    }
    render() {
        return (
            <div className={'message__box message__box-' + this.props.type} ref={(c) => { this.msgBox = c; }}></div>
        )
    }
}
MessageBox.defaultProps = {
    type: 'success',
    duration: 2000
}
export default MessageBox;