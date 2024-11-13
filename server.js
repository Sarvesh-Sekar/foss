const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true, // GraphiQL UI for testing
}));

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
