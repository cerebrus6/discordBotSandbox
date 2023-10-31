const { Pool } = require("pg");
const common = require("./common.js");
var sql, binds, res;

class database_connection {
  constructor() {
    this.connection = new Pool({
      host: "db.kwnjplywneufccyzxocs.supabase.co",
      user: "postgres",
      password: "&AU$mpm_NVrt*h7",
      database: "postgres",
      port: 5432,
    });
  }

  async select(table = null, fields = null, where = [], order = null, limit = null) {
    // Connect to database

      const db = await this.connection.connect();
    // Execute query

    if(fields === '') {
      fields = "*";
    }

    if(where.length === 0) {
      where = '';
    } else {
      where = 'WHERE ' + Object.entries(where)
                        .map(([key, value]) => `${key} '${String(value).replace("'",'')}'`)
                        .join(' AND ');
    }

    sql = `SELECT ${fields}
        FROM ${table} 
        ${where}`;

    if(order) {
      sql += ` ORDER BY ${order}`
    }

    if(limit) {
      sql += ` LIMIT ${limit}`
    }

    // console.log(sql);

    res = await db.query(sql);
    db.release();
      if (limit === 1) {
        return res.rows.length > 0 ? res.rows[0] : [];
      } else {
        return res.rows.length > 0 ? res.rows : [];
      }
    // return res;
  }

  async update(table, where, values) {
    // Connect to database

      const db = await this.connection.connect();
    // Execute query

    if(where.length === 0) {
      where = '';
    } else {
      where = 'WHERE ' + Object.entries(where)
                        .map(([key, value]) => `${key} '${String(value).replace("'",'\'').replace('"','\"')}'`)
                        .join(' AND ');
    }

    if(values.length === 0) {
      return false;
    } else {
      // console.log(values);
      values = 'SET ' + Object.entries(values)
                        .map(([key, value]) => `${key} = '${String(value).replace("'",'\'').replace('"','\"')}'`)
                        .join(', ');
    }

    sql = `UPDATE ${table}
        ${values} 
        ${where}`;

    // console.log(sql);

    res = await db.query(sql);
    db.release();
    if (res.rowCount > 0) {
      // At least one row was updated, so return true
      return true;
    } else {
      // No rows were updated, so return false
      return false;
    }
  }

  async insert(table, values) {
    // Connect to database

      const db = await this.connection.connect();
    // Execute query

    let fields = "";
    if(values.length === 0) {
      return false;
    } else {
      fields = '(' + Object.entries(values)
              .map(([key, value]) => `${key}`)
              .join(', ') + ')';
    }

    if(values.length === 0) {
      return false;
    } else {
      // console.log(values);
      values = 'VALUES (' + Object.entries(values)
                        .map(([key, value]) => `'${String(value).replace("'",'\'').replace('"','\"')}'`)
                        .join(', ') + ')';
    }

    sql = `INSERT INTO ${table}
        ${fields}
        ${values}`;

    console.log(sql);

    res = await db.query(sql);
    db.release();
    if (res.rows.length > 0) {
        // At least one row was inserted, so return the ID
        return res.rows[0];
    } else {
        // No rows were inserted, so return false
        return false;
    }
  }

  async getDetails(table = null, where = null, page = null) {
    let binds = [];
    let sql = `
      SELECT *
      FROM ${table}
      WHERE is_deleted = 0
    `;

    if (where) {
      for (const key in where) {
        sql += `
          AND ${key} = $${binds.length + 1}
        `;
        binds.push(where[key]);
      }
    }

    if (page) {
      page -= 1;
      const offset = page * 10;
      sql += ` LIMIT $${binds.length + 1}, 10`;
      binds.push(offset);
    }

    const db = await this.connection.connect();

    try {
      const result = await db.query(sql, binds);
      db.release();
      return result.rows;
    } catch (error) {
      console.error("Error executing query:", error);
      return false;
    } finally {
      db.release();
    }
  }
}

module.exports = database_connection;
