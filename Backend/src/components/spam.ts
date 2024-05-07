import { joinUrl } from '@/bin/server';
import sqlite3, { Database } from 'sqlite3';
import { codexEmoji, codexUnidiff, codexTrad, codexSpark } from './codex';
import axios, { AxiosError } from 'axios';
import path from 'path';
import os from 'os';
import fs from 'fs';

const dbName = 'spam.db';
const tmpDir = os.tmpdir();
let database: Database;

const initSpam = async (map: any) => {
  let endpoint = map.spam;
  let folder = fs.mkdtempSync(path.join(tmpDir));
  let tgt = path.join(folder, dbName);
  await (async () => {
    try {
      let res = await axios.get(joinUrl(endpoint, 'spam.db'), { responseType: 'arraybuffer' });
      fs.writeFileSync(tgt, res.data);
      console.log('Databse clone to: %s', tgt);
      database = new sqlite3.Database(tgt);
    } catch (e) {
      let { code, config } = e as AxiosError;
      console.log(`Caught unexpected error on requesting ${config?.url}`);
      console.log(code);
      process.exit(1);
    }
  })();
}

async function fetchSpam(type: string, code: string, limit?: number) {
  let orig = await query(type, limit ?? 1);
  switch (code) {
    case 'nmsl': return orig.map(obj => {
      obj.text = codexEmoji(obj.text, false);
      return obj;
    });
    case 'trad': return orig.map(obj => {
      obj.text = codexTrad(obj.text, false);
      return obj;
    });
    case 'sprk': return orig.map(obj => {
      obj.text = codexSpark(obj.text, false);
      return obj;
    });
    case 'unic': return orig.map(obj => {
      obj.text = codexUnidiff(obj.text);
      return obj;
    });
    default: return orig;
  }
}

/**
 * Get spamed
 * @param type allowed: min, max
 * @returns a spam from db
 */
async function query(type: string, limit: number): Promise<Result[]> {
  let sql = `SELECT text FROM ${type} ORDER BY RANDOM() LIMIT ${limit}`;
  return new Promise((res, _) => {
    try {
      database.all(sql, (err, rows) => {
        res(rows as Result[]);
      });
    } catch (e) {
      console.error(e);
      res([new Result('内部错误')]);
    }
  });
}

class Result {
  text!: string
  constructor(text: string) {
    this.text = text;
  }
}

export { initSpam, fetchSpam }
