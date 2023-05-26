const { v4: uuidv4 } = require("uuid");
const { dynamodb } = require("../config/dynamodb");

class Post {
  constructor(title, content = false, id = uuidv4(), userId) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
  }

  async save() {
    const params = {
      TableName: "post",
      Item: {
        id: { S: this.id },
        title: { S: this.title },
        content: { S: this.content },
        userId: { S: this.userId },
      },
    };
    console.log(params);
    await dynamodb.putItem(params).promise();
    return this;
  }

  static async fetchAll() {
    const params = {
      TableName: "post",
    };
    const result = await dynamodb.scan(params).promise();
    const posts = result.Items.map((item) => {
      const {
        id: { S: id } = { S: "" },
        title: { S: title } = { S: "" },
        content: { S: content } = { S: "" },
        userId: { S: userId } = { S: "" },
      } = item;

      return new Post(title, content, id, userId);
    });
    return posts;
  }

  static async fetchById(id) {
    const params = {
      TableName: "post",
      Key: {
        id: { S: id },
      },
    };
    const result = await dynamodb.getItem(params).promise();
    if (!result.Item) {
      return null;
    }
    const {
      title: { S: title },
      content: { S: content },
      userId: { S: userId },
    } = result.Item;
    return new Post(title, content, id, userId);
  }
  static async fetchByUserId(userId) {
    const params = {
      TableName: "post"
    };
    const result = await dynamodb.scan(params).promise();
    const tasks = result.Items.filter((item) => 
      item.userId?.S == userId
    ).map((item) => {
      const {
        id: { S: id } = { S: "" },
        title: { S: title } = { S: "" },
        content: { S: content } = { S: "" },
        userId: { S: userId } = { S: "" },
      } = item;
      return new Post(title, content, id, userId);
    });
    return tasks;
  }
  async delete() {
    const params = {
      TableName: "post",
      Key: {
        id: { S: this.id },
      },
    };
    await dynamodb.deleteItem(params).promise();
  }
}

module.exports = Post;
