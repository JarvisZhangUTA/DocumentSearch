import React from 'react';
import $ from "jquery";

import './Article.css';

class Article extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            article: '',
            table: '',
            keyword: '',
            tables: []
        };

        this.loadArticle();
    }

    componentDidMount() {
        $('.modal').modal();
    }

    componentDidUpdate() {
        $("table").css("position","relative");;

        $("table").hover((e) => {
            if($('#extract').length === 0){
                let parent = e.target;
                while(parent.tagName !== 'TABLE'){
                    parent = parent.parentElement;
                }

                
                let test = parent;
                while(test.tagName !== 'BODY'){
                    if(test.id === 'modal-content'){
                        return;
                    }
                    test = test.parentElement;
                }

                this.handleKeyword(parent);
                this.handleTable(parent.outerHTML);

                $(e.target).append(
                    "<a id='extract' class='waves-effect waves-teal btn attached'>Extract</a>"
                );

                $("#extract").on("click", (e) => {
                    $('#modal').modal('open');
                });
            }
        }, (e) => {
            $("#extract").remove();
            $("#extract").unbind( "click" );
        });
    }

    handleKeyword(parent) {
        this.setState({
            keyword: parent.textContent
        });

        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/api/tables/query';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'keyword': this.state.keyword
            })
        })
        .then((res) => res.json())
        .then((data) => {
           this.setState({
            tables: data.hits.hits
           });
        });
    }

    handleTable(table) {
        this.setState({
            table: table
        });
    }

    loadArticle() {
        const arr = window.location.href.split('/');
        const id = arr[arr.length - 1];
        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/api/articles/' + id;
        const request = new Request(url, {method: 'GET'});

        fetch(request)
            .then((res) => res.json())
            .then((data) => {
                let body =  data.hits.hits[0]._source.body;
                this.setState({
                    article: body
                });
            });
    }

    render() {
        const tables_list = this.state.tables.map(
            (table, index) => {
                return (
                    <div key={index}>
                      <h5>
                        {index}&nbsp;&nbsp;
                        {table._source.title}
                      </h5>
                      <div dangerouslySetInnerHTML={{__html: table._source.body}}></div>
                      <hr/>
                    </div>
                );
            } 
        );

        return (
            <div className="article">
                <div dangerouslySetInnerHTML={{ __html: this.state.article }}/>

                <div id="modal" className="modal">
                    <div id="modal-content" className="modal-content">
                        <div dangerouslySetInnerHTML={{ __html: this.state.table }}/>
                        <hr/>
                        {tables_list}
                    </div>
                </div>
            </div>
        );
    }
}

export default Article;