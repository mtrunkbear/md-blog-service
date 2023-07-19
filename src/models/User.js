const { v4: uuidv4 } = require("uuid");
const { dynamodb } = require("../config/dynamodb");

class User {
  constructor({
    firstName,
    id = uuidv4(),
    nickName,
    lastName,
    occupation,
    description,
    avatarUrl,
    email,
  }) {
    this.id = id;
    this.nickName = nickName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.occupation = occupation;
    this.description = description;
    this.avatarUrl = avatarUrl;
    this.email = email;
  }

  async save() {
    const params = {
      TableName: "user",
      Item: {
        id: { S: this.id },
        nickName: { S: this.nickName },
        email: { S: this.email },
        firstName: ({ S: this.firstName } = { S: "" }),
        lastMame: ({ S: this.lastName } = { S: "" }),
        occupation: ({ S: this.occupation } = { S: "" }),
        description: ({ S: this.description } = { S: "" }),
        avatarUrl: ({ S: this.avatarUrl } = { S: "" }),
      },
      ConditionExpression:
        "attribute_exists(nickName) OR attribute_exists(email)",
    };

    try {
      await dynamodb.putItem(params).promise();
      return this;
    } catch (error) {
      console.error("Error in save user" + error);
      if (error.code === "ConditionalCheckFailedException") {
        throw new Error("The nickname is already in use");
      } else {
        throw error;
      }
    }
  }

  static async fetchAll() {
    const params = {
      TableName: "user",
    };
    const result = await dynamodb.scan(params).promise();
    const users = result.Items.map((item) => {
      const {
        id: { S: id },
        nickName: { S: nickName } = { S: "" },
        description: { S: description } = { S: "" },
        occupation: { S: occupation } = { S: "" },
        avatarUrl: { S: avatarUrl } = { S: "" },
      } = item;
      return new this({ id, nickName, description, avatarUrl, occupation });
    });
    return users;
  }

  static async fetchById({ id }) {
    const params = {
      TableName: "user",
      Key: {
        id: { S: id },
      },
    };
    const result = await dynamodb.getItem(params).promise();
    if (!result.Item) {
      return null;
    }
    const {
      nickName: { S: nickName } = { S: "" },
      firstName: { S: firstName } = { S: "" },
      lastName: { S: lastName } = { S: "" },
      description: { S: description } = { S: "" },
      occupation: { S: occupation } = { S: "" },
      avatarUrl: { S: avatarUrl } = { S: "" },
      email: { S: email },
    } = result.Item;
    return new this({
      id,
      firstName,
      email,
      nickName,
      lastName,
      occupation,
      description,
      avatarUrl,
    });
  }

  async update({
    nickName,
    firstName,
    lastName,
    occupation,
    description,
    avatarUrl,
  }) {
    const validProperties = {
      nickName,
      firstName,
      lastName,
      occupation,
      description,
      avatarUrl,
    };
    const updateExpressionParts = [];
    const expressionAttributeValues = {};

    for (const key in validProperties) {
      const value = validProperties[key];
      if (value !== undefined) {
        updateExpressionParts.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = { S: value || this.value };
        this[key] = value;
      }
    }

    const updateExpression = `SET ${updateExpressionParts.join(", ")}`;
    const params = {
      TableName: "user",
      Key: {
        id: { S: this.id },
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    //WIP: SOLVE this bug
    try {
      await dynamodb.updateItem(params).promise();
      return this;
    } catch (error) {
      console.error("Error in update", error);
      throw error;
    }
  }

  async delete() {
    const params = {
      TableName: "user",
      Key: {
        id: { S: this.id },
      },
    };
    await dynamodb.deleteItem(params).promise();
  }
}

module.exports = User;
