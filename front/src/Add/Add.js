import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import { parse } from 'fast-html-parser';
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      company: '',
      res: '',
      tables: []
    }

    this.upload = this.upload.bind(this);

    this.getTags = this.getTags.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onCompanyChange = this.onCompanyChange.bind(this);
    this.onResChange = this.onResChange.bind(this);
    this.generate = this.generate.bind(this);

    this.removeTable = this.removeTable.bind(this);

    this.toHTML = this.toHTML.bind(this);
    this.innerHTML = this.innerHTML.bind(this);
  }

  upload() {
    const url = 'http://' + window.location.hostname + ':' + window.location.port + '/api/articles';
    console.log(url);
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'title': this.state.title,
          'company': this.state.company,
          'body': this.state.res,
          'tables': this.state.tables
        })
    }).then(response=>{
      if(response.status === 200){
          toast('success');
      } else {
          // 失败
          response.json().then((res)=>{
              toast(res);
          });
      }
    });
  }

  onCompanyChange(e) {
    this.setState({
      company: e.target.value
    });
  }

  onTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  onResChange(e) {
    this.setState({
      res: e.target.value
    });
    this.generate(e.target.value);
  }
  
  generate(document) {
    let root = parse(document);
    let res = root.querySelectorAll('table');
    let tables = [];

    for(let i = 0; i < res.length; i++) {
      let table = {
        body: this.toHTML(res[i]),
        tags: this.getTags(res[i])
      };
      tables.push(table);
    }

    this.setState({tables});
  }

  getTags(table) {
    let regex = /^[$()0-9,.]*$/;
    let tags = '';

    let trs = table.querySelectorAll('tr');
    trs.forEach((tr) => {
      let tds = tr.querySelectorAll('td');
      tds.push(tr.querySelectorAll('th'));
      tds.forEach((td) => {
        let text = td.text;
        if(text && text.length > 4 && !regex.test(text))
          tags += text + ' ';
      }, this);
    });

    return JSON.stringify(tags);
  }

  removeTable(e) {
    const index = e.target.getAttribute('index');
    const tables = this.state.tables;
    if (index > -1) {
      tables.splice(index, 1);
    }
    this.setState({tables});
  }

  render() {
    const table_list = this.state.tables.map(
        (table, index) => {
            return (
                <div key={index}>
                  <h5>
                    {index}&nbsp;&nbsp;
                    <a className="waves-effect waves-teal btn-flat" 
                      index={index} onClick={this.removeTable}>
                      Remove
                    </a>
                  </h5>
                  <div className="orange text-white">
                    {table.tags}
                  </div>
                  <div dangerouslySetInnerHTML={{__html: table.body}}></div>
                  <hr/>
                </div>
            );
        }
    );

    return (
      <div>
        <br/><br/>
        <div className="row">
          <div className="col s6">
            <div className="input-field">
              <input id="title" type="text" className="validate" 
                value={this.state.title}
                onChange={this.onTitleChange}/>
              <label for="title">Title</label>
            </div>
            <div className="input-field">
              <input id="company" type="text" className="validate" 
                value={this.state.company}
                onChange={this.onCompanyChange}/>
              <label for="company">Company</label>
            </div>
            <h4>Document:</h4>
            <textarea value={this.state.res} onChange={this.onResChange} className="materialize-textarea">
            </textarea>
          </div>
          <div className="col s6">
            <a class="waves-effect waves-light btn" onClick={this.upload}>
              upload
            </a>
            <h4>Tables:</h4>
            {table_list}
          </div>
        </div>

        <ToastContainer 
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
      </div>
    );
  }

  toHTML(node) {
    const tag = node.tagName;
    if (tag) {
        const is_un_closed = /^meta$/i.test(tag);
        const is_self_closed = /^(img|br|hr|area|base|input|doctype|link)$/i.test(tag);
        const attrs = node.rawAttrs ? ' ' + node.rawAttrs : '';
        if (is_un_closed) {
            return `<${tag}${attrs}>`;
        }
        else if (is_self_closed) {
            return `<${tag}${attrs} />`;
        }
        else {
            return `<${tag}${attrs}>${this.innerHTML(node)}</${tag}>`;
        }
    }
    else {
        return this.innerHTML(node);
    }
  }

  innerHTML(node) {
      if(node.childNodes)
        return node.childNodes.map((child) => {
            return this.toHTML(child);
        }).join('');
      else
        return node.text;
  }
}

export default Add;