const md = require('markdown-it')({ html: true });

module.exports = {
  markdownWorkshop: function(data) {
    if (data.data.length > 0 && data.data[0].name && data.data[0].name.toLowerCase().includes('workshop')) {
      const workshop = data.data[0];

      if (workshop.about) {
        workshop.about = render(workshop.about);
      }

      if (workshop.agenda1) {
        workshop.agenda1 = render(workshop.agenda1);
      }

      if (workshop.agenda2) {
        workshop.agenda2 = render(workshop.agenda2);
      }

      if (workshop.plan) {
        workshop.plan = render(workshop.plan);
      }

      if (workshop.extraInfo) {
        workshop.extraInfo = render(workshop.extraInfo);
      }

      if (workshop.action) {
        workshop.action = render(workshop.action);
      }
    }

    if (data.data.length > 0 && data.data[0].name && data.data[0].travel && data.data[0].name.toLowerCase().includes('workshop')) {
      const workshop = data.data[0];

      if (workshop.about) {
        workshop.about = render(workshop.about);
      }

      if (workshop.plan) {
        workshop.plan = render(workshop.plan);
      }

      if (workshop.journalIssue) {
        workshop.journalIssue = render(workshop.journalIssue);
      }

      if (workshop.travel) {
        workshop.travel = render(workshop.travel);
      }

      if (workshop.committee) {
        workshop.committee = render(workshop.committee);
      }
    }

    return data;
  }
};

function render(data) {
  return md.render(data);
}
