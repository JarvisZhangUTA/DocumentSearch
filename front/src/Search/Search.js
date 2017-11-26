import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import './Search.css';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: '',
            articles: []
        };

        this.search = this.search.bind(this);
        this.onKeywordChange = this.onKeywordChange.bind(this);
    }

    onKeywordChange(e) {
        this.setState({
            keyword: e.target.value
        });
    }

    search() {
        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/api/articles/query';
       
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'keyword': this.state.keyword
            })
        }).then(response=>{
          if(response.status === 200){
            response.json().then((res)=>{
                this.setState({
                    articles: res.hits.hits
                  });
            });  
          } else {
              // 失败
              toast(response);
          }
        });
    }

    render() {
        const article_list = this.state.articles.map(
            (article, index) => {
                return (
                    <div className="card">
                        <div className="card-content">
                            <div className="card-title">
                                <a href={'/article/' + article._id}>
                                    {article._source.title}
                                </a>
                            </div>
                            {article._source.company}
                        </div>
                        <div className="card-action">
                            {article._source.update_date}
                        </div>
                    </div>
                );
            });
        return (
            <div className="container">
                <br/><br/>
                <div className="row">
                    <div class="input-field col s10">
                        <input id="keyword" type="text" 
                                onChange={this.onKeywordChange}
                                value={this.state.keyword} 
                                className="validate"/>
                        <label for="keyword">Search</label>
                    </div>
                   
                    <a onClick={this.search} className="middle col s2 waves-effect waves-light btn">
                        search
                    </a>
                </div>
                <h5>{this.state.articles.length} Results</h5>

                {article_list}

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
} 

export default Search;