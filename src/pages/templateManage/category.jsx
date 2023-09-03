import React, { Component } from 'react';
import { Icon } from 'antd';

class Category extends Component {
  state = {
    _active: '',
  }
  setActive = id => {
    const { _active } = this.state;
    this.setState({ _active: _active === id ? '' : id })
  }
  render() {
    const { data } = this.props;
    const { _active } = this.state;
    return (
      <div style={{ display: 'inline-block' }}>
        <ul style={{verticalAlign: 'top'}}>
          {data.length > 0 && data.map(item => (
            <li style={{ display: 'inline-block', paddingLeft: 10, }} key={item.id}>
              {item.title}<Icon type={item.id === _active ? 'up' : "down"} onClick={() => this.setActive(item.id)} />
              {item.children?.length > 0 && <Category data={item.children} />}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Category;