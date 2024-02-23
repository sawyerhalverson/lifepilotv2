const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
app.use(express.json());

app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "lifepilot"
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database!');
});



app.get("/", (req, res) => {
    const sql = "Select * from user;";
    db.query(sql, (err,data) => {
        if(err) return app.json("error");
        return res.json(data);
    })
})

app.get("/data", (req, res) => {
    // Get the time interval from the query parameters (default to 24 hours if not provided)
    const timeInterval = req.query.interval || 24;
  
    // Modify the query to filter data based on the provided time interval
    const query = `SELECT activity.*, category.category_name FROM activity 
                   JOIN category ON activity.category_id = category.category_id 
                   WHERE start_time >= NOW() - INTERVAL ${timeInterval} HOUR`;
  
    // Execute the query and send the result
    // Make sure to handle errors and format the result appropriately
    // ...
  
    // Example using MySQL
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(result);
      }
    });
  });
  

  app.get("/grouped_data", (req, res) => {
    // Get the time interval from the query parameters (default to 24 hours if not provided)
    const timeInterval = req.query.interval || 24;
  
    // Modify the query to filter data based on the provided time interval and group by category
    const query = `
      SELECT
        category.category_name,
        SUM(TIMESTAMPDIFF(MINUTE, activity.start_time, activity.end_time)) as total_duration
      FROM
        activity
      JOIN
        category ON activity.category_id = category.category_id 
      WHERE
        start_time >= NOW() - INTERVAL ${timeInterval} HOUR
      GROUP BY
        category.category_name
      ORDER BY
        total_duration DESC
    `;
  
  
    // Execute the query and send the result
    // Make sure to handle errors and format the result appropriately
    // ...

    // Example using MySQL
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(result);
      }
    });
});



// Endpoint to fetch unique predefined activities
app.get('/activities', (req, res) => {
    const sql = "SELECT DISTINCT description FROM activity"; // Replace 'activities' with your actual table name
    db.query(sql, (err, data) => {
        if (err) {
            console.error("MySQL Query Execution Error:", err);
            return res.status(500).json("Internal Server Error");
        }
        const activities = data.map(item => item.description);
        res.json(activities);
    });
});

// Endpoint to fetch unique predefined categories
app.get('/categories', (req, res) => {
    const sql = "SELECT DISTINCT category_name FROM category"; // Replace 'categories' with your actual table name
    db.query(sql, (err, data) => {
        if (err) {
            console.error("MySQL Query Execution Error:", err);
            return res.status(500).json("Internal Server Error");
        }
        const categories = data.map(item => item.category_name);
        res.json(categories);
    });
});


app.get('/most-recent-end-time', (req, res) => {
    const sql = 'SELECT CONVERT_TZ(MAX(end_time), "+00:00", "-07:00") AS mostRecentEndTime FROM activity';
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('MySQL Query Execution Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const mostRecentEndTime = result[0].mostRecentEndTime;
      res.json({ mostRecentEndTime });
    });
  });

app.post('/track', async (req, res) => {
    const { start_time, end_time, description, category } = req.body;

    // Step 1: Check if the category exists
    const checkCategorySql = "SELECT * FROM category WHERE category_name = ?";
    
    db.query(checkCategorySql, [category], async (err, categoryResults) => {
        if (err) {
            console.error("MySQL Query Execution Error:", err);
            return res.status(500).json("Internal Server Error");
        }

        let categoryId;

        if (categoryResults.length === 0) {
            // Step 2: If the category doesn't exist, insert it and get the ID
            const insertCategorySql = "INSERT INTO category (category_name) VALUES (?)";
            const insertCategoryResult = await new Promise((resolve, reject) => {
                db.query(insertCategorySql, [category], (err, data) => {
                    if (err) {
                        console.error("MySQL Query Execution Error:", err);
                        reject("Internal Server Error");
                    }
                    resolve(data);
                });
            });

            categoryId = insertCategoryResult.insertId;
        } else {
            // Step 3: If the category exists, use its ID
            categoryId = categoryResults[0].category_id;
        }

        // Step 4: Insert the activity with the obtained category_id
        const insertActivitySql = "INSERT INTO activity (`start_time`, `end_time`, `description`, `category_id`) VALUES (CONVERT_TZ(?, '+00:00', '-07:00'), CONVERT_TZ(?, '+00:00', '-07:00'), ?, ?)";
        
        db.query(insertActivitySql, [start_time, end_time, description, categoryId], (err, data) => {
            if (err) {
                console.error("MySQL Query Execution Error:", err);
                return res.status(500).json("Internal Server Error");
            }
            return res.json(data);
        });
    });
});




app.listen(8081, () => {
    console.log("listening");
})