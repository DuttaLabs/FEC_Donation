const apiKey = "plpB2j8ZSG7iUMlAvBuOGgblz3mT6x0c6fVZi1v1";
const categoryHeaders = {
  name: "Name",
  address: "Address",
  amount: "Amount",
  date: "Date",
  recipient: "Recipient",
};
const tableHeaders = Object.values(categoryHeaders);
const numOfHeaders = tableHeaders.length;
const colWidth = 200; // column width in pixels

//console.log(tableHeaders);
document.getElementById("contribForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const contribName = document.getElementById("name").value;
  const selectedState = document.getElementById("state").value;

  let url = `https://api.open.fec.gov/v1/schedules/schedule_a/?api_key=${apiKey}&contributor_name=${contribName}&per_page=100&page=1`;

  if (selectedState.length > 0) {
    url += `&contributor_state=${selectedState}`;
  }

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const resultsTable = document.getElementById("resultsTable");
      resultsTable.setAttribute("width", colWidth * numOfHeaders);
      let headerString = "";
      tableHeaders.forEach((header) => {
        headerString += `<th width=${colWidth}>${header}</th>`;
      });
      resultsTable.innerHTML = `<tr> ${headerString} </tr>`;

      if (data.results && data.results.length > 0) {
        data.results.forEach((contribution) => {
          //if (selectedState == "" || selectedState == contribution.contributor_state) {
          const contribNameFormatted = convertNameFormat(contribution.contributor_name);
          const recipient = contribution.committee.name;
          let party = "";
          if (recipient == "ACTBLUE") {
            party = "dem";
          } else if (recipient == "WINRED") {
            party = "repub";
          }
          resultsTable.innerHTML += `
            <tr class = ${party}>
                  <td> ${contribNameFormatted}</td>
                  <td> ${contribution.contributor_city}, ${contribution.contributor_state}</td>
                  <td> ${contribution.contribution_receipt_amount}</td>
                  <td> ${contribution.contribution_receipt_date}</td>
                  <td> ${contribution.committee.name}</td>
            </tr>
              `;
          /*           } else {
            resultsTable.innerHTML = "<p>No contributions found for this donor.</p>";
          } */
        });
      } else {
        resultsTable.innerHTML = "<p>No contributions found for this donor.</p>";
      }
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
      document.getElementById("results").innerHTML = "An error occurred while fetching data.";
    });
});

function convertNameFormat(name) {
  // Split the input string by the comma
  const [lastName, firstName] = name.split(", ");

  // Function to capitalize the first letter and make the rest lowercase
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // Capitalize both first and last names
  const formattedFirstName = capitalize(firstName);
  const formattedLastName = capitalize(lastName);

  // Combine the first name and last name with a space
  return `${formattedFirstName} ${formattedLastName}`;
}
