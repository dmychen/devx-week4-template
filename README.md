# Workshop 4 (Week 7)

## Getting Started

Code and resources for Worshop 4 (Week 7). We'll be starting from where we left off with Week 3's code, and integrating a MongoDB database.

This github repo is the COMPLETED code for today. You can find a template with the code we're starting with today at [devx-week4-template](...).

```bash
# Just use last week's code, or restart with a template through these commands
git clone https://github.com/dmychen/devx-week4-template.git
cd devx-week4-template
npm install
```

## Resources

- [Today's Slides]()
- [Today's Code Template]()
- [Week 1 Github](https://github.com/cruizeship/devx-week1)
- [Week 2 Github](https://github.com/dmychen/devx-week2)
- [Week 3 Github](https://github.com/cruizeship/devx-week2)

- [How HTTP Requests Work](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [Relational Vs. Non-Relational Databases](https://insightsoftware.com/blog/whats-the-difference-relational-vs-non-relational-databases/)
- [Using MongoDB](https://www.mongodb.com/docs/manual/faq/fundamentals/)


## Code

> Last week we created a simple backend using express. Now we'll integrate a mongodb database.

### Setup the Database

1. Create a [MongoDB](https://www.mongodb.com/) account.
2. Create a new project.
3. Make sure your current IP address is added (Otherwise any requests to the database won't go through).
4. Find the URI (connection string) for your project.

### Connecting to the Database

We first need to install mongodb through node.

```bash
npm install mongodb
```

Then, we import the mongodb module.

```js
// at the top of `index.js`
const { MongoClient, ServerApiVersion } = require('mongodb');
```

MongoClient allows us to create a client object, which is how we make connections to our database. We also need our connection string (URI), which identifies the database we're connecting to.

```js
// in `index.js`
const uri = "mongodb+srv://daniel:devx-week4@cluster-test.xzfom.mongodb.net/?retryWrites=true&w=majority&appName=cluster-test";
const DB_NAME = "daniel";

// a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});
```

Now we need to connect to the database. We create a function `connectToDatabase` which will establish the connection and deal with any errors.

```js
async function connectToDatabase() {
    try {
        await client.connect(); // connect to db
        await client.db(DB_NAME).command({ ping: 1 });
        console.log("Successfully connected To MongoDB");
    } catch (error) {
        console.error("Database connection failed.");
        process.exit(1);
    }
}
connectToDatabase();
```

### Making Routes

For the database to be functional, we want to create routes in our backend we can call, which will access and manipulate the database. Let's start with a route that will add a new `user` document to a `users` collection.

We can divide this into two steps:
1) Create a route endpoint that receives any requests to create a new user, and extract the user information from that request.
2) Insert a new user document into our database with the user data.


First we define a function to insert new users.

```js
// inserts `newUser` as a new document in a "users" collection. We assume newUsers will be a JS object that contains the fields 
async function insertUserService (newUser) {
    try {
        const usersCollection = client.db(DB_NAME).collection("users");
        const result = await usersCollection.insertOne(newUser);

        return await usersCollection.findOne({ _id: result.insertedId });
    } catch (error) {
        console.error("Error inserting user into the database:", error);
        throw error;
    }
};
```

Then we create a route endpoint which takes the request body and uses the function we defined to insert the new user.

```js
// A new route endpoint
route.post('/users', async (req, res) => {
    try {
        const newUser = req.body;
        if (!newUser || Object.keys(newUser).length === 0) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        const createdUser = await insertUserService(newUser);
        console.log("Inserted new user:", createdUser);
        res.status(201).json(createdUser);
    } catch (error) {
        console.error("Failed to create a new user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
```

