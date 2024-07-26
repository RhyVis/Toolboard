import mysql from "mysql";
import { env } from "process";

const instr = {
  host: env.SQLHOST,
  port: parseInt(env.SQLPORT || "3306"),
  database: env.SQLNAME,
  user: env.SQLUSER,
  password: env.SQLPASSWD,
};

var db: mysql.Pool;

const initSql = async () => {
  console.log("Connect to MySQL using ->");
  console.log(instr);
  db = mysql.createPool(instr);
};

function textLongStUpdate(s: string): Promise<boolean> {
  const sql = "UPDATE text_long_s SET data = ? WHERE id = 0";
  return new Promise((resolve, reject) => {
    db.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        conn.query(sql, [s], (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("text_long_s data updated");
            resolve(true);
          }
          conn.release();
        });
      }
    });
  });
}

function textLongStSelect(): Promise<string> {
  const sql = "SELECT data FROM text_long_s WHERE id = 0";
  return new Promise((resolve, reject) => {
    db.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        conn.query(sql, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            console.log("text_long_s data fetched");
            resolve(rows[0].data);
          }
          conn.release();
        });
      }
    });
  });
}

export { initSql, textLongStUpdate, textLongStSelect };
