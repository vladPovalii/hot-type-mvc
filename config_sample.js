var config = {
    development: {
        //url to be used in link generation
        url: 'http://my.site.com',
        //mongodb connection settings
        database: {
            host:   'localhost',
            port:   '27017',
            db:     'test'
        },
        //server details
        server: {
            host: '127.0.0.1',
            port: '3000'
        }
    },
    production: {
        //url to be used in link generation
        url: 'http://my.site.com',
        //mongodb connection settings
        database: {
            host: 'localhost',
            port: '27017',
            db:   'test'
        },
        //server details
        server: {
            host:   '127.0.0.1',
            port:   '3000'
        }
    }
};
module.exports = config;