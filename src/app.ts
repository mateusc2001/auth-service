import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import route from './routes';
import bodyParser from 'body-parser';

class App {
    public express: express.Application;

    constructor() {

        this.express = express();
        this.express.use(express.json({ limit: '50mb' }));
        this.express.use(express.urlencoded({ limit: '50mb' }));
        this.express.use(bodyParser({limit: '150mb'}));
        this.middlewares();
        this.database();
        this.routes();
    }

    private middlewares(): void {
        this.express.use(express.json());
        this.express.use(cors());
    }

    private database() {
        const uri = 'mongodb://mateus:123@clusterhotel-shard-00-00-rc4kb.mongodb.net:27017,clusterhotel-shard-00-01-rc4kb.mongodb.net:27017,clusterhotel-shard-00-02-rc4kb.mongodb.net:27017/barbershop_tst?ssl=true&replicaSet=ClusterHotel-shard-0&authSource=admin&retryWrites=true&w=majority'
        // mongoose.connect(uri, { 
        //     useUnifiedTopology: true,
        //     useNewUrlParser: true,
        //     useCreateIndex: true
        // });
    }

    private routes(): void {
        this.express.use(route);
    }
}

export default new App().express