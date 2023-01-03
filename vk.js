const axios = require("axios");

class VK {
  constructor(token) {
    this.token = token;
  }
  async getMembers(groupId, offset) {
    const url = `https://api.vk.com/method/groups.getMembers?v=5.131&access_token=${this.token}&count=1000&group_id=${groupId}&fields=relation&offset=${offset}`;
    const response = await axios.get(url);
    return response.data;
  }
  async getGroupInfo(groupId) {
    const url = `https://api.vk.com/method/groups.getById?v=5.131&access_token=${this.token}&group_id=${groupId}`;
    const response = await axios.get(url);
    return response.data;
  }
}

module.exports = VK;
