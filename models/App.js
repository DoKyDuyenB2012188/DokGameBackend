const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  required_age: {
    type: Number,
    default: 0,
  },
  is_free: {
    type: Boolean,
    default: false,
  },
  detailed_description: {
    type: String,
    default: "",
  },
  supported_languages: {
    type: String,
    default: "",
  },
  header_image: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  pc_requirements: {
    minimum:{
        type: String,
        default: "",
    }
  },
  mac_requirements: {
    minimum:{
        type: String,
        default: "",
    }
  },
  linux_requirements: {
    minimum:{
        type: String,
        default: "",
    }
  },
  developers: [String],
  publishers: [String],
  price_overview: {
    currency:{
        type: String,
        default: "",
    },
    initial:{
        type: Number,
        default: 0,
    },
    final: {
        type: Number,
        default: 0,
    },
    discount_percent:{
        type: Number,
        default: 0,
    },
    initial_formatted:{
        type: String,
        default: "",
    },
    final_formatted:{
        type: String,
        default: "",
    },
  },
  platforms: {
    windows: {
        type: Boolean,
        default: false,
    },
    mac: {
        type: Boolean,
        default: false,
    },
    linux: {
        type: Boolean,
        default: false,
    },
  },
  metacritic: {
    score: {
        type: Number,
        default: 0,
    },
    url: {
        type: String,
        default: "",
    },
  },
  categories: [{
    id:{
        type: Number,
        default: 0,
    },
    description:{
        type: String,
        default: "",
    }
  }],
  genres: [{
    id:{
        type: String,
        default: 0,
    },
    description:{
        type: String,
        default: "",
    }
  }],
  screenshots: [{
    id:{
        type: Number,
        default: 0,
    },
    path_thumbnail:{
        type: String,
        default: "",
    },
    path_full:{
        type: String,
        default: "",
    }
  }],
  recommendations: {
    total:{
        type: Number,
        default: 0,
    },
  },
  movies: [{
    id:{
        type: Number,
        default: 0,
    },
    name:{
        type: String,
        default: "",
    },
    path_thumbnail:{
        type: String,
        default: "",
    },
    webm:{
        480:{
            type: String,
            default: "", 
        },
        max:{
            type: String,
            default: "",
        }
    },
    mp4:{
        480:{
            type: String,
            default: "", 
        },
        max:{
            type: String,
            default: "",
        }
    },
    highlight:{
        type: Boolean,
        default: false,
    }
  }],
  release_date: {
    coming_soon:{
        type: Boolean,
        default: false,
    },
    date:{
        type: String,
        default: "",
    }
  },
  background: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("apps", AppSchema);
