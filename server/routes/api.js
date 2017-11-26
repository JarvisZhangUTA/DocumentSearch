var express = require('express');
var router = express.Router();

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200', //服务 IP 和端口
    log: 'trace' //输出详细的调试信息
});


router.post('/articles', function(req, res, next) {
    client.index({
        index : 'doc',
        type : 'article',
        body : {
            title : req.body.title,
            company : req.body.company,
            body : req.body.body,
            update_date : new Date()
        }
    }).then((data) => {
        const tables = req.body.tables;

        for(let i = 0; i < tables.length; i++) {
            client.index({
                index : 'doc',
                type : 'table',
                body : {
                    article_id: data._id,
                    title : req.body.title,
                    tags : tables[i].tags,
                    body : tables[i].body,
                    update_date : new Date()
                }
            })
        }

        res.json(data._id);
    });
});

router.get('/articles/:id', function(req, res, next) {
    const id = req.params.id;
    client.search({
        index : 'doc',
        type : 'article',
        q: '_id:' + id
    }).then((data) => {
        res.json(data);
    });
});

router.post('/articles/query', function(req, res, next) {
    const keyword = req.body.keyword;

    client.search({
        index : 'doc',
        type : 'article',
        _source: ['title', 'company', 'update_date'],
        q: 'body:' + keyword
    }).then((data) => {
        res.json(data);
    });
});

router.post('/tables/query', function(req, res, next) {
    const keyword = req.body.keyword;

    client.search({
        index : 'doc',
        type : 'table',
        q: 'tags:' + keyword
    }).then((data) => {
        res.json(data);
    });
});

module.exports = router;

// client.indices.create({index : 'doc'});
// client.indices.putMapping({
//     index : 'doc',
//     type : 'article',
//     body : {
//         article: {
//             properties: {
//                 title: {
//                     type: 'string',
//                     term_vector: 'with_positions_offsets'
//                 },
//                 company: {
//                     type: 'string',
//                 },
//                 body: {
//                     type: 'string',
//                     term_vector: 'with_positions_offsets'
//                 },
//                 update_date: {
//                     type : 'date',
//                     index : 'not_analyzed',
//                 }
//             }
//         }
//     }
// });

// client.indices.putMapping({
//     index : 'doc',
//     type : 'table',
//     body : {
//         table: {
//             properties: {
//                 article_id: {
//                     type: 'string',
//                 },
//                 title: {
//                     type: 'string',
//                     term_vector: 'with_positions_offsets'
//                 },
//                 tags: {
//                     type: 'string',
//                     index : 'not_analyzed',
//                 },
//                 body: {
//                     type: 'string',
//                     term_vector: 'with_positions_offsets'
//                 },
//                 update_date: {
//                     type : 'date',
//                     index : 'not_analyzed',
//                 }
//             }
//         }
//     }
// });