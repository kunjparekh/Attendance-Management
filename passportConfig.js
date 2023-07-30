//passportconfig
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { Pool, Client } = require("pg");

// import { client } from './server'
// const {client} = require('./server.js');
const connectionString = "postgressql://postgres:admin@localhost:5432/attendance";
const pool = new Pool({
  connectionString: connectionString
});
// console.log(client);
function initialize(passport) {


  // const authenticateUser = async(email, password, done) => {
  //   console.log(email, password);
  //   const client = new Client({
  //     connectionString: connectionString,
  //   });
  //   client.connect();
  //   client.query(
  //     `SELECT * FROM users WHERE email = $1`,
  //     [email],
  //     (err, results) => {
  //       if (err) {
  //         throw err;
  //       }
  //       console.log("returned from user",results.rows);

  //       if (results.rows.length > 0) {
  //         const user = results.rows[0];
  //         bcrypt.compare(password, user.password).then((match) => {
  //           if (match) {
  //             // Passwords match, user is authenticated
  //             done(null,user,{message: 'Authentication successful' });
  //           } else {
  //             // Passwords do not match, user authentication failed
  //             done(null,false,{message: 'Password or user name is incorrect' });
  //           }
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //           throw new Error('Error authenticating user');
  //         });
      
  //       } 
  //       else{
  //         console.log("else");
  //         client.query(
  //         `SELECT * FROM faculty WHERE email = $1`,
  //         [email],
  //         (err, results) => {
  //           if (err) {
  //             throw err;
  //           }
  //           console.log(results.rows);
    
  //           if (results.rows.length > 0) {
  //             const user = results.rows[0];
  //             bcrypt.compare(password, user.password).then((match) => {
  //               if (match) {
  //                 // Passwords match, user is authenticated
  //                 done(null,user,{message: 'Authentication successful' });
  //               } else {
  //                 // Passwords do not match, user authentication failed
  //                 done(null,false,{message: 'Password or user name is incorrect' });
  //               }
  //             })
  //             .catch((error) => {
  //               console.error(error);
  //               throw new Error('Error authenticating user');
  //             });
  //           } else {
              
  //             // No user
  //             return done(null, false, {
  //               message: "No user with that email address in login 2",
  //             }); 
  //           }
  //         }
  //         );
  //       }
  //     }
  //   );
  // };
  const authenticateUser1 = (email, password, done) => {
    console.log(email, password);
    const client = new Client({
      connectionString: connectionString,
    });
    client.connect();
    client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        //console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];
          bcrypt.compare(password, user.password).then((match) => {
                          if (match) {
                            // Passwords match, user is authenticated
                            done(null,user,{message: 'Authentication successful' });
                          } else {
                            // Passwords do not match, user authentication failed
                            done(null,false,{message: 'Password or user name is incorrect' });
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                          throw new Error('Error authenticating user');
                        });
                      } else {
                        
                        // No user
                        return done(null, false, {
                          message: "No user with that email address in login 1",
                        }); 
                      }
      }
    );
  };
  const authenticateUser2 = (email, password, done) => {
    console.log(email, password);
    const client = new Client({
      connectionString: connectionString,
    });
    client.connect();
    client.query(
      `SELECT * FROM faculty WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        //console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];
          bcrypt.compare(password, user.password).then((match) => {
                          if (match) {
                            // Passwords match, user is authenticated
                            done(null,user,{message: 'Authentication successful' });
                          } else {
                            // Passwords do not match, user authentication failed
                            done(null,false,{message: 'Password or user name is incorrect' });
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                          throw new Error('Error authenticating user');
                        });
                      } else {
                        
                        // No user
                        return done(null, false, {
                          message: "No user with that email address in login 2",
                        }); 
                      }
      }
    );
  };
//   passport.use("login1", new LocalStrategy({
//     usernameField: "email", // Replace with your field name for email
//     passwordField: "password", // Replace with your field name for password
//   }, (email, password, done) => {
//     authenticateUser(email, password, (err, user) => {
//       console.log(email, password);
//       const client = new Client({
//         connectionString: connectionString,
//       });
//       client.connect();
//       client.query(
//         `SELECT * FROM users WHERE email = $1`,
//         [email],
//         (err, results) => {
//           if (err) {
//             throw err;
//           }
//           console.log("returned from user",results.rows);
  
//           if (results.rows.length > 0) {
//             const user = results.rows[0];
//             bcrypt.compare(password, user.password).then((match) => {
//               if (match) {
//                 // Passwords match, user is authenticated
//                 done(null,user,{message: 'Authentication successful' });
//               } else {
//                 // Passwords do not match, user authentication failed
//                 done(null,false,{message: 'Password or user name is incorrect' });
//               }
//             })
//             .catch((error) => {
//               console.error(error);
//               throw new Error('Error authenticating user');
//             });
//           }
//           else {
              
//             // No user
//             return done(null, false, {
//               message: "No user with that email address in login 1",
//             }); 
//           }
//         }
//     );
//   });
// }));
// passport.use("login2", new LocalStrategy({
//   usernameField: "email", // Replace with your field name for email
//   passwordField: "password", // Replace with your field name for password
// }, (email, password, done) => {
//   authenticateUser(email, password, (err, user) => {
//     console.log("else");
//           client.query(
//           `SELECT * FROM faculty WHERE email = $1`,
//           [email],
//           (err, results) => {
//             if (err) {
//               throw err;
//             }
//             console.log(results.rows);
    
//             if (results.rows.length > 0) {
//               const user = results.rows[0];
//               bcrypt.compare(password, user.password).then((match) => {
//                 if (match) {
//                   // Passwords match, user is authenticated
//                   done(null,user,{message: 'Authentication successful' });
//                 } else {
//                   // Passwords do not match, user authentication failed
//                   done(null,false,{message: 'Password or user name is incorrect' });
//                 }
//               })
//               .catch((error) => {
//                 console.error(error);
//                 throw new Error('Error authenticating user');
//               });
//             } else {
              
//               // No user
//               return done(null, false, {
//                 message: "No user with that email address in login 2",
//               }); 
//             }
//       }
//   );
// });
// }));

passport.use(
  "login1",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    authenticateUser1
  )
);

  passport.use(
    "login2",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser2
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        return done(err);
      }
      if (results.rows.length > 0) {
        return done(null, results.rows[0]);
      } 
      else{
        pool.query(`SELECT * FROM faculty WHERE id = $1`, [id], (err, results) => {
          if (err) {
            return done(err);
          }
          if (results.rows.length > 0) {
            return done(null, results.rows[0]);
          } else {
            return done(new Error("User not found"));
          }
        });
      }
    });
  });
}

module.exports = initialize;


