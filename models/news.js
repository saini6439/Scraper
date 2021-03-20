const mongoose = require('mongoose');

var news_lifestylelist = new mongoose.Schema({
    title: {
        type: String
    },
    link: {
        type: String
    },
    img: {
        type: String
    },
    summary: {
        type: String
    },
    date:{
        type: String
    }
});

var news_sportslist = new mongoose.Schema({
    title: {
        type: String
    },
    link: {
        type: String
    },
    img: {
        type: String
    },
    summary: {
        type: String
    },
    date:{
        type: String
    }
});

var news_businesslist = new mongoose.Schema({
    title: {
        type: String
    },
    link: {
        type: String
    },
    img: {
        type: String
    },
    summary: {
        type: String
    },
    date:{
        type: String
    }
});

const news_sports = mongoose.model("sports", news_sportslist);
const news_business = mongoose.model("busines", news_businesslist);
const news_lifestyle = mongoose.model("news", news_lifestylelist);
module.exports = {
    news_lifestyle,news_sports,news_business
  };
  