import React from 'react';

class Nav extends React.Component {
    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a className="brand-logo" href="/"> 
                        &nbsp;&nbsp;DocumentSearch 
                    </a>
                    {this.customerContent()}
                </div>
            </nav>
        );
    }

    customerContent() {
        return (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                    <a href="/add">Add</a>
                </li>
            </ul>
        );
    }
}

export default Nav;