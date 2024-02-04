import { Client } from "pg";

const client = new Client({
  connectionString: "postgresql://postgres:test123@localhost/postgres",
});
client
  .connect()
  .then((res) => console.log("connected"))
  .catch((err) => console.error(err));

async function createTables() {
  await client.query(`
        CREATE TABLE users  (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
     `);
  await client.query(`
            CREATE TABLE addresses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                city VARCHAR(255) NOT NULL,
                country VARCHAR(255) NOT NULL,
                street VARCHAR(255) NOT NULL,
                pincode VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
 `);
  console.log("Table Created successfully:");
}

async function insertUser(username: string, email: string, password: string) {
  try {
    const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1,$2,$3);`;
    const values = [username, email, password];
    const res = await client.query(insertQuery, values);
    console.log("Insertion success:", res);
  } catch (err) {
    console.error(err);
    await client.end();
  }
}

async function insertAddress(
  user_id: Number,
  city: string,
  country: string,
  street: string,
  pincode: string
) {
  try {
    const query = `INSERT INTO addresses (user_id, city, country, street, pincode) VALUES ($1, $2, $3, $4, $5);`;

    const values = [user_id, city, country, street, pincode];
    const res = await client.query(query, values);
    console.log("res");
  } catch (err) {
    console.error(err);
    await client.end();
  }
}

async function queryData(email: string) {
  const query = `SELECT * FROM USERS WHERE EMAIL = $1`;
  const values = [email];
  const res = await client.query(query, values);
  console.log(res?.rows);
}

async function deleteUser(id: number) {
  const query = `DELETE FROM users WHERE id=$1`;
  const values = [id];
  await client.query(query, values);
}

async function queryUserUsingJoins(email: string) {
  const query = `
    SELECT users.id, users.username, users.email, addresses.id, addresses.city, addresses.country, addresses.pincode, addresses.street
    FROM users
    JOIN addresses ON users.id = addresses.user_id
    WHERE users.email = $1
    `;

  const values = [email];
  const res = await client.query(query, values);
  console.log("res:", res.rows);
}

// createTables();
// insertUser("arpesh", "arpesh@gmail.com", "arpesh123");
// insertAddress(4, "new", "some", "NGOOI", "403524");
// queryData("arpesh@gmail.com");
queryUserUsingJoins("arpesh@gmail.com");
// deleteUser(2);
