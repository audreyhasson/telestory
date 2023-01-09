import {useSession } from 'next-auth/react';
import {MongoClient, ObjectId} from 'mongodb';
import moment from 'moment';
import {connectToDatabase} from '../lib/db';

const dataUrl = process.env.API_URL;
const dataKey = process.env.API_KEY;

export async function getUser(id) {
    const response = await fetch(`${dataUrl}/action/findOne`, {
      method: 'POST',
      headers: {
        'Access-Control-Request-Headers': '*',
        'api-key': dataKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "dataSource": "Cluster0",
        "database": "starterData",
        "collection": "users",
        "filter": { 
          "_id": {"$oid": id},
        },
        projection: {
            passHash: 0,
        }
      })
    });
    return await response.json()
  }

export async function getWords() {
  const response = await fetch(`${dataUrl}/action/findOne`, {
    method: 'POST',
    headers: {
      'Access-Control-Request-Headers': '*',
      'api-key': dataKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "dataSource": "Cluster0",
      "database": "starterData",
      "collection": "dailyWords",
      "filter": {
        "_id": {"$oid": "63b70d557a635ce0a627113f"},
      }
    })
  });
  return await response.json()
}

export async function getPost(id: string) {
  const response = await fetch(`${dataUrl}/action/findOne`, {
    method: 'POST',
    headers: {
      'Access-Control-Request-Headers': '*',
      'api-key': dataKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "dataSource": "Cluster0",
      "database": "starterData",
      "collection": "posts",
      "filter": {
        "_id": {"$oid": id},
      }
    })
  });
  return await response.json()
}

export async function getWorldsPosts() {
  const start = moment().startOf('day');
  const response = await fetch(`${dataUrl}/action/find`, {
    method: 'POST',
    headers: {
      'Access-Control-Request-Headers': '*',
      'api-key': dataKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "dataSource": "Cluster0",
      "database": "starterData",
      "collection": "posts",
      "filter": {
        "date":{
          "$gte": {"$date":start},
        },
        "public": true,
        "postSucess": true,
      },
    })
  })
  return await response.json();
}

export async function updateSettings(id) {
  const response = await fetch(`${dataUrl}/action/update`, {
    method: 'POST',
    headers: {
      'Access-Control-Request-Headers': '*',
      'api-key': dataKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "dataSource": "Cluster0",
      "database": "starterData",
      "collection": "users",
      "filter": {
        "_id": {"$oid": id},
      },
    })
  })
  return await response.json();
}