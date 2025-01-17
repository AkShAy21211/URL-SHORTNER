import { SECREATS } from "./index.js";
import { createClient } from "redis";
import Redis from "ioredis";


const client = new Redis({
  host: 'redis',  
  port: 6379,      
  password: '',    
  db: 0            
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

export default client;
