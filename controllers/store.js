const App = require("../models/App");

exports.getApps = async (req, res) => {
  try {
    const apps = await App.find({});
    res.json({ success: true, data: apps});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getApp = async (req, res) => {
  const appId = req.params.appId;
  try {
    const app = await App.findById(appId);
    res.json({ success: true, data: app });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getFilter = async (req, res) => {
//genres=action&platform=windows&release=2000-2009
  try {
  let url = req.url.split("/")[1];
  let result = {};
  let filter = [];
  let proc = req.params.filter.split('&');
  proc.forEach((ft)=>{
    filter.push({value: ft.split('=')[1], label: ft.split('=')[0]})
  })
  if (filter.length == 1) {
    if (url == "best" && filter[0].label == "all") {
      result = await App.find({ "metacritic.score": { $gt: 80 } });
    } else if (filter[0].label == "genres") {
      result = await App.find({
        genres: { $elemMatch: { description: filter[0].value } },
      });
    } else if (filter[0].label == "platforms") {
      let query = {};
      if (filter[0].value == "windows") {
        query = { "platforms.windows": "true" };
      } else if (filter[0].value == "linux") {
        query = { "platforms.linux": "true" };
      } else if (filter[0].value == "mac") {
        query = { "platforms.mac": "true" };
      }
      result = await App.find(query);
    } else if (filter[0].label == "release") {
      result = await (
        await App.find({})
      ).filter((el) => {
        let dateFilter = filter[0].value;
        let min = Number(dateFilter.split("-")[0]);
        let max = Number(dateFilter.split("-")[1]);
        let year = Number(el.release_date.date.split(" ")[2]);
        if (year >= min && year <= max) return el;
      });
    }
  } else if (filter.length == 2) {
    // genres & platforms
    // genres & release
    // platforms & release
    if (filter[0].label == "genres" && filter[1].label == "platforms") {
      let query = {};
      if (filter[1].value == "windows") {
        query = {
          genres: { $elemMatch: { description: filter[0].value } },
          "platforms.windows": "true",
        };
      } else if (filter[1].value == "linux") {
        query = {
          genres: { $elemMatch: { description: filter[0].value } },
          "platforms.linux": "true",
        };
      } else if (filter[1].value == "mac") {
        query = {
          genres: { $elemMatch: { description: filter[0].value } },
          "platforms.mac": "true",
        };
      }
      result = await App.find(query);
    } else if (filter[0].label == "genres" && filter[1].label == "release") {
      result = await (
        await App.find({
          genres: { $elemMatch: { description: filter[0].value } },
        })
      ).filter((el) => {
        let dateFilter = filter[1].value;
        let min = Number(dateFilter.split("-")[0]);
        let max = Number(dateFilter.split("-")[1]);
        let year = Number(el.release_date.date.split(" ")[2]);
        if (year >= min && year <= max) return el;
      });
    } else if (filter[0].label == "platforms" && filter[1].label == "release") {
      let query = {};
      if (filter[0].value == "windows") {
        query = { "platforms.windows": "true" };
      } else if (filter[0].value == "linux") {
        query = { "platforms.linux": "true" };
      } else if (filter[0].value == "mac") {
        query = { "platforms.mac": "true" };
      }
      result = await (
        await App.find(query)
      ).filter((el) => {
        let dateFilter = filter[1].value;
        let min = Number(dateFilter.split("-")[0]);
        let max = Number(dateFilter.split("-")[1]);
        let year = Number(el.release_date.date.split(" ")[2]);
        if (year >= min && year <= max) return el;
      });
    }
  }
  // genre platform release
  else if (filter.length == 3) {
    let query = {};
    if (filter[1].value == "windows") {
      query = {
        genres: { $elemMatch: { description: filter[0].value } },
        "platforms.windows": "true",
      };
    } else if (filter[1].value == "linux") {
      query = {
        genres: { $elemMatch: { description: filter[0].value } },
        "platforms.linux": "true",
      };
    } else if (filter[1].value == "mac") {
      query = {
        genres: { $elemMatch: { description: filter[0].value } },
        "platforms.mac": "true",
      };
    }
    result = await (
      await App.find(query)
    ).filter((el) => {
      let dateFilter = filter[2].value;
      let min = Number(dateFilter.split("-")[0]);
      let max = Number(dateFilter.split("-")[1]);
      let year = Number(el.release_date.date.split(" ")[2]);
      if (year >= min && year <= max) return el;
    });
  }
  if (url == "best" && filter[0].label != "all") {
    let data = [];
    Object.keys(result).forEach((i) => {
      if (result[i].metacritic.score >= 80) {
        data.push(result[i]);
      }
    });
    result = data;
  }
  res.json({ success: true, data: result});
  } catch (error) {
    res.json({ success: false, message: error});
  }
};
