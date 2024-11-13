const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

// Helper functions to read/write data
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

// Task Type
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const tasks = readData();
        return tasks.find(task => task.id === args.id);
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        return readData();
      },
    },
  },
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const tasks = readData();
        const newTask = {
          id: String(tasks.length + 1),
          title: args.title,
          description: args.description,
          status: 'Pending',
        };
        tasks.push(newTask);
        writeData(tasks);
        return newTask;
      },
    },
    updateTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
      },
      resolve(parent, args) {
        const tasks = readData();
        const task = tasks.find(t => t.id === args.id);
        if (!task) throw new Error('Task not found');

        task.title = args.title || task.title;
        task.description = args.description || task.description;
        task.status = args.status || task.status;

        writeData(tasks);
        return task;
      },
    },
    deleteTask: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        let tasks = readData();
        const task = tasks.find(t => t.id === args.id);
        if (!task) throw new Error('Task not found');

        tasks = tasks.filter(t => t.id !== args.id);
        writeData(tasks);
        return task;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
