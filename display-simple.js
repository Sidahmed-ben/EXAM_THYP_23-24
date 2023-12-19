let Sportif = [];
let sportData = [];

async function getData() {
  try {
    const response = await fetch("http://localhost:8080/omeka-s/api/items");
    if (!response.ok) {
      throw new Error("La réponse n'a pas pu être retourné");
    }

    return response.json();
  } catch (error) {
    console.error("Un problème serveur est survenu :", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});

async function main() {
  const items = await getData();
  // console.log(items);

  if (items) {
    removeLoader();
    showItems(items);
  }
}

function showItems(items) {
  console.log(items);

  sportData = getItemsFiltered(items, "sp:Sport");
  const Sport = d3
    .select(".sport")
    .append("h2")
    .style("color", "red")
    .text("Liste des Sports :")
    .selectAll("li")
    .data(sportData)
    .enter()
    .append("li")
    .attr("class", "list-group-item");

  Sport.append("h2").text(function (d) {
    return "Nom : " + d["sp:sportName"][0]["@value"];
  });

  Sport.append("h2").text(function (d) {
    return "Identifiant : " + d["o:id"];
  });

  Sport.append("h2").text(function (d) {
    return "Titre : " + d["o:title"];
  });

  const sportifData = getItemsFiltered(items, "sp:Sportif");
  Sportif = d3
    .select(".sportif")
    .style("margin-top", "10px")
    .append("h2")
    .style("color", "red")
    .text("Liste des Sportifs :")
    .selectAll("li")
    .data(sportifData)
    .enter()
    .append("li")
    .attr("class", "list-group-item");

  Sportif.append("h2").text(function (d) {
    return "Titre : " + d["o:title"];
  });

  Sportif.append("h2").text(function (d) {
    return "Identifiant : " + d["o:id"];
  });

  Sportif.append("h2").text(function (d) {
    return (
      "Sport : " +
      getSportById(sportData, d["sp:hasSport"][0]["value_resource_id"])
    );
  });

  Sportif.append("h2").text(function (d) {
    return "Score : " + d["sp:hasScore"][0]["@value"];
  });

  d3.select("#footballFilter").on("click", function () {
    filterSportItems("Football");
  });

  d3.select("#natationFilter").on("click", function () {
    filterSportItems("Natation");
  });
  d3.select("#none").on("click", function () {
    filterSportItems("");
  });
}

function getItemsFiltered(items, type) {
  return items.filter((item) => item["@type"][1] === type);
}

function removeLoader() {
  d3.select(".spinner-grow").style("display", "none");
}

function getSportById(data, id) {
  for (let i = 0; i < data.length; i++) {
    if (data[i]["o:id"] == id) {
      return data[i]["sp:sportName"][0]["@value"];
    }
  }
  return null;
}

function filterSportItems(sportType) {
  if (sportType) {
    Sportif.style("display", function (d) {
      const currentSport = getSportById(
        sportData,
        d["sp:hasSport"][0]["value_resource_id"]
      );
      return currentSport === sportType ? "block" : "none";
    });
  } else {
    Sportif.style("display", function (d) {
      return "block";
    });
  }
}
