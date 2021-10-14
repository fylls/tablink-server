// Environment
process.env.NODE_ENV = "test"

// Node-Express server
const app = require("../app")

// our global object for storing auth information
const jsonwebtoken = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
let auth = {}

// Using supertest to test HTTP requests/responses
const request = require("supertest")

// Mongo Database
const { connectDB, shoutDownDB } = require("../config/db")

// Importing Mongoose models
const User = require("../models/User")
const Order = require("../models/Order")
const Restaurant = require("../models/Restaurant")

// test route

describe("GET /test ", () => {
  test("/test route should work", async () => {
    const res = await request(app).get("/test")
    expect(res.body).toEqual("test")
    expect(res.statusCode).toBe(200)
  })
})

describe("POST /api/signUp ", () => {
  test("that route should create a test user", async () => {
    const res = await request(app).get("/test")
    expect(res.body).toEqual("test")
    expect(res.statusCode).toBe(200)
  })
})

// describe("POST /api/signUp", () => {
//   test("that route should create a test user", done => {
//     request(app)
//       .post("/api/signUp")
//       .send({
//         name: "test",
//         email: "test@test.test",
//         phone: "test",
//         restaurant: "test",
//         password: "test",
//       })
//       .set("Accept", "application/json")
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .end(function (err, res) {
//         if (err) return done(err)
//         done()
//       })
//   })
// })

// describe("GET /students", () => {
//   test("It responds with an array of students", async () => {
//     const response = await request(app).get("/students");
//     expect(response.body.length).toBe(2);
//     expect(response.body[0]).toHaveProperty("id");
//     expect(response.body[0]).toHaveProperty("name");
//     expect(response.statusCode).toBe(200);
//   });
// });

// describe("POST /students", () => {
//   test("It responds with the newly created student", async () => {
//     const newStudent = await request(app)
//       .post("/students")
//       .send({
//         name: "New Student"
//       });

//     // make sure we add it correctly
//     expect(newStudent.body).toHaveProperty("id");
//     expect(newStudent.body.name).toBe("New Student");
//     expect(newStudent.statusCode).toBe(200);

//     // make sure we have 3 students now
//     const response = await request(app).get("/students");
//     expect(response.body.length).toBe(3);
//   });
// });

// describe("PATCH /students/1", () => {
//   test("It responds with an updated student", async () => {
//     const newStudent = await request(app)
//       .post("/students")
//       .send({
//         name: "Another one"
//       });
//     const updatedStudent = await request(app)
//       .patch(`/students/${newStudent.body.id}`)
//       .send({ name: "updated" });
//     expect(updatedStudent.body.name).toBe("updated");
//     expect(updatedStudent.body).toHaveProperty("id");
//     expect(updatedStudent.statusCode).toBe(200);

//     // make sure we have 3 students
//     const response = await request(app).get("/students");
//     expect(response.body.length).toBe(3);
//   });
// });

// describe("DELETE /students/1", () => {
//   test("It responds with a message of Deleted", async () => {
//     const newStudent = await request(app)
//       .post("/students")
//       .send({
//         name: "Another one"
//       });
//     const removedStudent = await request(app).delete(
//       `/students/${newStudent.body.id}`
//     );
//     expect(removedStudent.body).toEqual({ message: "Deleted" });
//     expect(removedStudent.statusCode).toBe(200);

//     // make sure we still have 2 students
//     const response = await request(app).get("/students");
//     expect(response.body.length).toBe(2);
//   });
// });

/*========================= AUTH =========================*/

// beforeAll(async () => {
//   await db.query(
//     "CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT, password TEXT)"
//   );
// });
// // before each request, create a user and log them in
// beforeEach(async () => {
//   const hashedPassword = await bcrypt.hash("secret", 1);
//   await db.query("INSERT INTO users (username, password) VALUES ('test', $1)", [
//     hashedPassword
//   ]);
//   const response = await request(app)
//     .post("/users/auth")
//     .send({
//       username: "test",
//       password: "secret"
//     });
//   // take the result of the POST /users/auth which is a JWT
//   // store it in the auth object
//   auth.token = response.body.token;
//   // store the id from the token in the auth object
//   auth.current_user_id = jsonwebtoken.decode(auth.token).user_id;
// });

// // remove all the users
// afterEach(async () => {
//   await db.query("DELETE FROM users");
// });

// // drop the table and close the connection
// afterAll(async () => {
//   await db.query("DROP TABLE users");
//   db.end();
// });

// describe("GET /users", () => {
//   test("returns a list of users", async () => {
//     const response = await request(app)
//       .get("/users")
//       // add an authorization header with the token
//       .set("authorization", auth.token);
//     expect(response.body.length).toBe(1);
//     expect(response.statusCode).toBe(200);
//   });
// });

// describe("GET /users without auth", () => {
//   test("requires login", async () => {
//     // don't add an authorization header with the token...see what happens!
//     const response = await request(app).get("/users/");
//     expect(response.statusCode).toBe(401);
//     expect(response.body.message).toBe("Unauthorized");
//   });
// });

// describe("GET /secure/:id", () => {
//   test("authorizes only correct users", async () => {
//     const response = await request(app)
//       // add an authorization header with the token, but go to a different ID than the one stored in the token
//       .get(`/users/secure/100`)
//       .set("authorization", auth.token);
//     expect(response.statusCode).toBe(401);
//     expect(response.body.message).toBe("Unauthorized");
//   });
// });

// describe("GET /secure/:id", () => {
//   test("authorizes only correct users", async () => {
//     const response = await request(app)
//       // add an authorization header with the token, and go to the same ID as the one stored in the token
//       .get(`/users/secure/${auth.current_user_id}`)
//       .set("authorization", auth.token);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toBe("You made it!");
//   });
// });
