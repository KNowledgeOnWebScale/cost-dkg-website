module.exports.filter_label = (data, string_match) => {
    //console.log(data)
    let filteredData = {data: []};
    for (const o of data.data) {
      
      if (typeof o.name === 'undefined') {
        continue;
      } 

      console.log(o.name)
      if (o.name.toLowerCase().includes(string_match)) {
        filteredData.data.push(o);
      }
    }
    //console.log("end");
    return filteredData;
  };